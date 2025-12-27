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
            content: `Summarize this video titled "${videoTitle || 'Untitled'}":

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
