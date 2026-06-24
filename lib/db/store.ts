import type { StoreDatabase } from "./types";
import { isFirestoreEnabled } from "./firestore-config";
import * as fileStore from "./file-store";
import * as firestoreStore from "./firestore-store";

export { isFirestoreEnabled } from "./firestore-config";

export async function initializeStore(): Promise<void> {
  if (isFirestoreEnabled()) {
    await firestoreStore.initializeFirestoreStore();
    console.log("[paktech] Firestore store active");
    return;
  }

  if (process.env.FIRESTORE_ENABLED === "true") {
    console.warn(
      "[paktech] FIRESTORE_ENABLED=true but service account file missing — using data/store-db.json"
    );
  }
}

/** Ensure Firestore has finished its first remote sync (safe to call multiple times). */
export async function ensureStoreReady(): Promise<void> {
  if (isFirestoreEnabled()) {
    await firestoreStore.initializeFirestoreStore();
  }
}

export function getDatabase(): StoreDatabase {
  if (isFirestoreEnabled()) return firestoreStore.getDatabase();
  return fileStore.getDatabase();
}

export function updateDatabase(mutator: (db: StoreDatabase) => void): StoreDatabase {
  if (isFirestoreEnabled()) return firestoreStore.updateDatabase(mutator);
  return fileStore.updateDatabase(mutator);
}

/** Apply a DB mutation and wait for Firestore persistence when enabled. */
export async function commitDatabaseUpdate(
  mutator: (db: StoreDatabase) => void
): Promise<StoreDatabase> {
  const db = updateDatabase(mutator);
  await flushStoreWrites();
  return db;
}

export function saveDatabase(data: StoreDatabase): StoreDatabase {
  if (isFirestoreEnabled()) return firestoreStore.saveDatabase(data);
  fileStore.saveDatabase(data);
  return data;
}

export async function resetDatabase(): Promise<StoreDatabase> {
  if (isFirestoreEnabled()) return firestoreStore.resetDatabase();
  return fileStore.resetDatabase();
}

export async function flushStoreWrites(): Promise<void> {
  if (isFirestoreEnabled()) await firestoreStore.flushFirestoreWrites();
}
