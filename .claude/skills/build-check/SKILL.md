---
name: build-check
description: Run build and lint verification before deployment. Use when user mentions "check build", "verify", "pre-deploy", "ready to deploy", or asks to validate the project.
allowed-tools: Read, Glob, Grep, Bash
---

# Build Check

Pre-deployment verification for the Next.js portfolio site.

## Instructions

1. Run lint check:

   ```bash
   npm run lint
   ```

2. Run production build:

   ```bash
   npm run build
   ```

3. If errors occur:
   - Parse error messages
   - Identify affected files
   - Suggest specific fixes

4. Report results summary:
   - Lint warnings/errors count
   - Build success/failure
   - Bundle size if available

## Default Commands

- Lint: `npm run lint`
- Build: `npm run build`
- Type check: `npx tsc --noEmit`

## Examples

- "Check if the build passes"
- "Verify before deploying"
- "Run pre-deploy checks"

## Guardrails

- Do NOT modify files to fix errors without user confirmation
- Report issues clearly with file paths and line numbers
- If build fails, ask user before attempting fixes
