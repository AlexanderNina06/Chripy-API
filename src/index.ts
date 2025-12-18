import express, { NextFunction } from "express";
import { errorHandler, middlewareLogResponses, middlewareMetricsInc } from "./middlewares/middlewaresRegistry.js";
import { config } from "./config.js"
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { createChirpHandler, deleteChirpHandler, getAllChirpsHandler, getChirpByIdHandler } from "./handlers/chirpHandlers.js";
import { createUserHandler, resetUsersHandler, updateUserHandler } from "./handlers/userHandlers.js"
import { loginHandler, refreshTokenHandler, revokeTokenHandler } from "./handlers/authHandlers.js"
import { polkaWebhookHandler } from "./handlers/webHooksHandlers.js";

const migrationClient = postgres(config.db.url, { max: 1 });

await migrate(
  drizzle(migrationClient),
  config.db.migrationConfig
);

await migrationClient.end();

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses)
app.use(express.json())
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// GET
app.get("/api/chirps", getAllChirpsHandler)
app.get("/api/chirps/:chirpID", getChirpByIdHandler)
// POST
app.post("/admin/reset", resetUsersHandler)
app.post("/api/login", loginHandler)
app.post("/api/chirps", createChirpHandler)
app.post("/api/users", createUserHandler)
app.post("/api/refresh", refreshTokenHandler)
app.post("/api/revoke", revokeTokenHandler)
app.post("/api/polka/webhooks", polkaWebhookHandler)
// PUT
app.put("/api/users", updateUserHandler)
// DELETE
app.delete("/api/chirps/:chirpID", deleteChirpHandler)

// Error Handling Middleware
app.use(errorHandler)


