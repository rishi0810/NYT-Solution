"use client";

import { useState } from "react";

type PuzzleData = {
  ok: boolean;
  data: unknown;
};

type PuzzleDropdownProps = {
  puzzleName: string;
  puzzleUrl: string;
};

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

const renderPill = (text: string, i: number, bg = "bg-slate-100") => (
  <span
    key={i}
    className={`${bg} text-slate-800 text-sm font-medium px-3 py-1 rounded-full`}
  >
    {text}
  </span>
);

const renderSudokuGrid = (arr: unknown) => {
  if (!Array.isArray(arr))
    return <div className="text-sm">No valid grid</div>;
  const nums = arr as number[];
  if (nums.length !== 81)
    return <div className="text-sm">No valid grid</div>;
  return (
    <div
      role="grid"
      aria-label="Sudoku solution"
      className="inline-grid grid-cols-9 gap-0 rounded-md overflow-hidden bg-slate-50 border"
    >
      {nums.map((n, i) => {
        const row = Math.floor(i / 9);
        const col = i % 9;
        const isRightThick = col === 2 || col === 5;
        const isBottomThick = row === 2 || row === 5;
        const borderClasses = [
          "border border-slate-200",
          isRightThick ? "border-r-2 border-r-slate-400" : "",
          isBottomThick ? "border-b-2 border-b-slate-400" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const display =
          n === 0 || n === null || n === undefined ? "" : String(n);

        return (
          <div
            role="gridcell"
            aria-label={`row ${row + 1} col ${col + 1}`}
            key={i}
            className={`${borderClasses} w-12 h-12 flex items-center justify-center text-lg font-medium bg-white text-black`}
          >
            {display}
          </div>
        );
      })}
    </div>
  );
};

const renderWordle = (solution: unknown) => {
  const s = (
    typeof solution === "string" ? solution : String(solution ?? "")
  ).toUpperCase();
  const letters = s.split("").slice(0, 5);
  return (
    <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-10 h-10 flex items-center justify-center border rounded-sm bg-slate-50 text-lg font-semibold"
        >
          {letters[i] ?? ""}
        </div>
      ))}
    </div>
  );
};

const renderConnections = (arr: unknown) => {
  if (!Array.isArray(arr)) return <div className="text-sm">No data</div>;
  const palette = [
    "bg-amber-100 text-amber-900",
    "bg-emerald-100 text-emerald-900",
    "bg-indigo-100 text-indigo-900",
    "bg-pink-100 text-pink-900",
  ];
  return (
    <div className="flex flex-col gap-3">
      {arr.map((group, gi) => {
        if (!isRecord(group)) return null;
        const keys = Object.keys(group);
        const name = keys[0] ?? "";
        const itemsRaw = (group as Record<string, unknown>)[name];
        const items = Array.isArray(itemsRaw) ? (itemsRaw as string[]) : [];
        const color = palette[gi % palette.length];
        return (
          <div key={gi} className="flex flex-col gap-2">
            <div className="text-sm font-semibold">{name}</div>
            <div className="flex flex-wrap gap-2">
              {items.map((it, i) => renderPill(String(it), i, color))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Render functions for each puzzle type
const renderLetterboxd = (d: unknown) => {
  const sol =
    isRecord(d) &&
    isRecord(d["answer"]) &&
    Array.isArray(d["answer"]["solution"])
      ? (d["answer"]["solution"] as string[])
      : [];
  return (
    <div className="flex gap-2 flex-wrap">
      {sol.map((w, i) => renderPill(String(w), i))}
    </div>
  );
};

const renderSudoku = (d: unknown) => {
  const ans =
    isRecord(d) && isRecord(d["answer"])
      ? (d["answer"] as Record<string, unknown>)
      : {};
  return (
    <>
      <div className="mb-2 text-sm font-semibold text-slate-600">Easy</div>
      <div className="mb-8 flex justify-center">
        {renderSudokuGrid(ans["easy"])}
      </div>

      <div className="mb-2 text-sm font-semibold text-slate-600">Medium</div>
      <div className="mb-8 flex justify-center">
        {renderSudokuGrid(ans["medium"])}
      </div>

      <div className="mb-2 text-sm font-semibold text-slate-600">Hard</div>
      <div className="flex justify-center">{renderSudokuGrid(ans["hard"])}</div>
    </>
  );
};

const renderWordleData = (d: unknown) => {
  const sol =
    isRecord(d) &&
    isRecord(d["answer"]) &&
    typeof d["answer"]["solution"] === "string"
      ? (d["answer"]["solution"] as string)
      : undefined;
  return renderWordle(sol);
};

const renderStrands = (d: unknown) => {
  const words =
    isRecord(d) && Array.isArray(d["answer"]) ? (d["answer"] as string[]) : [];
  return (
    <div className="flex gap-2 flex-wrap">
      {words.map((w, i) => renderPill(String(w), i))}
    </div>
  );
};

const renderConnectionsData = (d: unknown) => {
  const groups =
    isRecord(d) && Array.isArray(d["answer"])
      ? (d["answer"] as unknown[])
      : [];
  return renderConnections(groups);
};

const renderSpellingBee = (d: unknown) => {
  if (!isRecord(d) || !isRecord(d["answer"])) {
    return <div className="text-sm">No data</div>;
  }

  const answerObj = d["answer"] as Record<string, unknown>;
  const pangrams = Array.isArray(answerObj["pangrams"])
    ? (answerObj["pangrams"] as string[])
    : [];
  const answers = Array.isArray(answerObj["answers"])
    ? (answerObj["answers"] as string[])
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Pangram Section */}
      {pangrams.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold text-slate-700">Main word</div>
          <div className="flex flex-wrap gap-2">
            {pangrams.map((w, i) => (
              <span
                key={i}
                className="bg-yellow-100 text-yellow-800 text-base font-bold px-4 py-1.5 rounded-full"
              >
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Answers Section */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold text-slate-700">Answers</div>
        {/* Grid layout: 2 cols on mobile, up to 6 cols on large screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {answers.map((w, i) => (
            <div
              key={i}
              className="bg-slate-100 text-slate-800 text-sm font-medium px-2 py-1.5 rounded-md text-center"
            >
              {w}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getCacheBuster = () => {
  const now = new Date();
  const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const hour = now.getHours();
  // Create 3 windows: 0-7 (v1), 8-15 (v2), 16-23 (v3)
  const window = Math.floor(hour / 8); 
  return `${date}-w${window}`;
};

export default function PuzzleDropdown({
  puzzleName,
  puzzleUrl,
}: PuzzleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);



  const handleToggle = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // Fetch data only when opening and if not already fetched
    if (newIsOpen && !puzzleData && !isLoading) {
      setIsLoading(true);
      try {
        const version = getCacheBuster();
        const separator = puzzleUrl.includes('?') ? '&' : '?';
        const url = `${puzzleUrl}${separator}v=${version}`;
        
        const res = await fetch(url, { cache: 'no-store' });
        const json = await res.json().catch(() => null);
        setPuzzleData({ ok: res.ok, data: json });
      } catch (err) {
        setPuzzleData({ ok: false, data: { error: String(err) } });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderContent = (data: unknown) => {
    const name = puzzleName.toUpperCase();
    
    if (name === "WORDLE") return renderWordleData(data);
    if (name === "LETTERBOXD") return renderLetterboxd(data);
    if (name === "SPELLING BEE") return renderSpellingBee(data);
    if (name === "STRANDS") return renderStrands(data);
    if (name === "CONNECTIONS") return renderConnectionsData(data);
    if (name === "SUDOKU") return renderSudoku(data);
    
    return <div className="text-sm">Unknown puzzle type</div>;
  };

  return (
    <details
      className="border rounded-md p-3"
      open={isOpen}
      onToggle={(e) => {
        e.preventDefault();
      }}
    >
      <summary
        className="cursor-pointer font-medium"
        onClick={(e) => {
          e.preventDefault();
          handleToggle();
        }}
      >
        {puzzleName}
      </summary>
      {isOpen && (
        <div className="mt-2">
          {isLoading ? (
            <div className="text-sm text-slate-500">Loading...</div>
          ) : puzzleData ? (
            renderContent(puzzleData.data)
          ) : null}
        </div>
      )}
    </details>
  );
}
