import request from "supertest";
import path from "path";
import sqlite3 from "sqlite3";
import { expect } from "chai";
import { createApp } from "../src/app";
import { createProducerService } from "../src/service/producerService";
import { initializeDatabase } from "../src/db";

function createMemoryDatabase() {
  return new sqlite3.Database(":memory:");
}

describe("Integration tests for producer intervals API", () => {
  let app: any;
  let db: sqlite3.Database;

  before(async () => {
    db = createMemoryDatabase();
    await initializeDatabase(db, path.join(__dirname, "..", "Movielist.csv"));
    const service = createProducerService(db);
    app = createApp(service);
  });

  after(() => {
    db.close();
  });

  it("should return the expected min and max interval producers", async () => {
    const res = await request(app).get("/producer-intervals").expect(200);

    expect(res.body).to.have.property("min").that.is.an("array");
    expect(res.body).to.have.property("max").that.is.an("array");

    expect(res.body.min).to.be.an("array").that.is.not.empty;
    expect(res.body.max).to.be.an("array").that.is.not.empty;

    const minEntry = res.body.min[0];
    const maxEntry = res.body.max[0];

    expect(minEntry).to.include.keys([
      "producer",
      "interval",
      "previousWin",
      "followingWin",
    ]);
    expect(maxEntry).to.include.keys([
      "producer",
      "interval",
      "previousWin",
      "followingWin",
    ]);

    expect(minEntry.interval).to.be.a("number");
    expect(maxEntry.interval).to.be.a("number");
    expect(minEntry.interval).to.be.lessThanOrEqual(maxEntry.interval);
  });
});
