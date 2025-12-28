---
name: new-api-route
description: Scaffold new Next.js API routes with proper patterns. Use when user mentions "create endpoint", "new API route", "add route", or "API for".
---

# New API Route

Create API routes following project conventions for Next.js App Router.

## Instructions

1. Determine route path and HTTP methods needed

2. Create route file at `src/app/api/<path>/route.ts`

3. Use this template:

   ```typescript
   import { NextResponse } from 'next/server';
   import { sql } from '@/lib/db';

   export const dynamic = 'force-dynamic';

   export async function GET(request: Request) {
     try {
       const { searchParams } = new URL(request.url);
       const limit = parseInt(searchParams.get('limit') || '10', 10);

       const result = await sql`
         SELECT * FROM table_name
         ORDER BY created_at DESC
         LIMIT ${limit}
       `;

       return NextResponse.json({ data: result });
     } catch (error) {
       console.error('Error in GET /api/<path>:', error);
       return NextResponse.json(
         { error: 'Failed to fetch data' },
         { status: 500 }
       );
     }
   }

   export async function POST(request: Request) {
     try {
       const body = await request.json();

       // Validate required fields
       if (!body.requiredField) {
         return NextResponse.json(
           { error: 'Missing required field' },
           { status: 400 }
         );
       }

       const result = await sql`
         INSERT INTO table_name (field)
         VALUES (${body.field})
         RETURNING *
       `;

       return NextResponse.json({ data: result[0] }, { status: 201 });
     } catch (error) {
       console.error('Error in POST /api/<path>:', error);
       return NextResponse.json(
         { error: 'Failed to create' },
         { status: 500 }
       );
     }
   }
   ```

4. For admin routes, place under `src/app/api/admin/`

5. Add types to `src/lib/db.ts` if needed

## Project Patterns

- Always use `force-dynamic` for database routes
- Use parameterized queries (template literals with sql``)
- Return consistent JSON shape: `{ data, error, success }`
- Log errors with route context: `console.error('Error in GET /api/x:', error)`

## Examples

- "Create an API route for user profiles"
- "Add endpoint to get article by slug"
- "New admin route to clear cache"

## Guardrails

- Use parameterized queries to prevent SQL injection
- Add TODO comment for auth: `// TODO: Add authentication in production`
- Validate all user input before database operations
- Never expose internal error messages to clients
