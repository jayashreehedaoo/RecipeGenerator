This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Development Environment Setup

This project uses **public npm packages** and can be deployed to Vercel. If you're developing locally within a corporate network (CBA), you may need to configure npm:

**Option 1: Use Public npm Registry (Recommended)**
```bash
# No .npmrc needed - npm uses public registry by default
npm install
```

**Option 2: Use Corporate Artifactory (CBA Internal)**
```bash
# Create a local .npmrc file (git-ignored)
# Copy from .npmrc.example and configure with your credentials
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

┌─────────────────────────────────────┐
│         Frontend (React)            │
│  - Next.js 14 App Router            │
│  - TypeScript                       │
│  - Tailwind CSS                     │
│  - React Hooks                      │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│      Server Actions (Next.js)       │
│  - Type-safe mutations              │
│  - Automatic revalidation           │
│  - Direct DB access                 │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│         ORM (Drizzle)               │
│  - Type-safe queries                │
│  - Schema definitions               │
│  - Migrations                       │
└─────────────────────────────────────┘
                ↓
┌─────────────────────────────────────┐
│      Database (SQLite/Turso)        │
│  - Lightweight                      │
│  - Serverless-ready                 │
│  - Production-grade                 │
└─────────────────────────────────────┘


### Next JS:
Framework = lib +  tools + coventions to streamline app development
Uses own routing lib.
Compiler: Transform & minify JS code
CLI: building and starting app
Node JS runtime: JS runs in web browser(client) or in NJR(server)

Can do fullstack development. Backend code runs on server, frontend code runs in browser. Unlike React which is only for frontend.
NJS allows to render on server and send to the client. Fast and search engines friendly.

Pre render some data on server side and send to client for static pages.

CSR: large bundles, resource intensive, slower initial load, SEO challenges, not secure
SSR: faster initial load, better SEO, secure, requires server resources, complex setup

Server components can't use browser only APIs like DOM, local storage, window, document etc. Cant maintain state or use effects. Can fetch data directly from DB or server side APIs.
Can have both server and client components in same app. Server components can import client components but not vice versa.