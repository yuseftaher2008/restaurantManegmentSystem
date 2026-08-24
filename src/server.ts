import "dotenv/config";

import { validateEnv } from "./config/env";
import app from "./app";

import { prisma } from "../lib/prisma";

validateEnv();

const port = Number(process.env.PORT) || 3000;


const server = app.listen(port, () => console.log(`Running on port:${port}`));


const shutdown = async () => {
  console.log("\nShutting down gracefully...");
  server.close(async () => {

    await prisma.$disconnect();
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
