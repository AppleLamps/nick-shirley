import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import OpenAI, { toFile } from 'openai';
import { getTranscript, saveTranscript } from '@/lib/db';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for audio processing

// Set ffmpeg path
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

interface DiarizedSegment {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface TranscriptResponse {
  text?: string;
  segments?: DiarizedSegment[];
}

const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24MB to be safe (limit is 25MB)
const CHUNK_DURATION = 600; // 10 minutes per chunk in seconds

async function splitAudioIntoChunks(
  inputPath: string,
  totalDuration: number
): Promise<string[]> {
  const chunkPaths: string[] = [];
  const numChunks = Math.ceil(totalDuration / CHUNK_DURATION);
  const tempDir = path.dirname(inputPath);

  for (let i = 0; i < numChunks; i++) {
    const startTime = i * CHUNK_DURATION;
    const chunkPath = path.join(tempDir, `chunk_${i}.mp4`);
    chunkPaths.push(chunkPath);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(Math.min(CHUNK_DURATION, totalDuration - startTime))
        .output(chunkPath)
        .audioCodec('copy')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  return chunkPaths;
}

async function transcribeChunk(
  openai: OpenAI,
  audioBuffer: Buffer,
  chunkIndex: number,
  timeOffset: number
): Promise<DiarizedSegment[]> {
  const audioFile = await toFile(audioBuffer, `chunk_${chunkIndex}.mp4`, {
    type: 'audio/mp4',
  });

  const transcription = (await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'gpt-4o-transcribe',
    response_format: 'verbose_json',
  } as Parameters<typeof openai.audio.transcriptions.create>[0])) as TranscriptResponse;

  // Adjust timestamps with offset and add default speaker
  return (
    transcription.segments?.map((segment) => ({
      speaker: segment.speaker || 'Speaker',
      text: segment.text,
      start: segment.start + timeOffset,
      end: segment.end + timeOffset,
    })) || []
  );
}

async function transcribeWithDiarization(
  openai: OpenAI,
  audioBuffer: Buffer
): Promise<DiarizedSegment[]> {
  const audioFile = await toFile(audioBuffer, 'audio.mp4', {
    type: 'audio/mp4',
  });

  const transcription = (await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'gpt-4o-transcribe-diarize',
    response_format: 'verbose_json',
    chunking_strategy: 'auto',
  } as Parameters<typeof openai.audio.transcriptions.create>[0])) as TranscriptResponse;

  return (
    transcription.segments?.map((segment) => ({
      speaker: segment.speaker || 'Speaker',
      text: segment.text,
      start: segment.start,
      end: segment.end,
    })) || []
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json(
      { error: 'videoId parameter is required' },
      { status: 400 }
    );
  }

  // Create temp directory for this request
  const tempDir = path.join(os.tmpdir(), `transcript_${videoId}_${Date.now()}`);
  const audioPath = path.join(tempDir, 'audio.mp4');

  try {
    // Check if we have a cached transcript
    const cachedTranscript = await getTranscript(videoId);
    if (cachedTranscript) {
      console.log(`Serving cached transcript for video: ${videoId}`);
      return NextResponse.json({
        videoId,
        fullText: cachedTranscript.full_text,
        segments: cachedTranscript.segments,
        duration: cachedTranscript.duration_seconds,
        cached: true,
      });
    }

    // No cache, need to transcribe
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Get video info to check duration
    const info = await ytdl.getInfo(videoUrl);
    const durationSeconds = parseInt(info.videoDetails.lengthSeconds);

    console.log(
      `Processing video: ${info.videoDetails.title} (${durationSeconds}s)`
    );

    // Create temp directory
    fs.mkdirSync(tempDir, { recursive: true });

    // Download audio to temp file
    const audioStream = ytdl(videoUrl, {
      filter: 'audioonly',
      quality: 'lowestaudio',
    });

    const writeStream = fs.createWriteStream(audioPath);
    await new Promise<void>((resolve, reject) => {
      audioStream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      audioStream.on('error', reject);
    });

    const audioStats = fs.statSync(audioPath);
    const fileSizeMB = audioStats.size / 1024 / 1024;
    console.log(`Audio downloaded: ${fileSizeMB.toFixed(2)} MB`);

    // Create OpenAI client
    const openai = new OpenAI({ apiKey });

    let segments: DiarizedSegment[];

    if (audioStats.size <= MAX_FILE_SIZE) {
      // File is small enough, transcribe directly with diarization
      console.log('File size within limit, transcribing with diarization...');
      const audioBuffer = fs.readFileSync(audioPath);
      segments = await transcribeWithDiarization(openai, audioBuffer);
    } else {
      // File too large, need to chunk
      console.log(
        `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB, splitting into chunks...`
      );

      const chunkPaths = await splitAudioIntoChunks(audioPath, durationSeconds);
      console.log(`Split into ${chunkPaths.length} chunks`);

      segments = [];

      for (let i = 0; i < chunkPaths.length; i++) {
        const chunkPath = chunkPaths[i];
        const chunkBuffer = fs.readFileSync(chunkPath);
        const timeOffset = i * CHUNK_DURATION;

        console.log(
          `Transcribing chunk ${i + 1}/${chunkPaths.length} (offset: ${timeOffset}s)...`
        );

        const chunkSegments = await transcribeChunk(
          openai,
          chunkBuffer,
          i,
          timeOffset
        );
        segments.push(...chunkSegments);

        // Clean up chunk file
        fs.unlinkSync(chunkPath);
      }

      // Sort segments by start time (in case of any overlap issues)
      segments.sort((a, b) => a.start - b.start);
    }

    // Create full text with speaker labels
    const fullText = segments
      .map((s) => `[${s.speaker}]: ${s.text}`)
      .join('\n\n');

    // Save to cache
    await saveTranscript(videoId, fullText, segments, durationSeconds);
    console.log(`Saved transcript to cache for video: ${videoId}`);

    // Cleanup temp directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }

    return NextResponse.json({
      videoId,
      title: info.videoDetails.title,
      duration: durationSeconds,
      fullText,
      segments,
      cached: false,
      chunked: audioStats.size > MAX_FILE_SIZE,
    });
  } catch (error) {
    // Cleanup temp directory on error
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore cleanup errors
    }

    console.error('Error transcribing video:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Handle specific errors
    if (errorMessage.includes('Video unavailable')) {
      return NextResponse.json(
        { error: 'Video is unavailable or private.' },
        { status: 404 }
      );
    }

    if (errorMessage.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Failed to transcribe video: ${errorMessage}` },
      { status: 500 }
    );
  }
}
