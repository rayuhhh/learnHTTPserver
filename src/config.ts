
process.loadEnvFile() // load environment variables from .env file

type APIConfig = {
    fileserverHits: number;
    dbURL: string
};

function envOrThrow(key:string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Enironment variable ${key} is not set`);
    }
    return value;
}

export const config: APIConfig = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL"),
};

