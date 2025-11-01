// Fichier de configuration globale pour les tests d'intégration

import { execSync } from "node:child_process";
import { before, beforeEach, after, type TestContext } from "node:test";
import { app } from "../../src/app.ts";
import type { Server } from "node:http";
import { prisma } from "../../src/models/index.ts";

let server: Server;

// BEFORE = Se lance 1 fois avant l'ensemble des tests
before(() => {
  // (Hack) S'assurer qu'aucune BDD de test n'est préalablement lancée
  execSync(`docker rm -f majordhomTest 2>/dev/null || true`);  

  execSync(`
    docker run \
      --name majordhomTest \
      -d \
      -e POSTGRES_USER=majordhomTest \
      -e POSTGRES_PASSWORD=majordhomTest \
      -e POSTGRES_DB=majordhomTest \
      -p 5437:5432 \
    postgres:18
  `);

  // Attendre une petite seconde pour s'assurer qu'elle tourne bien
  execSync(`sleep 1`);

  execSync(`npx prisma migrate deploy`);

  // Lancer un serveur HTTP de test
  server = app.listen(process.env.PORT);
});

// BEFOREEACH = Se lance 1 fois avant CHAQUE test
beforeEach(async (t) => {
  // Désactiver les logs des console.info()
  (t as TestContext).mock.method(console, "info", () => {});

  // Vider les données de la BDD de test (en concervant les tables existantes) => truncate
  await truncateTables();
});

// AFTER = Se lance 1 fois après tous les tests
after(async () => {
  // Eteindre le serveur HTTP
  server.close();

  // Deconnecter Node.js de la BDD
  await prisma.$disconnect();

  // Supprimer la BDD de test
  execSync(`docker rm -f majordhomTest`);
});

async function truncateTables() {
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
};