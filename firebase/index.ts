import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import admin from "firebase-admin";
// const serviceAccount = require("../serviceAccountKey.json");
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseStorage = getStorage(firebaseApp);

admin.initializeApp({
  credential: admin.credential.cert(`${__dirname}/../../firebase/serviceAccountKey.json`),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
export const adminBucket = admin.storage().bucket();
