type RouteResult = { route: string; ok: boolean; data: unknown };

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

async function fetchJson(
  route: string,
  method = "GET",
  body?: unknown
): Promise<RouteResult> {
  const url = BACKEND + route;
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const json = await res.json().catch(() => null);
    return { route, ok: res.ok, data: json };
  } catch (err) {
    return { route, ok: false, data: { error: String(err) } };
  }
}

export default async function Home() {
  // Use today's date (YYYY-MM-DD) for POST routes that expect a date in the body
  const today = new Date().toISOString().slice(0, 10);

  // Call backend routes server-side so client never sees these network calls
  const calls = await Promise.all([
    fetchJson("/health", "GET"),
    fetchJson("/letterboxd", "GET"),
    fetchJson("/sudoku", "GET"),
    fetchJson("/wordle", "POST", { date: today }),
    fetchJson("/strands", "POST", { date: today }),
    fetchJson("/connections", "POST", { date: today }),
    fetchJson("/spellingbee", "POST", { date: today }),
  ]);

  return (
    <div className="min-h-screen p-8 bg-white text-black">
      <main className="max-w-3xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-semibold">NYT Solutions For Today</h1>
        </header>

        <section className="flex flex-col gap-4">
          {calls.map((c) => {
            const key = c.route.replace("/", "") || "root";
            const title = key.toUpperCase();
            const d: unknown = c.data;

            const isRecord = (x: unknown): x is Record<string, unknown> =>
              typeof x === "object" && x !== null;

            const renderPill = (
              text: string,
              i: number,
              bg = "bg-slate-100"
            ) => (
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
                  className="inline-grid grid-cols-9 gap-0 rounded-md overflow-hidden bg-slate-50 border-1 "
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
              if (!Array.isArray(arr))
                return <div className="text-sm">No data</div>;
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
                    const items = Array.isArray(itemsRaw)
                      ? (itemsRaw as string[])
                      : [];
                    const color = palette[gi % palette.length];
                    return (
                      <div key={gi} className="flex flex-col gap-2">
                        <div className="text-sm font-semibold">{name}</div>
                        <div className="flex flex-wrap gap-2">
                          {items.map((it, i) =>
                            renderPill(String(it), i, color)
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            };

            // route-specific rendering
            if (key === "letterboxd") {
              const sol =
                isRecord(d) &&
                isRecord(d["answer"]) &&
                Array.isArray(d["answer"]["solution"])
                  ? (d["answer"]["solution"] as string[])
                  : [];
              return (
                <details key={c.route} className="border rounded-md p-3">
                  <summary className="cursor-pointer font-medium">
                    {title}
                  </summary>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {sol.map((w, i) => renderPill(String(w), i))}
                  </div>
                </details>
              );
            }

            if (key === "sudoku") {
              const ans =
                isRecord(d) && isRecord(d["answer"])
                  ? (d["answer"] as Record<string, unknown>)
                  : {};
              return (
                <details key={c.route} className="border rounded-md p-3">
                  <summary className="cursor-pointer font-medium">
                    {title}
                  </summary>

                  <div id="easy" className="mt-3 mb-8 flex justify-center">
                    {renderSudokuGrid(ans["easy"])}
                  </div>

                  <div id="medium" className="mt-3 mb-8 flex justify-center">
                    {renderSudokuGrid(ans["medium"])}
                  </div>

                  <div id="hard" className="mt-3 mb-8 flex justify-center">
                    {renderSudokuGrid(ans["hard"])}
                  </div>
                </details>
              );
            }

            if (key === "wordle") {
              const sol =
                isRecord(d) &&
                isRecord(d["answer"]) &&
                typeof d["answer"]["solution"] === "string"
                  ? (d["answer"]["solution"] as string)
                  : undefined;
              return (
                <details key={c.route} className="border rounded-md p-3">
                  <summary className="cursor-pointer font-medium">
                    {title}
                  </summary>
                  <div className="mt-2">{renderWordle(sol)}</div>
                </details>
              );
            }

            if (key === "strands") {
              const words =
                isRecord(d) && Array.isArray(d["answer"])
                  ? (d["answer"] as string[])
                  : [];
              return (
                <details key={c.route} className="border rounded-md p-3">
                  <summary className="cursor-pointer font-medium">
                    {title}
                  </summary>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {words.map((w, i) => renderPill(String(w), i))}
                  </div>
                </details>
              );
            }

            if (key === "connections") {
              const groups =
                isRecord(d) && Array.isArray(d["answer"])
                  ? (d["answer"] as unknown[])
                  : [];
              return (
                <details key={c.route} className="border rounded-md p-3">
                  <summary className="cursor-pointer font-medium">
                    {title}
                  </summary>
                  <div className="mt-2">{renderConnections(groups)}</div>
                </details>
              );
            }

            // default: show a small summary and lazy-load raw JSON on demand
            return (
              <details
                key={c.route}
                className="border rounded-md p-3"
                aria-live="polite"
              >
                <summary className="cursor-pointer font-medium">
                  {title}
                </summary>
                <div className="mt-2 text-sm text-slate-700">
                  <em>Summary:</em>
                  <div className="mt-1">
                    <code className="text-xs text-slate-500">
                      {String(c.ok ? "OK" : "ERROR")}
                    </code>
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="text-xs text-slate-500 cursor-pointer">
                    Show raw JSON
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-sm">
                    {JSON.stringify(c.data, null, 2)}
                  </pre>
                </details>
              </details>
            );
          })}
        </section>
      </main>
    </div>
  );
}
