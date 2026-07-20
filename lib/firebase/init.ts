import {
  initializeApp,
  getApps,
  FirebaseApp,
} from "firebase/app";
import {
  getAuth,
  Auth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { logger } from "@/lib/logger";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function validateFirebaseConfig(): boolean {
  const required = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missing = required.filter(
    (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
  );

  if (missing.length > 0) {
    logger.error(
      "firebase",
      "Firebase config incomplete",
      new Error(`Missing: ${missing.join(", ")}`)
    );
    return false;
  }

  return true;
}

export function initializeFirebase(): FirebaseApp {
  try {
    if (!validateFirebaseConfig()) {
      throw new Error("Firebase configuration is incomplete");
    }

    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      logger.info("firebase", "Firebase initialized successfully");
    } else {
      app = getApps()[0];
    }

    return app;
  } catch (error) {
    logger.error("firebase", "Failed to initialize Firebase", error as Error);
    throw error;
  }
}

export function getFirebaseAuth(): Auth {
  try {
    if (!app) {
      app = initializeFirebase();
    }

    if (!auth) {
      auth = getAuth(app);
      // Set persistence for client-side
      if (typeof window !== "undefined") {
        setPersistence(auth, browserLocalPersistence).catch((error) => {
          logger.warn("firebase", "Failed to set auth persistence", {
            error: error.message,
          });
        });
      }
    }

    return auth;
  } catch (error) {
    logger.error("firebase", "Failed to get Firebase Auth", error as Error);
    throw error;
  }
}

export function getFirebaseDB(): Firestore {
  try {
    if (!app) {
      app = initializeFirebase();
    }

    if (!db) {
      db = getFirestore(app);
      logger.info("firebase", "Firestore initialized successfully");
    }

    return db;
  } catch (error) {
    logger.error("firebase", "Failed to get Firestore", error as Error);
    throw error;
  }
}

export function getFirebaseStorage(): FirebaseStorage {
  try {
    if (!app) {
      app = initializeFirebase();
    }

    if (!storage) {
      storage = getStorage(app);
      logger.info("firebase", "Firebase Storage initialized successfully");
    }

    return storage;
  } catch (error) {
    logger.error("firebase", "Failed to get Firebase Storage", error as Error);
    throw error;
  }
}

export function isFirebaseConfigured(): boolean {
  return validateFirebaseConfig();
}
