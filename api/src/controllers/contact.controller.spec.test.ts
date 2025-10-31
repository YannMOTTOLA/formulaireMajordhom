// src/controllers/contact.controller.spec.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { prisma, Gender, Topic, Days } from "../models/index.ts";
import { httpRequester, resetDatabase, generateFakeContact } from "../../test/index.ts";

describe("[POST] /api/contact/submit", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("should create a contact, a message and an availability", async () => {
    // ARRANGE
    const BODY = {
      gender: "MALE",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      phone: "+33611111111",
      message: "Je souhaite planifier une visite.",
      topic: "VISIT",
      day: "MONDAY",
      hour: 10,
      minute: 30,
    };

    // ACT
    const { status, data } = await httpRequester.post("/contact/submit", BODY);

    // ASSERT
    assert.equal(status, 201);
    assert.ok(data.success);
    assert.ok(data.contact.id);
    assert.ok(data.message.id);
    assert.ok(data.availability.id);

    const contactInDb = await prisma.contact.findUnique({
      where: { id: data.contact.id },
      include: { messages: true, availabilities: true },
    });

    assert.equal(contactInDb?.email, BODY.email);
    assert.equal(contactInDb?.messages[0].message, BODY.message);
    assert.equal(contactInDb?.availabilities[0].day, BODY.day);
  });

  it("should return 422 if email is invalid", async () => {
    const BODY = {
      gender: "MALE",
      firstName: "Jean",
      lastName: "Dupont",
      email: "invalidEmail",
      phone: "+33611111111",
      message: "Test invalide",
      topic: "VISIT",
      day: "MONDAY",
      hour: 9,
      minute: 15,
    };

    const { status } = await httpRequester.post("/contact/submit", BODY);
    assert.equal(status, 422);
  });
});

describe("[GET] /api/contact", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("should return all contacts with their messages", async () => {
    // ARRANGE
    const fakeContact = generateFakeContact({
      gender: Gender.FEMALE,
      firstName: "Alice",
      lastName: "Martin",
      email: "alice@example.com",
      phone: "+33622222222",
    });

    await prisma.contact.create({
      data: {
        id: fakeContact.id,
        gender: fakeContact.gender,
        firstName: fakeContact.firstName,
        lastName: fakeContact.lastName,
        email: fakeContact.email,
        phone: fakeContact.phone,
        messages: {
          create: {
            topic: Topic.CALLBACK,
            message: "Pouvez-vous me rappeler ?",
          },
        },
      },
    });

    // ACT
    const { status, data } = await httpRequester.get("/contact");

    // ASSERT
    assert.equal(status, 200);
    assert.ok(Array.isArray(data));
    assert.equal(data[0].email, fakeContact.email);
    assert.equal(data[0].messages[0].message, "Pouvez-vous me rappeler ?");
  });
});

describe("[GET] /api/contact/:email", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("should return messages for a specific contact email", async () => {
    const EMAIL = "bob@example.com";

    await prisma.contact.create({
      data: {
        ...generateFakeContact({
          email: EMAIL,
          gender: Gender.MALE,
          firstName: "Bob",
        }),
        messages: {
          create: {
            topic: Topic.VISIT,
            message: "Je souhaite visiter le bien.",
          },
        },
      },
    });

    const { status, data } = await httpRequester.get(`/contact/${EMAIL}`);

    assert.equal(status, 200);
    assert.ok(Array.isArray(data));
    assert.equal(data[0].email, EMAIL);
    assert.equal(data[0].messages[0].message, "Je souhaite visiter le bien.");
  });

  it("should return 404 if contact email not found", async () => {
    const { status } = await httpRequester.get("/contact/inexistant@example.com");
    assert.equal(status, 404);
  });

  it("should return 422 if email param is invalid", async () => {
    const { status } = await httpRequester.get("/contact/notanemail");
    assert.equal(status, 422);
  });
});
