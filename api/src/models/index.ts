import { PrismaClient } from "../../prisma/generated/prisma/client.ts";

export const prisma = new PrismaClient();

export * from "../../prisma/generated/prisma/client.ts";