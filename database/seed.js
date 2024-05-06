import { category, brand } from "./schema.js"
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
const db = drizzle(client);


const categoryType = {
    category: "category",
    sub_category: "sub_category",
    child_category: "child_category",
}

const seedCategories = [
    {
        id: 1,
        name: "Top Category",
        parentId: null,
        type: categoryType.category
    },
    {
        id: 2,
        name: "Sub Category 1",
        parentId: 1,
        type: categoryType.sub_category
    },
    {
        id: 3,
        name: "Sub Category 2",
        parentId: 1,
        type: categoryType.sub_category
    },
    {
        id: 4,
        name: "Child Category 1",
        parentId: 2,
        type: categoryType.child_category
    },
    {
        id: 5,
        name: "Child Category 2",
        parentId: 2,
        type: categoryType.child_category
    },
    {
        id: 6,
        name: "Child Category 3",
        parentId: 3,
        type: categoryType.child_category
    },
];

const seedBrands = [
    {
        id: 1,
        name: "Brand 1",
        categoryId: 4,
    },
    {
        id: 2,
        name: "Brand 2",
        categoryId: 5,
    },
    {
        id: 3,
        name: "Brand 3",
        categoryId: 6,
    },
];


async function seed() {
    try {
        await db.insert(category).values(seedCategories);
        await db.insert(brand).values(seedBrands);
    } catch (err) {
        console.log(err)
    } finally {
        await client.end();
    }
}

seed()