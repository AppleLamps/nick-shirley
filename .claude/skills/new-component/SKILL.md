---
name: new-component
description: Scaffold React components with TypeScript and Tailwind. Use when user mentions "create component", "new component", "add component", or describes a UI element to build.
---

# New Component

Create React components following project conventions.

## Instructions

1. Determine component requirements:
   - Server or Client component?
   - Props interface
   - Variants (e.g., featured vs standard)

2. Create file at `src/components/<ComponentName>.tsx`

3. Server Component template (default):

   ```typescript
   import Image from 'next/image';
   import Link from 'next/link';

   interface ComponentNameProps {
     title: string;
     description?: string | null;
     href?: string;
   }

   export default function ComponentName({
     title,
     description,
     href = '#',
   }: ComponentNameProps) {
     return (
       <div className="rounded-lg border border-gray-200 p-4">
         <h3 className="font-serif text-lg font-bold">{title}</h3>
         {description && (
           <p className="mt-2 text-sm text-gray-600">{description}</p>
         )}
         <Link href={href} className="text-blue-600 hover:underline">
           Read more
         </Link>
       </div>
     );
   }
   ```

4. Client Component template (for interactivity):

   ```typescript
   'use client';

   import { useState } from 'react';

   interface ComponentNameProps {
     initialValue?: string;
     onSubmit?: (value: string) => void;
   }

   export default function ComponentName({
     initialValue = '',
     onSubmit,
   }: ComponentNameProps) {
     const [value, setValue] = useState(initialValue);

     const handleSubmit = () => {
       onSubmit?.(value);
     };

     return (
       <div className="flex gap-2">
         <input
           type="text"
           value={value}
           onChange={(e) => setValue(e.target.value)}
           className="rounded border px-3 py-2"
         />
         <button
           onClick={handleSubmit}
           className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
         >
           Submit
         </button>
       </div>
     );
   }
   ```

## Project Patterns

- Use `font-serif` for headlines, default sans for body
- Use Next.js `Image` component with `fill` and `object-cover`
- Use `date-fns` for date formatting: `import { format } from 'date-fns'`
- Reference existing components in `src/components/` for styling patterns

## Examples

- "Create a card component for testimonials"
- "New component for newsletter signup"
- "Add a modal component"

## Guardrails

- Check if similar component exists before creating new one
- Only add 'use client' if interactivity is required
- Use TypeScript interfaces for all props
- Follow existing Tailwind class patterns from ArticleCard.tsx
