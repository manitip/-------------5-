import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaPrayerSchemaReady: Promise<void> | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

const sqliteLike = (process.env.DATABASE_URL || "").startsWith("file:");

const prayerColumns: Array<{ name: string; sql: string }> = [
  { name: "id", sql: '"id" TEXT NOT NULL PRIMARY KEY' },
  { name: "createdAt", sql: '"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP' },
  { name: "updatedAt", sql: '"updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP' },
  { name: "category", sql: '"category" TEXT NOT NULL' },
  { name: "urgency", sql: '"urgency" TEXT NOT NULL DEFAULT \'usual\'' },
  { name: "forWhom", sql: '"forWhom" TEXT NOT NULL DEFAULT \'self\'' },
  { name: "message", sql: '"message" TEXT NOT NULL' },
  { name: "name", sql: '"name" TEXT' },
  { name: "email", sql: '"email" TEXT' },
  { name: "phone", sql: '"phone" TEXT NOT NULL DEFAULT \'\'' },
  { name: "city", sql: '"city" TEXT NOT NULL DEFAULT \'izhevsk\'' },
  { name: "meetingFormat", sql: '"meetingFormat" TEXT' },
  { name: "address", sql: '"address" TEXT' },
  { name: "status", sql: '"status" TEXT NOT NULL DEFAULT \'new\'' },
  { name: "ipHash", sql: '"ipHash" TEXT' },
  { name: "deletedAt", sql: '"deletedAt" DATETIME' },
];

export async function ensurePrayerSchema() {
  if (!sqliteLike) return;

  if (!global.prismaPrayerSchemaReady) {
    global.prismaPrayerSchemaReady = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PrayerRequest" (
          ${prayerColumns.map((col) => col.sql).join(",\n          ")}
        )
      `);

      const cols = (await prisma.$queryRawUnsafe<Array<{ name: string }>>(
        'PRAGMA table_info("PrayerRequest")'
      )) || [];
      const existing = new Set(cols.map((c) => c.name));

      for (const col of prayerColumns) {
        if (!existing.has(col.name)) {
          await prisma.$executeRawUnsafe(`ALTER TABLE "PrayerRequest" ADD COLUMN ${col.sql}`);
        }
      }
    })().catch((err) => {
      global.prismaPrayerSchemaReady = undefined;
      throw err;
    });
  }

  await global.prismaPrayerSchemaReady;
}
