import "dotenv/config";

/** @type { import("drizzle-kit").Config } */
export default {
    schema: './database/schema.js',
    out: './database/migration',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.POSTGRES_CONNECTION_STRING,
    },
} 
