import fs from "fs";
import path from "path";

function parseProducers(producersCell: string) {
  return String(producersCell)
    .split(/,\s*|\s+and\s+/)
    .map((producer) => producer.trim())
    .filter(Boolean);
}

function resolveCsvPath(csvPath?: string) {
  if (csvPath) {
    return csvPath;
  }

  const workspaceRoot = path.resolve(__dirname, "..", "..");
  const cwdRoot = process.cwd();

  const candidates = [
    path.join(cwdRoot, "Movielist.csv"),
    path.join(workspaceRoot, "Movielist.csv"),
    path.join(workspaceRoot, "src", "Movielist.csv"),
    path.join(workspaceRoot, "dist", "Movielist.csv"),
  ];

  const existing = candidates.find((candidate) => fs.existsSync(candidate));
  if (existing) {
    return existing;
  }

  return path.join(cwdRoot, "Movielist.csv");
}

export function loadWinnersFromCsv(db: any, csvPath?: string) {
  const resolvedCsvPath = resolveCsvPath(csvPath);

  return new Promise<void>((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS wins (
          producer TEXT NOT NULL,
          year INTEGER NOT NULL
        )`,
        (createError: Error | null) => {
          if (createError) {
            return reject(createError);
          }

          const raw = fs.readFileSync(resolvedCsvPath, "utf8");
          const lines = raw.trim().split(/\r?\n/);
          const header =
            lines
              .shift()
              ?.split(";")
              .map((column) => column.trim()) ?? [];
          const yearIndex = header.indexOf("year");
          const producersIndex = header.indexOf("producers");
          const winnerIndex = header.indexOf("winner");

          const insert = db.prepare(
            `INSERT INTO wins(producer, year) VALUES(?, ?)`,
          );

          for (const line of lines) {
            const columns = line.split(";");
            if ((columns[winnerIndex] || "").trim().toLowerCase() !== "yes") {
              continue;
            }

            const year = Number(columns[yearIndex]);
            const producers = parseProducers(columns[producersIndex] || "");
            for (const producer of producers) {
              insert.run(producer, year);
            }
          }

          insert.finalize((finalizeError: Error | null) => {
            if (finalizeError) {
              return reject(finalizeError);
            }
            resolve();
          });
        },
      );
    });
  });
}

export function getWinnerRows(db: any) {
  return new Promise<Array<{ producer: string; year: number }>>(
    (resolve, reject) => {
      db.all(
        `SELECT producer, year FROM wins ORDER BY producer, year`,
        [],
        (
          err: Error | null,
          rows: Array<{ producer: string; year: number }>,
        ) => {
          if (err) return reject(err);
          resolve(rows);
        },
      );
    },
  );
}
