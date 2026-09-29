# G-Bite's Restaurant Website

A full-stack restaurant website built with Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL (Drizzle ORM).

## Features
- Browse the menu by category
- Order online with cart & checkout
- Book a table with reservation codes
- Live kitchen/admin dashboard for order status

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- PostgreSQL + Drizzle ORM
- Tailwind CSS

## Getting Started
1. `npm install`
2. Create a `.env` file with `DATABASE_URL=your_postgres_connection_string`
3. `npx drizzle-kit push` then `node --env-file=.env scripts/seed.mjs`
4. `npm run dev` → http://localhost:3000
