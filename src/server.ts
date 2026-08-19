import express from "express";
import type { Express } from "express";
import "dotenv/config";
import { validateEnv } from "./config/env";
import { userRouter } from "./routes/user.routes";


const port = Number(process.env.PORT) || 3000;
const app:Express = express();

// middelwares
validateEnv();


app.use(express.json({
    limit:"20kb"
}));
app.use("/api/user",userRouter)

app.listen(port,()=> console.log(`Runing on port:${port}`))
