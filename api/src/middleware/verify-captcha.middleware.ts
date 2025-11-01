import axios from "axios";
import type { Request, Response, NextFunction } from "express";

export const verifyCaptcha = async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (process.env.NODE_ENV === "test") {
      return next();
    }
    
    const { captchaToken } = req.body;



    if (!captchaToken) {
      return res.status(400).json({ message: "Token manquant" });
    }

    // Appel à l’API reCAPTCHA
    const { data } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    // Vérification de la validité du captcha
    if (!data.success || (data.score !== undefined && data.score < 0.5)) {
      return res.status(403).json({ message: "CAPTCHA invalide" });
    }
    next();
  } catch (err) {
    console.error("Erreur vérification CAPTCHA :", err);
    return res.status(500).json({ message: "Erreur serveur CAPTCHA" });
  }
};
