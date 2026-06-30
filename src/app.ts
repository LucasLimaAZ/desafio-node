import express, { ErrorRequestHandler } from "express";
import { createRoutes } from "./routes";
import { ProducerService } from "./service/producerService";

export function createApp(service: ProducerService) {
  const app = express();

  app.use(createRoutes(service));

  app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Producer interval API is running" });
  });

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  };

  app.use(errorHandler);

  return app;
}
