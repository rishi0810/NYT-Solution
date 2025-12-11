import PuzzleDropdown from "./PuzzleDropdown";

export default function Home() {
  const puzzles = [
    {
      name: "WORDLE",
      url: "https://cdn.jsdelivr.net/gh/rishi0810/NYT-Backend@main/static/wordle.json",
    },
    {
      name: "LETTERBOXD",
      url: "https://cdn.jsdelivr.net/gh/rishi0810/NYT-Backend@main/static/letterboxd.json",
    },
    {
      name: "SPELLING BEE",
      url: "https://cdn.jsdelivr.net/gh/rishi0810/NYT-Backend@main/static/spellingbee.json",
    },
    {
      name: "STRANDS",
      url: "https://cdn.jsdelivr.net/gh/rishi0810/NYT-Backend@main/static/strands.json",
    },
    {
      name: "CONNECTIONS",
      url: "https://cdn.jsdelivr.net/gh/rishi0810/NYT-Backend@main/static/connections.json",
    },
    {
      name: "SUDOKU",
      url: "https://cdn.jsdelivr.net/gh/rishi0810/NYT-Backend@main/static/sudoku.json",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-white text-black">
      <main className="max-w-3xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold">NYT Solutions For Today</h1>
        </header>

        <section className="flex flex-col gap-4">
          {puzzles.map((puzzle) => (
            <PuzzleDropdown
              key={puzzle.name}
              puzzleName={puzzle.name}
              puzzleUrl={puzzle.url}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

