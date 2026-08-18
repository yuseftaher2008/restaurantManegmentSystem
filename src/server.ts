import express from "express";
import type { Express } from "express";
import "dotenv/config";

const port = Number(process.env.PORT) || 3000;
const app:Express = express();

// middelwares

app.use(express.json({
    limit:"20kb"
}));

app.listen(port,()=> console.log(`Runing on port:${port}`))

