import sqlite3 from "sqlite3";

export function openDatabase() {
  return new sqlite3.Database(":memory:");
}
