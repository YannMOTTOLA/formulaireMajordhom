import { Router } from "express";
import { submitForm } from "../controllers/contact.controller.ts"

export const router = Router();

router.post("/contact/submit", submitForm)