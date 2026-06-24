import fs from "fs/promises";
import path from "path";

const DB_PATH = "data/store-db.json";
const BACKUP_DIR = "data/backups";
const MAX_BACKUPS = 10;

export async function backupDatabase() {
  try {
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    // Read current database
    const dbContent = await fs.readFile(DB_PATH, "utf-8");

    // Create backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.json`);

    await fs.writeFile(backupPath, dbContent, "utf-8");

    // Clean old backups (keep only last MAX_BACKUPS)
    const backups = await fs.readdir(BACKUP_DIR);
    const sorted = backups
      .filter((f) => f.startsWith("backup-"))
      .sort()
      .reverse();

    for (let i = MAX_BACKUPS; i < sorted.length; i++) {
      await fs.unlink(path.join(BACKUP_DIR, sorted[i]));
    }

    console.log(`[DB] Backup created: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error("[DB] Backup failed:", error);
    throw error;
  }
}

export async function validateDatabaseIntegrity(content: string) {
  try {
    const parsed = JSON.parse(content);

    // Validate structure
    if (!Array.isArray(parsed.products)) {
      throw new Error("Invalid products structure");
    }
    if (!Array.isArray(parsed.categories)) {
      throw new Error("Invalid categories structure");
    }
    if (!Array.isArray(parsed.orders)) {
      throw new Error("Invalid orders structure");
    }

    // Validate data types
    for (const product of parsed.products) {
      if (!product.id || !product.name || typeof product.price !== "number") {
        throw new Error("Invalid product data");
      }
    }

    return true;
  } catch (error) {
    console.error("[DB] Integrity check failed:", error);
    throw error;
  }
}

export async function recoverFromBackup(backupPath?: string) {
  try {
    let backupToRecover = backupPath;

    if (!backupToRecover) {
      // Find latest backup
      const backups = await fs.readdir(BACKUP_DIR);
      const latest = backups
        .filter((f) => f.startsWith("backup-"))
        .sort()
        .reverse()[0];

      if (!latest) {
        throw new Error("No backup available");
      }

      backupToRecover = path.join(BACKUP_DIR, latest);
    }

    // Read and validate backup
    const backupContent = await fs.readFile(backupToRecover, "utf-8");
    await validateDatabaseIntegrity(backupContent);

    // Create backup of current state before recovery
    await backupDatabase();

    // Restore from backup
    await fs.writeFile(DB_PATH, backupContent, "utf-8");

    console.log(`[DB] Recovered from backup: ${backupToRecover}`);
    return backupToRecover;
  } catch (error) {
    console.error("[DB] Recovery failed:", error);
    throw error;
  }
}

export async function ensureDatabaseIntegrity() {
  try {
    const content = await fs.readFile(DB_PATH, "utf-8");
    await validateDatabaseIntegrity(content);
    return true;
  } catch (error) {
    console.error("[DB] Corrupted database detected, attempting recovery...", error);
    try {
      await recoverFromBackup();
      return true;
    } catch (recoveryError) {
      console.error("[DB] Recovery failed:", recoveryError);
      return false;
    }
  }
}
