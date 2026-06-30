import express, { Request, Response, NextFunction } from "express";

import { ProducerService } from "../service/producerService";

export function createProducerController(service: ProducerService) {
  const router = express.Router();

  router.get(
    "/producer-intervals",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await service.getProducerIntervals();
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
