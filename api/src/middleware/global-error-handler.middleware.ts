import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { HttpError } from "../lib/errors.ts";

// Un error middleware prend 4 paramètres
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function globalErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  
  // Si erreur de validation Zod 
  if (error instanceof z.ZodError) {
    console.info(error); 
    res.status(422).json({ error: z.prettifyError(error) });
    return;
  }

  // Si erreur est de type HttpError
  if (error instanceof HttpError) {
    console.info(error);
    res.status(error.status).json({ error: error.message });
    return;
  }

  // Si c'est un autre type d'erreur que l'on ne maitrise pas (ex: la BDD plante)
  // Remplace ici tous les try-catch 500 sur tous les controlleurs
  console.error(error);
  res.status(500).json({ error: "Unexpected server error" });
}