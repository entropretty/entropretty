# Algorithm Scoring CLI

Automated scoring tool for Entropretty algorithms. Runs benchmarks and updates the `algorithm_scores` table in Supabase.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials to `.env`:
   - Get service role key from Supabase Dashboard > Project Settings > API
   - The service role key has write access to `algorithm_scores` table

3. Install dependencies (from monorepo root):
   ```bash
   pnpm install
   ```

4. (Optional) If canvas package fails to build:
   ```bash
   pnpm approve-builds canvas
   pnpm install
   ```

   Note: Bun has built-in Web APIs, so canvas might not be needed. Test first.

## Usage

Score unscored algorithms only:
```bash
bun run score --missing-only
```

Rescore all algorithms:
```bash
bun run score --all
```

Score specific algorithm:
```bash
bun run score --id 123
```

Rescore algorithms with scores older than 7 days:
```bash
bun run score --older-than 7d
```

## How It Works

1. Fetches algorithms from Supabase
2. Runs benchmark (250 iterations at 300x300px)
3. Calculates quality score (0-100):
   - 0 = collisions or errors
   - 10-100 = based on warning percentage
4. Updates `algorithm_scores` table via service role

## Scoring Rules

- **0 points**: Algorithm has collisions or errors
- **10-100 points**: Based on warning percentage (exponential curve)
  - 0% warnings = 100 points
  - 5% warnings = ~80 points
  - 15% warnings = ~30 points

