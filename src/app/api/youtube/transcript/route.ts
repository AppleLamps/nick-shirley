import { NextRequest, NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';
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

  const tempDir = path.join(os.tmpdir(), `transcript_${videoId}_${Date.now()}`);
  const audioPath = path.join(tempDir, 'audio.webm');

  try {
    // Check cache first
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

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create YouTube client
    const youtube = await Innertube.create();

    // Get full video info with streaming data
    const info = await youtube.getInfo(videoId);
    const durationSeconds = info.basic_info.duration || 0;
    const videoTitle = info.basic_info.title || 'Unknown';

    console.log(`Processing video: ${videoTitle} (${durationSeconds}s)`);

    // Check for local transcript file
    try {
      const transcriptsDir = path.join(process.cwd(), 'src', 'app', 'transcripts');
      if (fs.existsSync(transcriptsDir)) {
        const files = fs.readdirSync(transcriptsDir);

        // Simple normalization for matching: remove special chars, lowercase
        const normalize = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const targetTitle = normalize(videoTitle);

        const matchedFile = files.find(file => {
          const fileNameWithoutExt = file.replace(/\.txt$/, '');
          return normalize(fileNameWithoutExt) === targetTitle;
        });

        if (matchedFile) {
          console.log(`Found local transcript file: ${matchedFile}`);
          const filePath = path.join(transcriptsDir, matchedFile);
          const content = fs.readFileSync(filePath, 'utf-8');

          // Parse the custom format: [Speaker]\nText
          const segments: DiarizedSegment[] = [];
          const lines = content.split('\n');
          let currentSpeaker = 'Speaker';
          let currentText = '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            const speakerMatch = trimmed.match(/^\[(.*?)\]$/);
            if (speakerMatch) {
              if (currentText) {
                segments.push({
                  speaker: currentSpeaker,
                  text: currentText.trim(),
                  start: 0, // No timestamp available in text file
                  end: 0
                });
                currentText = '';
              }
              currentSpeaker = speakerMatch[1];
            } else {
              currentText += ' ' + trimmed;
            }
          }

          // Add last segment
          if (currentText) {
            segments.push({
              speaker: currentSpeaker,
              text: currentText.trim(),
              start: 0,
              end: 0
            });
          }

          const fullText = segments.map(s => `[${s.speaker}]: ${s.text}`).join('\n\n');

          // Save to DB cache
          await saveTranscript(videoId, fullText, segments, durationSeconds);

          return NextResponse.json({
            videoId,
            title: videoTitle,
            duration: durationSeconds,
            fullText,
            segments,
            cached: false,
            source: 'local_file'
          });
        }
      }
    } catch (err) {
      console.error('Error checking local transcripts:', err);
      // Continue to YouTube download if local file fails
    }

    // Get streaming data
    const streamingData = info.streaming_data;
    if (!streamingData) {
      throw new Error('No streaming data available for this video');
    }

    // Find audio-only format from adaptive formats
    const adaptiveFormats = streamingData.adaptive_formats || [];
    const audioFormat = adaptiveFormats.find(
      (f) => f.mime_type?.startsWith('audio/') && f.url
    );

    if (!audioFormat || !audioFormat.url) {
      // Try to decipher if URL not directly available
      const formatWithDecipher = adaptiveFormats.find(
        (f) => f.mime_type?.startsWith('audio/')
      );

      if (!formatWithDecipher) {
        throw new Error('No audio format available for this video');
      }

      // Get the deciphered URL
      const decipheredUrl = await formatWithDecipher.decipher(youtube.session.player);
      if (!decipheredUrl) {
        throw new Error('Could not decipher audio URL');
      }

      console.log(`Using deciphered URL for format: ${formatWithDecipher.mime_type}`);

      // Create temp directory
      fs.mkdirSync(tempDir, { recursive: true });

      // Download audio from deciphered URL
      const response = await fetch(decipheredUrl);
      if (!response.ok) {
        throw new Error(`Failed to download audio: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(audioPath, Buffer.from(arrayBuffer));
    } else {
      console.log(`Using direct URL for format: ${audioFormat.mime_type}`);

      // Create temp directory
      fs.mkdirSync(tempDir, { recursive: true });

      // Download audio from direct URL
      const response = await fetch(audioFormat.url);
      if (!response.ok) {
        throw new Error(`Failed to download audio: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(audioPath, Buffer.from(arrayBuffer));
    }

    const audioStats = fs.statSync(audioPath);
    const fileSizeMB = audioStats.size / 1024 / 1024;
    console.log(`Audio downloaded: ${fileSizeMB.toFixed(2)} MB`);

    // Create OpenAI client
    const openai = new OpenAI({ apiKey });

    let segments: DiarizedSegment[];

    if (audioStats.size <= MAX_FILE_SIZE) {
      console.log('File size within limit, transcribing with diarization...');
      const audioBuffer = fs.readFileSync(audioPath);
      segments = await transcribeWithDiarization(openai, audioBuffer);
    } else {
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

        fs.unlinkSync(chunkPath);
      }

      segments.sort((a, b) => a.start - b.start);
    }

    const fullText = segments
      .map((s) => `[${s.speaker}]: ${s.text}`)
      .join('\n\n');

    await saveTranscript(videoId, fullText, segments, durationSeconds);
    console.log(`Saved transcript to cache for video: ${videoId}`);

    // Cleanup
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }

    return NextResponse.json({
      videoId,
      title: videoTitle,
      duration: durationSeconds,
      fullText,
      segments,
      cached: false,
      chunked: audioStats.size > MAX_FILE_SIZE,
    });
  } catch (error) {
    // Cleanup on error
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore
    }

    console.error('Error transcribing video:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Video unavailable') || errorMessage.includes('private')) {
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
