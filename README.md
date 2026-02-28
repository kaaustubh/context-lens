## Setup

This project uses **pnpm** for package management.

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

1. Clone the repo
```bash
   git clone https://github.com/kaaustubh/context-lens.git
   cd context-lens
```

2. Install dependencies
```bash
   pnpm install
```

3. Create `.env.local` file (never commit this!)
```bash
   ANTHROPIC_API_KEY=your-key-here
```

4. Run dev server
```bash
   pnpm dev
```

5. Open http://localhost:3000

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- pnpm (package manager)
- Claude API (Sonnet 4.5)