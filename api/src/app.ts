import express from "express";
import helmet from "helmet";
import { router as apiRouter } from "./routers/index.route.ts";
import cors from "cors";

export const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());
app.use("/api", apiRouter)