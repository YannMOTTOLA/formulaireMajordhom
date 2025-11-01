import express from "express";
import helmet from "helmet";
import { router as apiRouter } from "./routers/index.route.ts";
import cors from "cors";
import { config } from "../config.ts"
import { globalErrorHandler } from "./middleware/global-error-handler.middleware.ts";

export const app = express();


app.use(helmet());
app.use(cors( {origin: config.allowedOrigins.split(",")}));
app.use(express.json());
app.use("/api", apiRouter)
app.use(globalErrorHandler);