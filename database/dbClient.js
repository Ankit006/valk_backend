import * as schema from "./schema.js"
import dotenv from 'dotenv';
import postgres from "postgres";
import { drizzle } from 'drizzle-orm/postgres-js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "..", ".env");

dotenv.config({ path: envPath });



const client = postgres(process.env.POSTGRES_CONNECTION_STRING, { max: 1 });

const db = drizzle(client, { schema });

export default db;