# NYT Solutions

A modern, server-rendered web application that provides today's solutions for popular New York Times puzzles, including Wordle, Sudoku, Strands, Connections, and Letterboxd. Built with Next.js for optimal performance and privacy.

## Features

- **Server-Side Rendering**: All puzzle data is fetched and rendered on the server, ensuring user privacy by never exposing network calls to the client.
- **Puzzle Solutions**:
  - **Wordle**: Displays the 5-letter solution in a grid of cells.
  - **Sudoku**: Renders 9x9 grids for Easy, Medium, and Hard difficulties with proper subgrid borders.
  - **Strands**: Shows solution words as interactive pills.
  - **Connections**: Groups words by category with color-coded pills.
  - **Letterboxd**: Lists solution words as pills.
- **Responsive Design**: Uses Tailwind CSS for a clean, mobile-friendly interface.
- **SEO Optimized**: Includes Open Graph, Twitter cards, JSON-LD structured data, and canonical URLs.
- **Accessibility**: Features ARIA labels, semantic HTML, and keyboard navigation support.
- **Dark Mode Support**: Automatically adapts to system preferences.

## Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans and Geist Mono (optimized with Next.js)
- **Linting**: ESLint
- **Build Tool**: Turbopack (via Next.js)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (recommended) or npm/yarn
- A running backend server (see the `backend/` directory in this repository)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rishi0810/NYT-Solution.git
   cd nyt-solutions/frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `frontend/` directory:

   ```env
   BACKEND_URL=http://localhost:8080
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```text
frontend/
├── app/
│   ├── globals.css          # Global styles with Tailwind and custom variables
│   ├── layout.tsx           # Root layout with metadata and fonts
│   └── page.tsx             # Main page with puzzle solutions
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
└── README.md                # This file
```

## How It Works

1. **Server-Side Fetching**: On each request, the server fetches today's puzzle solutions from the backend API endpoints:
   - `/health` - Health check
   - `/letterboxd` - Letterboxd solutions
   - `/sudoku` - Sudoku grids (Easy, Medium, Hard)
   - `/wordle` - Wordle solution (with today's date)
   - `/strands` - Strands words (with today's date)
   - `/connections` - Connections groups (with today's date)
   - `/spellingbee` - Spelling Bee (fetched but not displayed)

2. **Rendering**: Each puzzle type has a custom renderer:
   - Sudoku: 9x9 grid with thicker borders for 3x3 subgrids
   - Wordle: 5-letter grid
   - Others: Word pills or grouped pills

3. **UI**: Solutions are displayed in collapsible `<details>` elements for a clean interface.

## Environment Variables

- `BACKEND_URL`: URL of the backend API server (default: `http://localhost:8080`)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is private and not licensed for public use.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Fonts by [Vercel](https://vercel.com/font)
