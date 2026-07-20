import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function loadServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) return JSON.parse(json);

  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!filePath) {
    throw new Error("Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env");
  }

  const resolved = path.isAbsolute(filePath) ? filePath : path.join(root, filePath);
  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

function loadSourceDatabase() {
  const dbPath = path.join(root, "data", "store-db.json");
  if (fs.existsSync(dbPath)) {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  }

  throw new Error("No data/store-db.json found. Run the store locally once or create the file first.");
}

async function runBatches(firestore, ops) {
  for (let i = 0; i < ops.length; i += 450) {
    const batch = firestore.batch();
    ops.slice(i, i + 450).forEach((op) => op(batch));
    await batch.commit();
  }
}

async function uploadCollection(firestore, name, items, getId) {
  const ops = items.map((item) => (batch) => {
    batch.set(firestore.collection(name).doc(getId(item)), item);
  });
  await runBatches(firestore, ops);
  console.log(`  ${name}: ${items.length}`);
}

async function main() {
  loadEnvFile();

  const serviceAccount = loadServiceAccount();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || serviceAccount.project_id;

  initializeApp({
    credential: cert(serviceAccount),
    projectId,
  });

  const firestore = getFirestore();
  const data = loadSourceDatabase();

  console.log("Uploading store data to Firestore...");

  await uploadCollection(firestore, "products", data.products ?? [], (p) => p.id);
  await uploadCollection(firestore, "categories", data.categories ?? [], (c) => c.id);
  await uploadCollection(firestore, "orders", data.orders ?? [], (o) => o.id);
  await uploadCollection(firestore, "coupons", data.coupons ?? [], (c) => c.code.toUpperCase());
  await uploadCollection(firestore, "users", data.users ?? [], (u) => u.id);
  await uploadCollection(firestore, "contactMessages", data.contactMessages ?? [], (m) => m.id);
  await uploadCollection(
    firestore,
    "passwordResetTokens",
    data.passwordResetTokens ?? [],
    (t) => t.token
  );
  await uploadCollection(firestore, "faqs", data.faqs ?? [], (f) => f.id);
  await uploadCollection(firestore, "testimonials", data.testimonials ?? [], (t) => t.id);
  await uploadCollection(firestore, "teamMembers", data.teamMembers ?? [], (m) => m.id);

  if (data.settings) {
    await firestore.collection("settings").doc("store").set(data.settings);
    console.log("  settings: 1");
  }

  if (data.brandStats) {
    await firestore.collection("meta").doc("brandStats").set({ items: data.brandStats });
    console.log("  brandStats: 1");
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
