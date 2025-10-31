import type { Request, Response } from "express"
import { prisma } from "../models/index.ts"
import { BadRequestError } from "../lib/errors.ts"
import z from "zod";

export async function submitForm(req: Request, res: Response) {

    // schema de validation Zod pour les données que l'utilisateur renseigne
    const submitFormBodySchema = z.object({
        firstName: z.string().min(1).max(20),
        lastName: z.string().min(1).max(20),
        email: z.email(),
        phone: z.e164,
        message: z.string().min(1).max(1000),
        topic: z.enum(["VISIT", "CALLBACK", "PICTURES"]),
        day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
        hour: z.number().int().min(0).max(23),
        minute: z.number().int().min(0).max(59)
    }); 

    // récupération des info du body du formulaire
    const {firstName, lastName, email, phone, topic, message, day, hour, minute } = await submitFormBodySchema.parseAsync(req.body)

}