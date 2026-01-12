# @entropretty/admin-cli

Administrative CLI tool for Entropretty. Provides commands for scoring algorithms and generating social media images.

## Setup

1. Create a `.env` file in this directory with your Supabase credentials:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. Install dependencies:

```bash
pnpm install
```

## Commands

### Score

Score algorithms based on quality benchmarks.

```bash
# Score algorithms without scores (default)
pnpm admin score

# Score all algorithms
pnpm admin score --all

# Score a specific algorithm by ID
pnpm admin score --id 123

# Score algorithms with scores older than N days
pnpm admin score --older-than 7d

# Score only missing (explicit flag)
pnpm admin score --missing-only
```

### Social

Generate social media images (OpenGraph & Twitter cards) for algorithms by hitting the API endpoints.

```bash
# Generate OG + Twitter images for all algorithms
pnpm admin social

# Generate for a specific algorithm
pnpm admin social --id 123

# Generate only OpenGraph images
pnpm admin social --og-only

# Generate only Twitter card images
pnpm admin social --twitter-only

# Adjust delay between requests (default: 1000ms)
pnpm admin social --delay 2000
```

## Project Structure

```
src/
├── index.ts                      # CLI entry point
├── lib/                          # Shared utilities
│   ├── supabase.ts               # Supabase client + types
│   ├── database.ts               # Shared database queries
│   └── canvas-polyfill.ts        # Canvas polyfills for Node.js
└── features/
    ├── score/
    │   ├── index.ts              # Score command
    │   ├── scorer.ts             # Scoring logic
    │   └── queries.ts            # Score-specific DB queries
    └── social/
        ├── index.ts              # Social command
        └── api.ts                # API calls for image generation
```

## Running with Bun

For faster execution, use Bun:

```bash
pnpm admin:bun score
pnpm admin:bun social
```
