import fs from "fs";
import path from "path";
import type { BrandStat, StoreDatabase } from "./types";
import type {
  Category,
  ContactMessage,
  Coupon,
  FAQ,
  Order,
  PasswordResetToken,
  Product,
  StoreSettings,
  TeamMember,
  Testimonial,
  User,
} from "@/types";
import { createSeedDatabase } from "./seed";
import { mergeData } from "./merge";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { WriteBatch } from "firebase-admin/firestore";
import { sanitizeFirestoreData } from "./sanitize-firestore";

const LOCAL_DB_PATH = path.join(process.cwd(), "data", "store-db.json");

let cache: StoreDatabase | null = null;
let initialized = false;
let initPromise: Promise<void> | null = null;
let writeChain: Promise<void> = Promise.resolve();
const FIRESTORE_INIT_TIMEOUT_MS = 5000;
let lastLoadedTime = 0;
const CACHE_TTL_MS = 10000; // 10 seconds cache TTL

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
    promise
      .then(resolve, reject)
      .finally(() => clearTimeout(timer));
  });
}

function bootstrapCache(): StoreDatabase {
  if (cache) return cache;
  const local = loadLocalJson();
  cache = mergeData(local ?? createSeedDatabase());
  return cache;
}

function mapDocs<T>(docs: FirebaseFirestore.QueryDocumentSnapshot[]): T[] {
  return docs.map((doc) => doc.data() as T);
}

async function loadArrayCollection<T>(name: string): Promise<T[]> {
  const snapshot = await getAdminFirestore().collection(name).get();
  return mapDocs<T>(snapshot.docs);
}

async function loadFromFirestore(): Promise<Partial<StoreDatabase>> {
  const firestore = getAdminFirestore();

  const [
    products,
    categories,
    orders,
    coupons,
    users,
    contactMessages,
    passwordResetTokens,
    faqs,
    testimonials,
    teamMembers,
    settingsDoc,
    brandStatsDoc,
  ] = await Promise.all([
    loadArrayCollection<Product>("products"),
    loadArrayCollection<Category>("categories"),
    loadArrayCollection<Order>("orders"),
    loadArrayCollection<Coupon>("coupons"),
    loadArrayCollection<User>("users"),
    loadArrayCollection<ContactMessage>("contactMessages"),
    loadArrayCollection<PasswordResetToken>("passwordResetTokens"),
    loadArrayCollection<FAQ>("faqs"),
    loadArrayCollection<Testimonial>("testimonials"),
    loadArrayCollection<TeamMember>("teamMembers"),
    firestore.collection("settings").doc("store").get(),
    firestore.collection("meta").doc("brandStats").get(),
  ]);

  return {
    products,
    categories,
    orders,
    coupons,
    users,
    contactMessages,
    passwordResetTokens,
    faqs,
    testimonials,
    teamMembers,
    settings: settingsDoc.exists ? (settingsDoc.data() as StoreSettings) : undefined,
    brandStats: brandStatsDoc.exists ? (brandStatsDoc.data()?.items as BrandStat[]) : undefined,
    version: 1,
  };
}

function loadLocalJson(): Partial<StoreDatabase> | null {
  if (!fs.existsSync(LOCAL_DB_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf-8")) as Partial<StoreDatabase>;
  } catch {
    return null;
  }
}

function isDatabaseEmpty(data: Partial<StoreDatabase>): boolean {
  return (data.products?.length ?? 0) === 0 && (data.categories?.length ?? 0) === 0;
}

async function runBatches(
  ops: Array<(batch: WriteBatch) => void>
): Promise<void> {
  const firestore = getAdminFirestore();
  const chunkSize = 450;

  for (let i = 0; i < ops.length; i += chunkSize) {
    const batch = firestore.batch();
    ops.slice(i, i + chunkSize).forEach((op) => op(batch));
    await batch.commit();
  }
}

function getDocId(collection: keyof StoreDatabase, item: unknown): string {
  const record = item as Record<string, string>;
  if (collection === "coupons") return record.code.toUpperCase();
  if (collection === "passwordResetTokens") return record.token;
  if (collection === "settings") return "store";
  return record.id;
}

async function syncArrayCollection<K extends keyof StoreDatabase>(
  collection: K,
  before: StoreDatabase[K],
  after: StoreDatabase[K]
): Promise<void> {
  if (collection === "settings" || collection === "brandStats" || collection === "version") {
    return;
  }

  const beforeList = (before as unknown[]) ?? [];
  const afterList = (after as unknown[]) ?? [];

  if (JSON.stringify(beforeList) === JSON.stringify(afterList)) {
    return;
  }

  const firestore = getAdminFirestore();
  const col = firestore.collection(collection as string);

  const beforeIds = new Set(beforeList.map((item) => getDocId(collection, item)));
  const afterIds = new Set(afterList.map((item) => getDocId(collection, item)));

  const ops: Array<(batch: WriteBatch) => void> = [];

  const beforeMap = new Map(beforeList.map((item) => [getDocId(collection, item), item]));

  for (const id of beforeIds) {
    if (!afterIds.has(id)) {
      ops.push((batch) => batch.delete(col.doc(id)));
    }
  }

  for (const item of afterList) {
    const id = getDocId(collection, item);
    const previous = beforeMap.get(id);
    if (previous && JSON.stringify(previous) === JSON.stringify(item)) {
      continue;
    }
    ops.push((batch) => batch.set(col.doc(id), sanitizeFirestoreData(item as Record<string, unknown>)));
  }

  if (ops.length === 0) return;

  await runBatches(ops);
}

async function syncSettings(before: StoreSettings, after: StoreSettings): Promise<void> {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  await getAdminFirestore().collection("settings").doc("store").set(sanitizeFirestoreData(after));
}

async function syncBrandStats(before: BrandStat[], after: BrandStat[]): Promise<void> {
  if (JSON.stringify(before) === JSON.stringify(after)) return;
  await getAdminFirestore().collection("meta").doc("brandStats").set({ items: sanitizeFirestoreData(after) });
}

async function persistDiff(before: StoreDatabase, after: StoreDatabase): Promise<void> {
  const collections: Array<keyof StoreDatabase> = [
    "products",
    "categories",
    "orders",
    "coupons",
    "users",
    "contactMessages",
    "passwordResetTokens",
    "faqs",
    "testimonials",
    "teamMembers",
  ];

  await Promise.all([
    ...collections.map((key) => syncArrayCollection(key, before[key], after[key])),
    syncSettings(before.settings, after.settings),
    syncBrandStats(before.brandStats, after.brandStats),
  ]);
}

export async function persistFullDatabase(data: StoreDatabase): Promise<void> {
  const before = createSeedDatabase();
  before.orders = [];
  before.users = [];
  before.contactMessages = [];
  before.passwordResetTokens = [];
  await persistDiff(before, data);
}

export async function initializeFirestoreStore(force = false): Promise<void> {
  const now = Date.now();
  const isExpired = now - lastLoadedTime > CACHE_TTL_MS;

  if (initialized && !isExpired && !force) return;
  if (initPromise && !isExpired && !force) return initPromise;

  bootstrapCache();

  initPromise = (async () => {
    try {
      const raw = await withTimeout(
        loadFromFirestore(),
        FIRESTORE_INIT_TIMEOUT_MS,
        "Firestore load"
      );

      if (isDatabaseEmpty(raw)) {
        await persistFullDatabase(cache!);
      } else {
        cache = mergeData(raw);
      }
      lastLoadedTime = Date.now();
    } catch (err) {
      console.warn(
        "[firestore-store] load failed, using bootstrap cache:",
        err instanceof Error ? err.message : err
      );
    } finally {
      initialized = true;
    }
  })();

  return initPromise;
}

export function isFirestoreStoreReady(): boolean {
  return cache !== null;
}

export function getDatabase(): StoreDatabase {
  return bootstrapCache();
}

export function updateDatabase(mutator: (db: StoreDatabase) => void): StoreDatabase {
  const db = bootstrapCache();
  const before = structuredClone(db) as StoreDatabase;
  mutator(db);
  const after = db;

  writeChain = writeChain
    .then(async () => {
      if (initPromise) await initPromise;
      await persistDiff(before, after);
      lastLoadedTime = Date.now(); // Update loaded time after write
    })
    .catch((err) => {
      console.error("[firestore-store] persist failed:", err instanceof Error ? err.message : err);
      throw err;
    });

  return after;
}

export function saveDatabase(data: StoreDatabase): StoreDatabase {
  cache = data;
  writeChain = writeChain
    .then(async () => {
      if (initPromise) await initPromise;
      await persistFullDatabase(data);
      lastLoadedTime = Date.now(); // Update loaded time after write
    })
    .catch((err) => {
      console.error("[firestore-store] save failed:", err);
    });
  return data;
}

export async function resetDatabase(): Promise<StoreDatabase> {
  const seed = createSeedDatabase();
  cache = seed;
  await persistFullDatabase(seed);
  lastLoadedTime = Date.now(); // Update loaded time after write
  return seed;
}

export async function flushFirestoreWrites(): Promise<void> {
  await writeChain;
}
