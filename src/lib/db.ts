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

type PrayerMessageRecord = {
  id: string;
  prayerRequestId: string;
  direction: "incoming" | "outgoing";
  fromEmail: string;
  toEmail: string;
  subject: string;
  text: string;
  html: string | null;
  providerMessageId: string | null;
  inReplyTo: string | null;
  references: string | null;
  status: "queued" | "sent" | "failed" | "received";
  error: string | null;
  createdAt: Date;
};

type PrayerReplyAliasRecord = {
  id: string;
  prayerRequestId: string;
  token: string;
  isActive: boolean;
  createdAt: Date;
};

type SelectShape = Record<string, boolean>;

type FindManyArgs = {
  where?: any;
  orderBy?: { createdAt?: "asc" | "desc" };
  take?: number;
  skip?: number;
  select?: SelectShape;
};

type UpdateManyArgs = { where?: any; data: Record<string, unknown> };

declare global {
  var sqliteDb: DatabaseSync | undefined;
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
  if (where.prayerRequestId) {
    clauses.push('"prayerRequestId" = ?');
    values.push(where.prayerRequestId);
  }
  if (where.id) {
    clauses.push('"id" = ?');
    values.push(where.id);
  }
  if (where.createdAt?.lt) {
    clauses.push('"createdAt" < ?');
    values.push(new Date(where.createdAt.lt as Date).toISOString());
  }
  if (where.createdAt?.gte) {
    clauses.push('"createdAt" >= ?');
    values.push(new Date(where.createdAt.gte as Date).toISOString());
  }
  if (where.createdAt?.lte) {
    clauses.push('"createdAt" <= ?');
    values.push(new Date(where.createdAt.lte as Date).toISOString());
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

function mapPrayer(row: Record<string, unknown>): PrayerRecord {
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

function mapMessage(row: Record<string, unknown>): PrayerMessageRecord {
  return {
    id: String(row.id),
    prayerRequestId: String(row.prayerRequestId),
    direction: row.direction === "incoming" ? "incoming" : "outgoing",
    fromEmail: String(row.fromEmail ?? ""),
    toEmail: String(row.toEmail ?? ""),
    subject: String(row.subject ?? ""),
    text: String(row.text ?? ""),
    html: row.html == null ? null : String(row.html),
    providerMessageId: row.providerMessageId == null ? null : String(row.providerMessageId),
    inReplyTo: row.inReplyTo == null ? null : String(row.inReplyTo),
    references: row.references == null ? null : String(row.references),
    status: row.status === "failed" ? "failed" : row.status === "received" ? "received" : row.status === "queued" ? "queued" : "sent",
    error: row.error == null ? null : String(row.error),
    createdAt: toDate(row.createdAt),
  };
}

function mapAlias(row: Record<string, unknown>): PrayerReplyAliasRecord {
  return {
    id: String(row.id),
    prayerRequestId: String(row.prayerRequestId),
    token: String(row.token),
    isActive: Boolean(row.isActive),
    createdAt: toDate(row.createdAt),
  };
}

function findMany(table: string, mapper: (row: Record<string, unknown>) => any, args: FindManyArgs = {}) {
  const values: any[] = [];
  const whereSql = whereClause(args.where, values);
  const orderSql = args.orderBy?.createdAt === "asc" ? "ASC" : "DESC";
  const limitSql = typeof args.take === "number" ? `LIMIT ${Math.max(1, args.take)}` : "";
  const offsetSql = typeof args.skip === "number" && args.skip > 0 ? `OFFSET ${args.skip}` : "";
  const rows = db
    .prepare(`SELECT * FROM "${table}" WHERE ${whereSql} ORDER BY "createdAt" ${orderSql} ${limitSql} ${offsetSql}`)
    .all(...values) as Record<string, unknown>[];
  return rows.map((row) => pick(mapper(row), args.select));
}

export const prisma: any = {
  prayerRequest: {
    create({ data, select }: any) {
      const now = new Date();
      const id = data.id ?? randomUUID();
      db.prepare(
        `INSERT INTO "PrayerRequest" (
          "id", "createdAt", "updatedAt", "category", "urgency", "forWhom", "message",
          "name", "email", "phone", "city", "meetingFormat", "address", "status", "ipHash", "deletedAt"
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id,
        (data.createdAt ?? now).toISOString(),
        (data.updatedAt ?? now).toISOString(),
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
        data.status ?? "new",
        data.ipHash ?? null,
        data.deletedAt ? data.deletedAt.toISOString() : null
      );
      const row = db.prepare('SELECT * FROM "PrayerRequest" WHERE "id" = ?').get(id) as Record<string, unknown>;
      return pick(mapPrayer(row), select);
    },
    findMany(args: FindManyArgs) {
      return findMany("PrayerRequest", mapPrayer, args);
    },
    count({ where }: any = {}) {
      const values: any[] = [];
      const whereSql = whereClause(where, values);
      const row = db.prepare(`SELECT COUNT(*) as count FROM "PrayerRequest" WHERE ${whereSql}`).get(...values) as { count: number };
      return Number(row?.count ?? 0);
    },
    findUnique({ where, select }: any) {
      const row = db.prepare('SELECT * FROM "PrayerRequest" WHERE "id" = ?').get(where.id) as Record<string, unknown> | undefined;
      if (!row) return null;
      return pick(mapPrayer(row), select);
    },
    update({ where, data }: any) {
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
      return mapPrayer(row);
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
      const info = db.prepare(`UPDATE "PrayerRequest" SET ${sets.join(", ")} WHERE ${whereSql}`).run(...setValues, ...whereValues);
      return { count: Number(info.changes || 0) };
    },
  },
  prayerMessage: {
    create({ data }: any) {
      const id = data.id ?? randomUUID();
      db.prepare(
        `INSERT INTO "PrayerMessage" (
          "id","prayerRequestId","direction","fromEmail","toEmail","subject","text","html",
          "providerMessageId","inReplyTo","references","status","error","createdAt"
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        id,
        data.prayerRequestId,
        data.direction,
        data.fromEmail,
        data.toEmail,
        data.subject,
        data.text,
        data.html ?? null,
        data.providerMessageId ?? null,
        data.inReplyTo ?? null,
        data.references ?? null,
        data.status ?? "queued",
        data.error ?? null,
        (data.createdAt ?? new Date()).toISOString()
      );
      const row = db.prepare('SELECT * FROM "PrayerMessage" WHERE "id" = ?').get(id) as Record<string, unknown>;
      return mapMessage(row);
    },
    findMany(args: FindManyArgs) {
      return findMany("PrayerMessage", mapMessage, args);
    },
  },
  prayerReplyAlias: {
    findFirst({ where }: any) {
      const row = db
        .prepare('SELECT * FROM "PrayerReplyAlias" WHERE "prayerRequestId" = ? AND "isActive" = 1 ORDER BY "createdAt" DESC LIMIT 1')
        .get(where.prayerRequestId) as Record<string, unknown> | undefined;
      return row ? mapAlias(row) : null;
    },
    create({ data }: any) {
      const id = data.id ?? randomUUID();
      db.prepare('INSERT INTO "PrayerReplyAlias" ("id","prayerRequestId","token","isActive","createdAt") VALUES (?, ?, ?, ?, ?)').run(
        id,
        data.prayerRequestId,
        data.token,
        data.isActive === false ? 0 : 1,
        (data.createdAt ?? new Date()).toISOString()
      );
      const row = db.prepare('SELECT * FROM "PrayerReplyAlias" WHERE "id" = ?').get(id) as Record<string, unknown>;
      return mapAlias(row);
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
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PrayerMessage" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "prayerRequestId" TEXT NOT NULL,
          "direction" TEXT NOT NULL,
          "fromEmail" TEXT NOT NULL,
          "toEmail" TEXT NOT NULL,
          "subject" TEXT NOT NULL,
          "text" TEXT NOT NULL,
          "html" TEXT,
          "providerMessageId" TEXT,
          "inReplyTo" TEXT,
          "references" TEXT,
          "status" TEXT NOT NULL DEFAULT 'queued',
          "error" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "PrayerReplyAlias" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "prayerRequestId" TEXT NOT NULL,
          "token" TEXT NOT NULL,
          "isActive" BOOLEAN NOT NULL DEFAULT 1,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
