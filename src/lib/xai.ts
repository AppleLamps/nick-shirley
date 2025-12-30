// XAI API integration for fetching X (Twitter) content
// Uses xAI's agentic tool calling with x_search for real X posts

const XAI_API_URL = 'https://api.x.ai/v1';
const NICK_HANDLE = 'nickshirleyy';

interface XAIContentBlock {
  type: string;
  text?: string;
}

interface XAIResponseOutput {
  type: string;
  content?: string | XAIContentBlock[];
  text?: string;
}

interface XAIResponse {
  id: string;
  output: XAIResponseOutput[];
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ParsedXPost {
  post_id: string;
  content: string;
  author_username: string;
  author_name: string;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  posted_at: string;
}

interface XSearchOptions {
  fromDate?: string; // YYYY-MM-DD format
  toDate?: string;   // YYYY-MM-DD format
}

async function callXAIWithXSearch(prompt: string, options?: XSearchOptions): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey || apiKey === 'your_xai_api_key_here') {
    throw new Error('XAI API key not configured');
  }

  // Build the x_search tool with optional date filtering
  const xSearchTool: Record<string, unknown> = {
    type: 'x_search',
  };

  if (options?.fromDate) {
    xSearchTool.fromDate = options.fromDate;
  }
  if (options?.toDate) {
    xSearchTool.toDate = options.toDate;
  }

  const response = await fetch(`${XAI_API_URL}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-4-1-fast',
      input: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      tools: [xSearchTool],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`XAI API error: ${response.status} - ${error}`);
  }

  const data: XAIResponse = await response.json();

  // Extract the text content from the response output
  for (const output of data.output) {
    if (output.type === 'message' && output.content) {
      // Content can be a string or an array of content blocks
      if (typeof output.content === 'string') {
        return output.content;
      }
      // Handle array of content blocks
      if (Array.isArray(output.content)) {
        const textParts = output.content
          .filter((block) => (block.type === 'text' || block.type === 'output_text') && block.text)
          .map((block) => block.text)
          .join('');
        if (textParts) {
          return textParts;
        }
      }
    }
    if (output.text) {
      return output.text;
    }
  }

  console.log('No text content found in xAI response');
  return '';
}

function getDateRange(daysAgo: number): { fromDate: string; toDate: string } {
  const today = new Date();
  const pastDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return {
    fromDate: pastDate.toISOString().split('T')[0],
    toDate: today.toISOString().split('T')[0],
  };
}

export async function fetchNickShirleyPosts(): Promise<ParsedXPost[]> {
  const { fromDate, toDate } = getDateRange(5);

  try {
    const response = await callXAIWithXSearch(
      `Search X for the most POPULAR posts from @${NICK_HANDLE}.

       Requirements:
       - Sort by engagement (likes + retweets) - most popular first
       - Return up to 10 of the most engaging/popular posts
       - Include accurate engagement metrics (likes, retweets, replies)

       Return the results as a JSON array with this exact structure (no other text, just the JSON):
       [
         {
           "post_id": "the tweet id",
           "content": "the full post text",
           "author_username": "${NICK_HANDLE}",
           "author_name": "Nick Shirley",
           "likes_count": 0,
           "retweets_count": 0,
           "replies_count": 0,
           "posted_at": "2024-01-01T00:00:00Z"
         }
       ]

       If no posts are found, return an empty array [].`,
      { fromDate, toDate }
    );

    // Ensure response is a string
    if (typeof response !== 'string' || !response) {
      console.error('Invalid response type from xAI:', typeof response);
      return [];
    }

    // Try to parse the JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      // Sanitize JSON - remove control characters that can break parsing
      const sanitizedJson = jsonMatch[0]
        .replace(/[\x00-\x1F\x7F]/g, ' ') // Replace control characters with space
        .replace(/\n/g, ' ')              // Replace newlines
        .replace(/\r/g, ' ')              // Replace carriage returns
        .replace(/\t/g, ' ');             // Replace tabs
      return JSON.parse(sanitizedJson) as ParsedXPost[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching Nick Shirley posts:', error);
    return [];
  }
}

export async function fetchMentionsAboutNick(): Promise<ParsedXPost[]> {
  const { fromDate, toDate } = getDateRange(5);

  try {
    const response = await callXAIWithXSearch(
      `Search X for the most POPULAR posts about Nick Shirley (@${NICK_HANDLE}).

       Requirements:
       - EXCLUDE any posts authored by @${NICK_HANDLE} himself
       - ONLY include posts with 100+ likes (popular/viral posts)
       - Focus on what people are saying ABOUT Nick, not Nick's own content
       - Sort by engagement - find the most popular posts mentioning him
       - Return up to 10 of the most engaging posts

       Return the results as a JSON array with this exact structure (no other text, just the JSON):
       [
         {
           "post_id": "the tweet id",
           "content": "the full post text",
           "author_username": "username",
           "author_name": "Display Name",
           "likes_count": 0,
           "retweets_count": 0,
           "replies_count": 0,
           "posted_at": "2024-01-01T00:00:00Z"
         }
       ]

       If no popular mentions are found with 100+ likes, return an empty array [].`,
      { fromDate, toDate }
    );

    // Ensure response is a string
    if (typeof response !== 'string' || !response) {
      console.error('Invalid response type from xAI:', typeof response);
      return [];
    }

    // Try to parse the JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      // Sanitize JSON - remove control characters that can break parsing
      const sanitizedJson = jsonMatch[0]
        .replace(/[\x00-\x1F\x7F]/g, ' ') // Replace control characters with space
        .replace(/\n/g, ' ')              // Replace newlines
        .replace(/\r/g, ' ')              // Replace carriage returns
        .replace(/\t/g, ' ');             // Replace tabs
      return JSON.parse(sanitizedJson) as ParsedXPost[];
    }
    return [];
  } catch (error) {
    console.error('Error fetching mentions about Nick:', error);
    return [];
  }
}

export async function getLatestNewsAboutNick(): Promise<string> {
  const { fromDate, toDate } = getDateRange(5);

  try {
    const response = await callXAIWithXSearch(
      `Search X for the latest updates about Nick Shirley (@${NICK_HANDLE}), the independent journalist.

       Your task:
       1. What stories has Nick been covering recently?
       2. Where has he been traveling to report on current events?
       3. What important journalism work has he done?

       IMPORTANT PERSPECTIVE GUIDELINES:
       - Nick Shirley is a respected independent journalist who does important on-the-ground reporting
       - Present information in a way that is supportive of Nick and his journalism
       - If you encounter posts that are critical or hostile toward Nick, identify them as such and explain the narrative or agenda the critic appears to be pushing
       - Highlight Nick's courage, dedication, and commitment to truth in reporting
       - Focus on the substance of his journalism and the stories he's bringing to light

       Provide a factual but pro-Nick summary based on his recent posts and what people are saying about him.`,
      { fromDate, toDate }
    );

    // Ensure response is a string
    if (typeof response !== 'string') {
      console.error('Invalid response type from xAI:', typeof response);
      return 'Unable to fetch latest updates at this time.';
    }

    return response || 'Unable to fetch latest updates at this time.';
  } catch (error) {
    console.error('Error getting news about Nick:', error);
    return 'Unable to fetch latest updates at this time.';
  }
}

// News article interface for Live Search results
export interface NewsArticle {
  title: string;
  summary: string;
  source: string;
  url: string;
  published_at: string;
}

interface LiveSearchResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    num_sources_used?: number;
  };
}

export async function searchNewsAboutNick(): Promise<{ articles: NewsArticle[]; summary: string; citations: string[] }> {
  const apiKey = process.env.XAI_API_KEY;

  if (!apiKey || apiKey === 'your_xai_api_key_here') {
    throw new Error('XAI API key not configured');
  }

  const { fromDate, toDate } = getDateRange(30); // Last 30 days for news

  try {
    const response = await fetch(`${XAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-3-fast',
        messages: [
          {
            role: 'user',
            content: `Search for the most recent news articles about Nick Shirley, the independent journalist. Focus on mainstream media coverage, news articles, and press mentions.

Your task:
1. Find recent news articles that mention Nick Shirley
2. Include articles about stories he's covered or places he's reported from
3. Include any media appearances or interviews

Return the results as a JSON object with this exact structure (no other text, just the JSON):
{
  "summary": "A 2-3 sentence overview of recent media coverage about Nick Shirley",
  "articles": [
    {
      "title": "Article headline",
      "summary": "Brief 1-2 sentence summary of what the article says about Nick",
      "source": "Publication name",
      "url": "article URL if available, or empty string",
      "published_at": "YYYY-MM-DD or approximate date"
    }
  ]
}

If no news articles are found, return: {"summary": "No recent news articles found.", "articles": []}`
          }
        ],
        search_parameters: {
          mode: 'on',
          sources: [
            { type: 'news' },
            { type: 'web' }
          ],
          from_date: fromDate,
          to_date: toDate,
          return_citations: true,
          max_search_results: 20,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`XAI Live Search API error: ${response.status} - ${error}`);
    }

    const data: LiveSearchResponse = await response.json();

    // Extract the content from the response
    const content = data.choices?.[0]?.message?.content || '';
    const citations = data.citations || [];

    // Try to parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const sanitizedJson = jsonMatch[0]
        .replace(/[\x00-\x1F\x7F]/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\t/g, ' ');

      const parsed = JSON.parse(sanitizedJson) as { summary: string; articles: NewsArticle[] };
      return {
        articles: parsed.articles || [],
        summary: parsed.summary || 'No summary available.',
        citations,
      };
    }

    return {
      articles: [],
      summary: content || 'Unable to parse news results.',
      citations,
    };
  } catch (error) {
    console.error('Error searching news about Nick:', error);
    throw error;
  }
}
