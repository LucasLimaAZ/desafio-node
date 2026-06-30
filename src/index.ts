import { openDatabase, initializeDatabase } from "./db";
import { createProducerService } from "./service/producerService";
import { createApp } from "./app";

const port = process.env.PORT || 3000;
const db = openDatabase();

initializeDatabase(db)
  .then(() => {
    const service = createProducerService(db);
    const app = createApp(service);
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
  });
