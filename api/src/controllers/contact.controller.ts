import type { Request, Response } from "express"
import { prisma } from "../models/index.ts"
import { BadRequestError, NotFoundError } from "../lib/errors.ts"
import z from "zod";

export async function getAllMessage(req: Request, res: Response) {
    const contacts = await prisma.contact.findMany({
        include: {
            messages: true,
        }
    })

    res.status(200).json(contacts);
}

export async function getAllMessageByEmail(req: Request, res: Response) {
    const emailParamSchema = z.object({
        email: z.email(),
    });
    const email = await emailParamSchema.parseAsync(req.params);

    if (!email) {
        throw new BadRequestError("email not valid");
    }

    const contact = await prisma.contact.findMany({ where: email, include: { messages: true, } })

    if (!contact) {
        throw new NotFoundError("email not found");
    }

    res.json(contact);

}

export async function submitForm(req: Request, res: Response) {

    // schema de validation Zod pour les données que l'utilisateur renseigne
    const submitFormBodySchema = z.object({
        gender: z.enum(["MALE", "FEMALE"]),
        firstName: z.string().min(1).max(20),
        lastName: z.string().min(1).max(20),
        email: z.email(),
        phone: z.e164(),
        message: z.string().min(1).max(1000),
        topic: z.enum(["VISIT", "CALLBACK", "PICTURES"]),
        day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
        hour: z.number().int().min(0).max(23),
        minute: z.number().int().min(0).max(59)
    });

    // récupération des info du body du formulaire
    const { gender, firstName, lastName, email, phone, topic, message, day, hour, minute } = await submitFormBodySchema.parseAsync(req.body)

    // creation du contact
    const contact = await prisma.contact.create({
        data: {
            gender,
            firstName,
            lastName,
            email,
            phone
        },
    });


    // Création du message lié à l'utilisateur
    const createMessage = await prisma.message.create({
        data: {
            topic,
            message,
            contactId: contact.id
        }
    });

    // Création de la disponibilité liée à l'utilisateur
    const createAvailability = await prisma.availability.create({
        data: {
            day,
            hour,
            minute,
            contactId: contact.id
        }
    });

    res.status(201).json({
        success: true,
        contact,
        message: createMessage,
        availability: createAvailability,
    });
}