// XAI API integration for fetching X (Twitter) content
// XAI's Grok can be used to search and analyze X posts

const XAI_API_URL = 'https://api.x.ai/v1';

interface XAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface XAIResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ParsedXPost {
  post_id: string;
  content: string;
  author_username: string;
  author_name: string;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  posted_at: string;
}

async function callXAI(messages: XAIMessage[]): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey || apiKey === 'your_xai_api_key_here') {
    throw new Error('XAI API key not configured');
  }

  const response = await fetch(`${XAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`XAI API error: ${response.status} - ${error}`);
  }

  const data: XAIResponse = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function fetchNickShirleyPosts(): Promise<ParsedXPost[]> {
  try {
    const response = await callXAI([
      {
        role: 'system',
        content: `You are a helpful assistant that searches X (Twitter) for recent posts.
                  Return results as a JSON array with the exact structure specified.
                  Only return the JSON, no other text.`,
      },
      {
        role: 'user',
        content: `Search for the 10 most recent posts from Nick Shirley (@nickshirley) on X.
                  Return as JSON array with this exact structure:
                  [
                    {
                      "post_id": "unique_id",
                      "content": "post text content",
                      "author_username": "nickshirley",
                      "author_name": "Nick Shirley",
                      "likes_count": 0,
                      "retweets_count": 0,
                      "replies_count": 0,
                      "posted_at": "2024-01-01T00:00:00Z"
                    }
                  ]
                  If you cannot find real posts, return an empty array [].`,
      },
    ]);

    // Try to parse the JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ParsedXPost[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching Nick Shirley posts:', error);
    return [];
  }
}

export async function fetchMentionsAboutNick(): Promise<ParsedXPost[]> {
  try {
    const response = await callXAI([
      {
        role: 'system',
        content: `You are a helpful assistant that searches X (Twitter) for posts mentioning someone.
                  Return results as a JSON array with the exact structure specified.
                  Only return the JSON, no other text.`,
      },
      {
        role: 'user',
        content: `Search for the 10 most recent posts on X that mention Nick Shirley or @nickshirley.
                  Exclude posts by Nick Shirley himself.
                  Return as JSON array with this exact structure:
                  [
                    {
                      "post_id": "unique_id",
                      "content": "post text content",
                      "author_username": "someuser",
                      "author_name": "Some User",
                      "likes_count": 0,
                      "retweets_count": 0,
                      "replies_count": 0,
                      "posted_at": "2024-01-01T00:00:00Z"
                    }
                  ]
                  If you cannot find real posts, return an empty array [].`,
      },
    ]);

    // Try to parse the JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ParsedXPost[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching mentions about Nick:', error);
    return [];
  }
}

export async function getLatestNewsAboutNick(): Promise<string> {
  try {
    const response = await callXAI([
      {
        role: 'system',
        content: `You are a knowledgeable assistant that provides updates about journalists and their work.`,
      },
      {
        role: 'user',
        content: `What are the latest updates about Nick Shirley, the independent journalist?
                  What stories has he been covering recently?
                  Where has he been traveling to report on current events?
                  Provide a brief, factual summary.`,
      },
    ]);

    return response;
  } catch (error) {
    console.error('Error getting news about Nick:', error);
    return 'Unable to fetch latest updates at this time.';
  }
}
