import express from "express";
import { createProducerController } from "./controller/producerController";
import { ProducerService } from "./service/producerService";

export function createRoutes(service: ProducerService) {
  const router = express.Router();
  router.use(createProducerController(service));
  return router;
}
