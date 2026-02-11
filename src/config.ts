import { DBQueryConfig } from "drizzle-orm";
import type { MigrationConfig } from "drizzle-orm/migrator";


type Config = {
    api: APIConfig;
    db: DBConfig;
    jwt: JWTConfig;
};

type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
};

type DBConfig = {
    url:string;
    migrationConfig: MigrationConfig;
}

type JWTConfig = {
    defaultDuration: number;
    secret: string;
    issuer: string;
}

process.loadEnvFile() // load environment variables from .env file

function envOrThrow(key:string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}


export const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

// type DBConfig = {
//     db: string;
//     migrateConfig: MigrationConfig; 
// };


export const config: Config = {
    api: {
        fileserverHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    jwt: {
        defaultDuration: 60 * 60, // seconds; default = 30;
        secret: envOrThrow("JWT_SECRET"),
        issuer: "chirpy",
    },
};