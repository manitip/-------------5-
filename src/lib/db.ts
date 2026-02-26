import { randomUUID } from "crypto";
import { DatabaseSync } from "node:sqlite";

type PrayerRecord = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  urgency: string;
  forWhom: string;
  message: string;
  name: string | null;
  email: string | null;
  phone: string;
  city: string;
  meetingFormat: string | null;
  address: string | null;
  status: string;
  ipHash: string | null;
  deletedAt: Date | null;
};

type SelectShape = Record<string, boolean>;

type FindManyArgs = {
  where?: any;
  orderBy?: { createdAt: "asc" | "desc" };
  take?: number;
  select?: SelectShape;
};

type CreateArgs = {
  data: Omit<PrayerRecord, "createdAt" | "updatedAt" | "deletedAt" | "id" | "status"> &
    Partial<Pick<PrayerRecord, "id" | "status" | "deletedAt" | "createdAt" | "updatedAt">>;
  select?: SelectShape;
};

type UpdateArgs = { where: { id: string }; data: Partial<PrayerRecord> };
type UpdateManyArgs = { where?: any; data: Partial<PrayerRecord> };

declare global {
  // eslint-disable-next-line no-var
  var sqliteDb: DatabaseSync | undefined;
  // eslint-disable-next-line no-var
  var prismaPrayerSchemaReady: Promise<void> | undefined;
}

function dbFileFromUrl(url: string) {
  if (url.startsWith("file:")) {
    const value = url.slice(5);
    return value.startsWith("/") ? value : value;
  }
  return "./prisma/dev.db";
}

const sqliteLike = (process.env.DATABASE_URL || "file:./prisma/dev.db").startsWith("file:");

const db =
  global.sqliteDb ||
  new DatabaseSync(dbFileFromUrl(process.env.DATABASE_URL || "file:./prisma/dev.db"), {
    open: true,
  });

if (process.env.NODE_ENV !== "production") global.sqliteDb = db;

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  return new Date(String(value));
}

function mapRecord(row: Record<string, unknown>): PrayerRecord {
  return {
    id: String(row.id),
    createdAt: toDate(row.createdAt),
    updatedAt: toDate(row.updatedAt),
    category: String(row.category),
    urgency: String(row.urgency),
    forWhom: String(row.forWhom),
    message: String(row.message),
    name: row.name == null ? null : String(row.name),
    email: row.email == null ? null : String(row.email),
    phone: String(row.phone ?? ""),
    city: String(row.city ?? ""),
    meetingFormat: row.meetingFormat == null ? null : String(row.meetingFormat),
    address: row.address == null ? null : String(row.address),
    status: String(row.status),
    ipHash: row.ipHash == null ? null : String(row.ipHash),
    deletedAt: row.deletedAt == null ? null : toDate(row.deletedAt),
  };
}

function pick(obj: Record<string, unknown>, select?: SelectShape): any {
  if (!select) return obj;
  const result: Record<string, unknown> = {};
  for (const [key, enabled] of Object.entries(select)) {
    if (enabled) result[key] = obj[key];
  }
  return result;
}

function whereClause(where: any, values: any[]) {
  if (!where) return "1=1";

  const clauses: string[] = [];

  if (where.deletedAt === null) clauses.push('"deletedAt" IS NULL');
  if (where.status) {
    clauses.push('"status" = ?');
    values.push(where.status);
  }
  if (where.createdAt?.lt) {
    clauses.push('"createdAt" < ?');
    values.push(new Date(where.createdAt.lt as Date).toISOString());
  }

  if (Array.isArray(where.OR) && where.OR.length > 0) {
    const orClauses: string[] = [];
    for (const item of where.OR) {
      for (const [field, filter] of Object.entries(item)) {
        const contains = (filter as { contains?: string })?.contains;
        if (contains) {
          orClauses.push(`"${field}" LIKE ?`);
          values.push(`%${contains}%`);
        }
      }
    }
    if (orClauses.length > 0) clauses.push(`(${orClauses.join(" OR ")})`);
  }

  return clauses.length > 0 ? clauses.join(" AND ") : "1=1";
}

export const prisma: any = {
  prayerRequest: {
    create({ data, select }: CreateArgs) {
      const now = new Date();
      const createdAt = data.createdAt ?? now;
      const updatedAt = data.updatedAt ?? now;
      const id = data.id ?? randomUUID();
      const status = data.status ?? "new";
      db.prepare(
        `INSERT INTO "PrayerRequest" (
          "id", "createdAt", "updatedAt", "category", "urgency", "forWhom", "message",
          "name", "email", "phone", "city", "meetingFormat", "address", "status", "ipHash", "deletedAt"
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id,
        createdAt.toISOString(),
        updatedAt.toISOString(),
        data.category,
        data.urgency,
        data.forWhom,
        data.message,
        data.name ?? null,
        data.email ?? null,
        data.phone,
        data.city,
        data.meetingFormat ?? null,
        data.address ?? null,
        status,
        data.ipHash ?? null,
        data.deletedAt ? data.deletedAt.toISOString() : null
      );

      const row = db.prepare('SELECT * FROM "PrayerRequest" WHERE "id" = ?').get(id) as Record<string, unknown>;
      return pick(mapRecord(row), select);
    },

    findMany({ where, orderBy, take, select }: FindManyArgs) {
      const values: any[] = [];
      const whereSql = whereClause(where, values);
      const orderSql = orderBy?.createdAt === "asc" ? "ASC" : "DESC";
      const limitSql = typeof take === "number" ? `LIMIT ${Math.max(1, take)}` : "";
      const rows = db
        .prepare(`SELECT * FROM "PrayerRequest" WHERE ${whereSql} ORDER BY "createdAt" ${orderSql} ${limitSql}`)
        .all(...values) as Record<string, unknown>[];

      return rows.map((row) => pick(mapRecord(row), select));
    },

    update({ where, data }: UpdateArgs) {
      const sets: string[] = [];
      const values: any[] = [];
      for (const [key, value] of Object.entries(data)) {
        sets.push(`"${key}" = ?`);
        values.push(value instanceof Date ? value.toISOString() : value ?? null);
      }
      sets.push('"updatedAt" = ?');
      values.push(new Date().toISOString());
      values.push(where.id);
      db.prepare(`UPDATE "PrayerRequest" SET ${sets.join(", ")} WHERE "id" = ?`).run(...values);
      const row = db.prepare('SELECT * FROM "PrayerRequest" WHERE "id" = ?').get(where.id) as Record<string, unknown>;
      return mapRecord(row);
    },

    updateMany({ where, data }: UpdateManyArgs) {
      const sets: string[] = [];
      const setValues: any[] = [];
      for (const [key, value] of Object.entries(data)) {
        sets.push(`"${key}" = ?`);
        setValues.push(value instanceof Date ? value.toISOString() : value ?? null);
      }
      sets.push('"updatedAt" = ?');
      setValues.push(new Date().toISOString());

      const whereValues: any[] = [];
      const whereSql = whereClause(where, whereValues);
      const info = db
        .prepare(`UPDATE "PrayerRequest" SET ${sets.join(", ")} WHERE ${whereSql}`)
        .run(...setValues, ...whereValues);
      return { count: Number(info.changes || 0) };
    },
  },
  $executeRawUnsafe(sql: string) {
    db.exec(sql);
    return 0;
  },
  $queryRawUnsafe<T>(sql: string) {
    return db.prepare(sql).all() as T;
  },
};

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

      const cols = ((await prisma.$queryRawUnsafe('PRAGMA table_info("PrayerRequest")')) as Array<{ name: string }>) || [];
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
