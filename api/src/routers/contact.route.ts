import { Router } from "express";
import { submitForm, getAllMessage, getAllMessageByEmail } from "../controllers/contact.controller.ts"

export const router = Router();

router.get("/contact", getAllMessage)
router.get("/contact/:email", getAllMessageByEmail)
router.post("/contact/submit", submitForm)