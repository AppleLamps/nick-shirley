const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

// Initialize DB connection
const sql = neon(process.env.DATABASE_URL);

async function syncTranscripts() {
  console.log('Starting transcript sync...');

  try {
    // 1. Get all videos from DB
    console.log('Fetching videos from database...');
    const videos = await sql`SELECT video_id, title, published_at FROM youtube_videos`;
    console.log(`Found ${videos.length} videos in database.`);

    // 2. List all transcript files
    const transcriptsDir = path.join(process.cwd(), 'src', 'app', 'transcripts');
    if (!fs.existsSync(transcriptsDir)) {
      console.log('Transcripts directory not found.');
      return;
    }

    const files = fs.readdirSync(transcriptsDir).filter(f => f.endsWith('.txt'));
    console.log(`Found ${files.length} transcript files.`);

    // 3. Match and sync
    let syncedCount = 0;
    
    // Normalization helper
    const normalize = (s) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    // Levenshtein distance for fuzzy matching
    const levenshteinDistance = (a, b) => {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) == a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    };

    for (const file of files) {
      const fileNameWithoutExt = file.replace(/\.txt$/, '');
      const normalizedFileName = normalize(fileNameWithoutExt);
      
      let matchedVideo = videos.find(v => normalize(v.title) === normalizedFileName);

      if (!matchedVideo) {
          // Fuzzy match
          let bestSimilarity = 0;
          let bestMatch = null;

          for (const video of videos) {
              const normalizedTitle = normalize(video.title);
              const distance = levenshteinDistance(normalizedFileName, normalizedTitle);
              const maxLength = Math.max(normalizedFileName.length, normalizedTitle.length);
              const similarity = 1 - (distance / maxLength);

              if (similarity > bestSimilarity) {
                  bestSimilarity = similarity;
                  bestMatch = video;
              }
          }

          if (bestSimilarity > 0.85) {
              matchedVideo = bestMatch;
              console.log(`Fuzzy matched "${file}" to "${matchedVideo.title}" (${(bestSimilarity * 100).toFixed(1)}%)`);
          }
      }

      if (matchedVideo) {
        // Parse transcript
        const filePath = path.join(transcriptsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        const segments = [];
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
                start: 0,
                end: 0
              });
              currentText = '';
            }
            currentSpeaker = speakerMatch[1];
          } else {
            currentText += ' ' + trimmed;
          }
        }
        if (currentText) {
          segments.push({
            speaker: currentSpeaker,
            text: currentText.trim(),
            start: 0,
            end: 0
          });
        }

        const fullText = segments.map(s => `[${s.speaker}]: ${s.text}`).join('\n\n');

        // Save to DB
        console.log(`Syncing transcript for video: ${matchedVideo.title} (${matchedVideo.video_id})`);
        
        await sql`
          INSERT INTO youtube_transcripts (video_id, full_text, segments, duration_seconds)
          VALUES (${matchedVideo.video_id}, ${fullText}, ${JSON.stringify(segments)}, 0)
          ON CONFLICT (video_id) DO UPDATE SET
            full_text = EXCLUDED.full_text,
            segments = EXCLUDED.segments
        `;
        
        syncedCount++;
      } else {
        console.log(`No matching video found for transcript: ${file}`);
      }
    }

    console.log(`\nSync completed. Synced ${syncedCount} transcripts.`);

  } catch (error) {
    console.error('Error syncing transcripts:', error);
    process.exit(1);
  }
}

syncTranscripts();
