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

async function seedDatabase() {
    console.log('Seeding database...\n');

    try {
        // Read the seed data
        const seedData = JSON.parse(readFileSync('scripts/seed.json', 'utf-8'));

        console.log(`Found ${seedData.length} articles to seed.\n`);

        for (const article of seedData) {
            console.log(`Seeding article: ${article.title}`);

            await sql`
        INSERT INTO articles (
          title, 
          slug, 
          excerpt, 
          content, 
          featured_image, 
          category, 
          source_type, 
          source_url, 
          published, 
          featured, 
          created_at
        ) VALUES (
          ${article.title},
          ${article.slug},
          ${article.excerpt},
          ${article.content},
          ${article.featured_image},
          ${article.category},
          ${article.source_type},
          ${article.source_url},
          ${article.published},
          ${article.featured},
          ${article.created_at}
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          featured_image = EXCLUDED.featured_image,
          category = EXCLUDED.category,
          source_type = EXCLUDED.source_type,
          source_url = EXCLUDED.source_url,
          published = EXCLUDED.published,
          featured = EXCLUDED.featured,
          created_at = EXCLUDED.created_at,
          updated_at = CURRENT_TIMESTAMP;
      `;
        }

        console.log('\nDatabase seeded successfully!');

    } catch (error) {
        console.error('\nError seeding database:', error.message);
        process.exit(1);
    }
}

seedDatabase();
