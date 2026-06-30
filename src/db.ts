import { openDatabase as openDb } from "./database/config";
import { loadWinnersFromCsv } from "./repository/winsRepository";

export function openDatabase() {
  return openDb();
}

export async function initializeDatabase(db: any, csvPath?: string) {
  await loadWinnersFromCsv(db, csvPath);
}
