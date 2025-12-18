import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/schema.ts",
  out: "src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://postgres:123456@localhost:5432/chirpy?sslmode=disable",
  },
});