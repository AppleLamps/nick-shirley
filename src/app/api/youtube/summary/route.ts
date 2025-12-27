import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { transcript, videoTitle } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'transcript is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
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
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are summarizing videos from Nick Shirley, an independent journalist known for on-the-ground reporting.

Provide a helpful, informative summary that:
1. Explains what the video is about in 2-3 sentences
2. Lists the key topics or events covered (bullet points)
3. Highlights any important insights or revelations
4. Notes the locations or events being reported on

Keep the summary concise but comprehensive. Focus on the substance of Nick's journalism.`,
          },
          {
            role: 'user',
            content: `Please summarize this video titled "${videoTitle || 'Untitled'}":

Transcript:
${truncatedTranscript}`,
          },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate summary' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || 'Unable to generate summary.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
