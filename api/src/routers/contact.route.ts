import { Router } from "express";
import { verifyCaptcha } from "../middleware/verify-captcha.middleware.ts";
import rateLimit from "express-rate-limit";
import { submitForm, getAllMessage, getAllMessageByEmail } from "../controllers/contact.controller.ts";

export const router = Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10, 
  message: "Trop de requêtes, réessayez plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/contact", getAllMessage)
router.get("/contact/:email", getAllMessageByEmail)
router.post("/contact/submit", contactLimiter, verifyCaptcha, submitForm);
