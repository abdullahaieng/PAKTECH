import fs from "fs";
import path from "path";
import { firebaseConfig, isFirebaseConfigured } from "@/lib/firebase/config";

export function hasFirebaseServiceAccount(): boolean {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) return true;

  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (!filePath) return false;

  const resolved = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  return fs.existsSync(resolved);
}

export function isFirestoreEnabled(): boolean {
  if (process.env.FIRESTORE_ENABLED === "false") return false;
  if (process.env.FIRESTORE_ENABLED === "true") {
    return hasFirebaseServiceAccount() && isFirebaseConfigured();
  }
  return hasFirebaseServiceAccount() && isFirebaseConfigured();
}

export function getFirestoreProjectId(): string {
  return firebaseConfig.projectId;
}
