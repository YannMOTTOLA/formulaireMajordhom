import { Router } from "express";
import { router as contactRouter } from "./contact.route.ts"

export const router = Router();

router.use(contactRouter);