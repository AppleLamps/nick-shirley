import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables manually to handle quotes
const envContent = readFileSync('.env.local', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=['"]?([^'"\n]+)['"]?/);
const DATABASE_URL = dbUrlMatch ? dbUrlMatch[1] : process.env.DATABASE_URL;

const sql = neon(DATABASE_URL);

async function migrate() {
    try {
        console.log('Adding summary column to youtube_videos table...');

        await sql`
      ALTER TABLE youtube_videos 
      ADD COLUMN IF NOT EXISTS summary TEXT
    `;

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
