import express from "express";
import helmet from "helmet";
import { router as apiRouter } from "./routers/index.route.ts";
import cors from "cors";
import { globalErrorHandler } from "./middleware/global-error-handler.middleware.ts";

export const app = express();


app.use(helmet());
app.use(cors( {origin: "http://localhost:8002" }));
app.use(express.json());
app.use("/api", apiRouter)
app.use(globalErrorHandler);