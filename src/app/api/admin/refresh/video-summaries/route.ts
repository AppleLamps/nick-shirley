import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for processing multiple videos

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface VideoWithTranscript {
    video_id: string;
    title: string;
    full_text: string;
}

async function generateSummary(transcript: string, videoTitle: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
    }

    // Truncate transcript if too long (keep under token limits)
    const maxLength = 150000;
    const truncatedTranscript = transcript.length > maxLength
        ? transcript.substring(0, maxLength) + '...'
        : transcript;

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://nickshirley.com',
            'X-Title': 'Nick Shirley Portfolio',
        },
        body: JSON.stringify({
            model: 'x-ai/grok-4.1-fast',
            messages: [
                {
                    role: 'system',
                    content: `You are summarizing a video by Nick Shirley, an independent journalist.

Your job is to provide an HONEST and ACCURATE summary of what is discussed in this video. 

IMPORTANT GUIDELINES:
- Summarize ONLY what is actually said in the video
- Do NOT fact-check, add disclaimers, or present opposing viewpoints
- Do NOT add balanced perspectives or alternative interpretations
- Do NOT editorialize or add your own opinions
- Simply capture the content, topics, and key points discussed
- Be faithful to the speaker's perspective and framing

Format your summary as:
1. A brief 2-3 sentence overview of what the video covers
2. Key topics and points discussed (bullet points)
3. Notable interviews, locations, or events featured (if any)

Keep the summary concise but comprehensive.`,
                },
                {
                    role: 'user',
                    content: `Summarize this video titled "${videoTitle}":

Transcript:
${truncatedTranscript}`,
                },
            ],
            max_tokens: 4000,
            temperature: 0.5,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('OpenRouter API error:', error);
        throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Unable to generate summary.';
}

export async function POST() {
    try {
        // Get all videos that have transcripts
        const videosWithTranscripts = await sql`
      SELECT v.video_id, v.title, t.full_text
      FROM youtube_videos v
      INNER JOIN youtube_transcripts t ON v.video_id = t.video_id
      ORDER BY v.published_at DESC
    ` as VideoWithTranscript[];

        if (videosWithTranscripts.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No videos with transcripts found',
                processed: 0,
            });
        }

        let processed = 0;
        let failed = 0;
        const errors: string[] = [];

        for (const video of videosWithTranscripts) {
            try {
                console.log(`Generating summary for: ${video.title}`);
                const summary = await generateSummary(video.full_text, video.title);

                // Update the video with the new summary
                await sql`
          UPDATE youtube_videos
          SET summary = ${summary}
          WHERE video_id = ${video.video_id}
        `;

                processed++;

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Failed to generate summary for ${video.title}:`, error);
                failed++;
                errors.push(video.title);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Generated ${processed} summaries${failed > 0 ? `, ${failed} failed` : ''}`,
            processed,
            failed,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('Error refreshing video summaries:', error);
        return NextResponse.json(
            { error: 'Failed to refresh video summaries' },
            { status: 500 }
        );
    }
}
