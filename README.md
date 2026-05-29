# Snip

Fast, clean URL shortener with click analytics. Live at [sniplt.vercel.app](https://sniplt.vercel.app).

## Features

- Shorten any http/https URL to a 7-character slug
- Optional custom alias (3-30 chars, letters/digits/- and _)
- Click analytics tracked server-side on every redirect
- Dashboard showing 20 most recent links with click counts
- Fire-and-forget click logging via `after()` - never delays the redirect
- Reserved slug protection (api, dashboard, _next, ...)
- Collision retry (up to 5 attempts before error)
- 302 redirect for correct browser behavior

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework |
| TypeScript | Type safety |
| Prisma v7 | ORM + migrations |
| Neon Postgres | Serverless database |
| Tailwind CSS v4 | Styling |
| Vitest | Unit tests |

## Run Locally

```bash
cp .env.example .env.local
# fill in DATABASE_URL and DIRECT_URL from your Neon project

npm install
npx prisma migrate dev --name init
npm run dev         # http://localhost:3000
```

## Tests

```bash
npm test
```

Covers `generateSlug()`, `isValidSlug()`, `isValidUrl()`, and `RESERVED_SLUGS`. No database calls.

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in Vercel
3. Add environment variables: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_BASE_URL`
4. Deploy - Prisma generates the client at build time automatically

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `DIRECT_URL` | Neon direct/unpooled connection string (for migrations) |
| `NEXT_PUBLIC_BASE_URL` | Public base URL, e.g. `https://sniplt.vercel.app` |

---

> Built by [MrrAmissah](https://github.com/MrrAmissah)

## License

MIT
