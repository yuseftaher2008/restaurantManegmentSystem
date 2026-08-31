import "dotenv/config";

import { validateEnv } from "./config/env";
import app from "./app";

import { prisma } from "../lib/prisma";
import logger from "./lib/logger";

validateEnv();

const port = Number(process.env.PORT) || 3000;


const server = app.listen(port, () => logger.info(`Running on port:${port}`));


const shutdown = async () => {
  logger.info("Shutting down gracefully...");

  const forceExit = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);

  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Server closed.");
    clearTimeout(forceExit);
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
