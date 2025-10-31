import type { NextFunction, Request, Response } from "express"
import { prisma } from "../models/index.ts"
import { BadRequestError, NotFoundError } from "../lib/errors.ts"
import z from "zod";

export async function getAllMessage(req: Request, res: Response) {
    const contacts = await prisma.contact.findMany({
        include: {
            messages: true,
            availabilities: true
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

    const existContact = await prisma.contact.findFirst({ where: email, include: { messages: true, } })

    if (!existContact) {
        throw new NotFoundError("email not found");
    }

    const contact = await prisma.contact.findMany({ where: email, include: { messages: true, } })

    res.json(contact);

}

export async function submitForm(req: Request, res: Response, next: NextFunction) {
        // schema de validation Zod pour les données que l'utilisateur renseigne
        const submitFormBodySchema = z.object({
            gender: z.enum(["MALE", "FEMALE"]),
            firstName: z.string().min(1).max(20),
            lastName: z.string().min(1).max(20),
            email: z.email(),
            phone: z.e164(),
            message: z.string().min(1).max(1000),
            topic: z.enum(["VISIT", "CALLBACK", "PICTURES"]),
            availabilities: z
                .array(
                    z.object({
                        day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"]),
                        hour: z.number().int().min(0).max(23),
                        minute: z.number().int().min(0).max(59),
                    })
                )
                .min(1),
        });

        // récupération des info du body du formulaire
        const { gender, firstName, lastName, email, phone, topic, message, availabilities } = await submitFormBodySchema.parseAsync(req.body)

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

        // Création des disponibilités liées à l'utilisateur
        await prisma.availability.createMany({
            data: availabilities.map((a) => ({
                day: a.day,
                hour: a.hour,
                minute: a.minute,
                contactId: contact.id,
            })),
        });

        res.status(201).json({
            success: true,
            contact,
            message: createMessage,
            availabilities
        });
}