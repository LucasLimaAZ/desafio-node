import request from "supertest";
import path from "path";
import sqlite3 from "sqlite3";
import { expect } from "chai";
import { createApp } from "../src/app";
import { createProducerService } from "../src/service/producerService";
import { initializeDatabase } from "../src/db";

const expectedIntervals = {
  min: [
    {
      producer: "Joel Silver",
      interval: 1,
      previousWin: 1990,
      followingWin: 1991,
    },
  ],
  max: [
    {
      producer: "Matthew Vaughn",
      interval: 13,
      previousWin: 2002,
      followingWin: 2015,
    },
  ],
};

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

  it("should return the expected min and max interval producers for the default CSV", async () => {
    const res = await request(app).get("/producer-intervals").expect(200);

    expect(res.body).to.deep.equal(expectedIntervals);
  });
});
