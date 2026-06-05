import fs from "fs";
import path from "path";
import type { StoreDatabase } from "./types";
import { createSeedDatabase } from "./seed";

const DB_PATH = path.join(process.cwd(), "data", "store-db.json");

let cache: StoreDatabase | null = null;
let cacheMtime = 0;
let seedDefaults: StoreDatabase | null = null;

function getSeedDefaults(): StoreDatabase {
  if (!seedDefaults) seedDefaults = createSeedDatabase();
  return seedDefaults;
}

function mergeData(data: Partial<StoreDatabase>): StoreDatabase {
  const seed = getSeedDefaults();
  return {
    ...seed,
    ...data,
    products: data.products ?? seed.products,
    categories: data.categories ?? seed.categories,
    coupons: data.coupons ?? seed.coupons,
    settings: data.settings ?? seed.settings,
    users: data.users ?? [],
    passwordResetTokens: data.passwordResetTokens ?? [],
    orders: data.orders ?? [],
    contactMessages: data.contactMessages ?? [],
    faqs: seed.faqs,
    testimonials: seed.testimonials,
    teamMembers: seed.teamMembers,
    brandStats: seed.brandStats,
  } as StoreDatabase;
}

function readFile(): StoreDatabase {
  if (!fs.existsSync(DB_PATH)) {
    const seed = createSeedDatabase();
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), "utf-8");
    cache = seed;
    cacheMtime = fs.statSync(DB_PATH).mtimeMs;
    return seed;
  }

  const stat = fs.statSync(DB_PATH);
  if (cache && stat.mtimeMs === cacheMtime) {
    return cache;
  }

  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const data = JSON.parse(raw) as Partial<StoreDatabase>;
  const merged = mergeData(data);
  cache = merged;
  cacheMtime = stat.mtimeMs;
  return merged;
}

function writeFile(data: StoreDatabase): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  cache = data;
  cacheMtime = fs.statSync(DB_PATH).mtimeMs;
}

/** Read the full store database. Swap this module for Prisma/Drizzle later. */
export function getDatabase(): StoreDatabase {
  return readFile();
}

/** Persist the full store database. */
export function saveDatabase(data: StoreDatabase): void {
  writeFile(data);
}

/** Update database with a mutator function. */
export function updateDatabase(mutator: (db: StoreDatabase) => void): StoreDatabase {
  const db = readFile();
  mutator(db);
  writeFile(db);
  return db;
}

/** Reset database to seed data. */
export function resetDatabase(): StoreDatabase {
  const seed = createSeedDatabase();
  writeFile(seed);
  return seed;
}
