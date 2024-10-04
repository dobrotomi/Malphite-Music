import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { Logger } from "../utils/logger";
import  { config } from "../config";

const app = initializeApp(config.FIREBASE_CONFIG);
export const db = getFirestore(app)
Logger.log("Connected to Firebase database", "db")