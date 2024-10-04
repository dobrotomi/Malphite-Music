import { Logger } from "../utils/logger";
// src/db.ts
import { MongoClient, Db } from "mongodb";
import { config } from "../config"

const client = new MongoClient(config.MONGO_DB);
client.connect()

export const db: Db = client.db("Malphite");



Logger.log("Connected to MongoDB database", "db")