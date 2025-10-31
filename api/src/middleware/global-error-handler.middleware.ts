import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/errors.ts";

export async function globalErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 🧱 Erreurs de validation Zod
  if (error instanceof ZodError) {
    const fieldMessages: Record<string, string> = {
      gender: "Veuillez sélectionner une civilité.",
      firstName: "Le prénom est requis et doit contenir au maximum 20 caractères.",
      lastName: "Le nom est requis et doit contenir au maximum 20 caractères.",
      email: "Veuillez saisir une adresse email valide.",
      phone: "Veuillez saisir un numéro de téléphone valide.",
      message: "Veuillez écrire un message (maximum 1000 caractères).",
      topic: "Veuillez sélectionner un sujet.",
      availabilities: "Veuillez ajouter au moins une disponibilité.",
      "availabilities.day": "Jour de disponibilité invalide.",
      "availabilities.hour": "L’heure doit être comprise entre 0 et 23.",
      "availabilities.minute": "Les minutes doivent être comprises entre 0 et 59.",
    };

    const errors = error.issues.map((issue) => {
      const field = issue.path.join(".").replace(/\.\d+\./g, ".");
      const message = fieldMessages[field] || issue.message;
      return { field, message };
    });

    return res.status(422).json({
      success: false,
      message: "Le formulaire contient des erreurs.",
      errors,
    });
  }

  // 🧱 Erreurs HTTP personnalisées (BadRequestError, NotFoundError, etc.)
  if (error instanceof HttpError) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  // 🧱 Erreurs non prévues (erreurs Prisma, réseau, etc.)
  console.error("Unexpected error:", error);
  return res.status(500).json({
    success: false,
    message: "Erreur interne du serveur. Veuillez réessayer plus tard.",
  });
}
