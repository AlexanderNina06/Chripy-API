import { envOrThrow } from "./helpers/utils.js";
import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile()
const dbUrl = envOrThrow("DB_URL")
const platform = envOrThrow("PLATFORM")
const polka_key = envOrThrow("POLKA_KEY")

export const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export type APIConfig = {
  fileserverHits: number;
  db: {
    url: string,
    migrationConfig: MigrationConfig
  },
  platform: string,
  polka_key: string
};

export const config: APIConfig = {
  fileserverHits: 0,
  db: {
    url: dbUrl,
    migrationConfig: migrationConfig
  },
  platform: platform,
  polka_key: polka_key
};

