# Next.js Page Router Codebase Instructions

## Architecture Overview

This is a Next.js learning/demo project using **Pages Router** (not App Router) with TypeScript, Tailwind CSS, and Web Audio API experimentation.

### Core Data Pattern
- All page data follows the `PageData` type defined in [src/types/types.ts](src/types/types.ts)
- Static data is managed via `dataMap` object with predefined entries (taro, hanako, sachiko, setouchi, etc.)
- Global layout data flows through `_app.tsx` with fallback defaults when `pageProps.data` is unavailable

## Key Development Patterns

### Page Structure & Data Fetching
- **Static pages**: Use `getStaticProps` for build-time data (see [src/pages/index.tsx](src/pages/index.tsx))
- **Dynamic static routes**: Use `getStaticPaths` + `getStaticProps` for `/[name]` routes (see [src/pages/[name].tsx](src/pages/[name].tsx))
- **Dynamic SSR routes**: Use `getServerSideProps` for `/name2/[name2]` routes (see [src/pages/name2/[name2].tsx](src/pages/name2/[name2].tsx))
- All dynamic routes reference `dataMap` from types.ts and handle `notFound: true` for missing entries

### Layout System
- Universal layout via [src/components/Layout.tsx](src/components/Layout.tsx) wrapping all pages in `_app.tsx`
- Layout receives `pagedatas` prop with title/title2/msg structure
- Headers display `title` and `title2`, footer is static copyright

### TypeScript Conventions
- **Strict typing enforced**: ESLint requires explicit return types for all functions
- Import types from `src/types/types.ts`: `PageData`, `props`, `LayoutInterface`
- Use `InferGetStaticPropsType` pattern for type safety in getStaticProps

### API Routes Pattern
- [pages/api/hello.ts](src/pages/api/hello.ts): Simple JSON response
- [pages/api/fs.ts](src/pages/api/fs.ts): File operations with GET/POST switching via `req.method`
- Dynamic API route: [pages/api/data/[id].tsx](src/pages/api/data/[id].tsx)

### Web Audio API Integration
- Audio utilities in [src/lib/audioUtils.ts](src/lib/audioUtils.ts) with `generateBeep`, `generateMelody`, `generateWAVBlob`
- Audio demos in [src/pages/audio.tsx](src/pages/audio.tsx) and [src/pages/audio-simple.tsx](src/pages/audio-simple.tsx)
- Handle AudioContext suspended state and browser compatibility

### Intersection Observer Pattern
- Multiple intersection observer implementations in `intersection-*.tsx` files
- Mount state tracking with `useEffect` for client-side hydration
- Element visibility tracking with `Set<number>` for performance

## Development Workflow

### Build Commands
```bash
npm run dev          # Development with Turbopack
npm run build        # Production build with Turbopack  
npm run start        # Start production server
npm run lint         # ESLint with strict TypeScript rules
```

### Project-Specific Rules
- **Always use explicit TypeScript types** - ESLint enforces `explicit-function-return-type`
- **Import paths**: Use `@/*` alias for src directory
- **Japanese content support**: Many demo pages contain Japanese text
- **File naming**: Dynamic routes use `[param]` bracket syntax
- **Data validation**: Always check params existence in getStaticProps/getServerSideProps

## External Dependencies
- **SWR**: Used for client-side data fetching (imported but check usage patterns)
- **Tailwind CSS**: Configured via postcss with @tailwindcss/postcss plugin
- **React 19**: Latest React version - be aware of concurrent features
- **Next.js 15.5.4**: Latest Next.js with Turbopack enabled by default

When working with this codebase, prioritize understanding the data flow through the Layout system and maintain the strict TypeScript patterns enforced by ESLint.