import { NextRequest, NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';
import { getTranscript, saveTranscript } from '@/lib/db';
import * as fs from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

interface DiarizedSegment {
  speaker: string;
  text: string;
  start: number;
  end: number;
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

    // Create YouTube client
    const youtube = await Innertube.create();

    // Get full video info
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

        console.log(`Looking for transcript matching: ${targetTitle}`);

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
        } else {
            console.log(`No local transcript file found for: ${videoTitle}`);
        }
      }
    } catch (err) {
      console.error('Error checking local transcripts:', err);
    }

    return NextResponse.json(
      { error: 'Transcript not found for this video.' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error processing transcript request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 }
    );
  }
}
