// test/index.ts
import axios from "axios";
import type { Contact } from "../src/models/index.ts";
import { prisma, Gender } from "../src/models/index.ts";

// Compteur pour générer des IDs uniques
let fakeContactId = 0;

// Génère un faux contact (style generateFakeUser)
export function generateFakeContact(contact?: Partial<Contact>): Contact {
  fakeContactId++;
  return {
    id: `fake-contact-${fakeContactId}`,
    gender: Gender.MALE,
    firstName: "Jean",
    lastName: "Dupont",
    email: `contact${fakeContactId}@example.com`,
    phone: "+33612345678",
    createdAt: new Date(),
    ...contact,
  };
}

// Réinitialise la base de données avant chaque test
export async function resetDatabase() {
  await prisma.message.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.contact.deleteMany();
}

// Client HTTP pour les requêtes API
export const httpRequester = axios.create({
  baseURL: `http://localhost:${process.env.PORT || 3000}/api`,
  validateStatus: () => true, // pas d'erreur Axios sur 4XX / 5XX
});

