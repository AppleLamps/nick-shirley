import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function initDatabase() {
  console.log('Initializing database...\n');

  try {
    // Read the schema SQL file
    const schema = readFileSync('prisma/schema.sql', 'utf-8');

    // Remove SQL comments and split into individual statements
    const cleanedSchema = schema
      .split('\n')
      .map(line => {
        const commentIndex = line.indexOf('--');
        return commentIndex >= 0 ? line.substring(0, commentIndex) : line;
      })
      .join('\n');

    const statements = cleanedSchema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.substring(0, 50).replace(/\n/g, ' ');
      console.log(`[${i + 1}/${statements.length}] ${preview}...`);
      await sql.query(stmt);
    }

    console.log('\nDatabase initialized successfully!');
    console.log('\nTables created:');
    console.log('  - articles');
    console.log('  - x_posts');
    console.log('  - x_mentions');
    console.log('  - youtube_videos');
    console.log('  - settings');

  } catch (error) {
    console.error('\nError initializing database:', error.message);
    process.exit(1);
  }
}

initDatabase();
