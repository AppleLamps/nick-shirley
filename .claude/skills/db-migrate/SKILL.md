---
name: db-migrate
description: Create database migration scripts following project patterns. Use when user mentions "migration", "add column", "alter table", "schema change", or "database update".
---

# Database Migration

Create migration scripts for Neon PostgreSQL following project conventions.

## Instructions

1. Read current schema:
   - `prisma/schema.sql` for table definitions
   - `src/lib/db.ts` for TypeScript interfaces

2. Create migration script in `scripts/` directory:
   - Filename: `<action>-<description>.mjs` (e.g., `add-views-column.mjs`)
   - Use existing pattern from `scripts/add-summary-column.mjs`

3. Migration script template:

   ```javascript
   import { neon } from '@neondatabase/serverless';
   import { config } from 'dotenv';
   import { fileURLToPath } from 'url';
   import { dirname, join } from 'path';

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   config({ path: join(__dirname, '..', '.env.local') });

   const sql = neon(process.env.DATABASE_URL);

   async function migrate() {
     console.log('Running migration...');

     await sql`
       ALTER TABLE table_name
       ADD COLUMN IF NOT EXISTS column_name TYPE
     `;

     console.log('Migration complete!');
   }

   migrate().catch(console.error);
   ```

4. Update `src/lib/db.ts`:
   - Add new fields to relevant interface
   - Update query functions if needed

5. Update `prisma/schema.sql`:
   - Add new column to CREATE TABLE statement

## Examples

- "Add a views column to articles"
- "Create migration for user preferences table"
- "Add index on published_at"

## Guardrails

- ALWAYS use `IF NOT EXISTS` or `IF EXISTS` for safety
- NEVER use DROP TABLE without explicit confirmation
- Test migration on development database first
- Back up data before destructive operations: `curl localhost:3000/api/admin/articles/export`
