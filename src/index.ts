
import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerChirpsValidate, handlerGetAllChirps, handlerGetChirp, handlerDeleteChirp } from "./api/chirps.js"

import { errorMiddlware, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js"
import { handlerAddUser, handlerUpdateEmailPw, handlerUpgradeRed } from "./api/users.js";
import { handlerLogin, handlerRefresh, handlerRevoke } from "./api/auth.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const catchAsync = (fn: Function) => (req: any, res: any, next: any) => {
    return Promise.resolve(fn(req, res,next)).catch(next);
}
const app = express();
const PORT = 8080;


app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

//app.get("/api/healthz", handlerReadiness);
app.get("/api/healthz", catchAsync(handlerReadiness));
// app.get("/admin/metrics", handlerMetrics);
app.get("/admin/metrics", catchAsync(handlerMetrics));
// app.get("/admin/reset", handlerReset);
app.get("/api/chirps", catchAsync(handlerGetAllChirps));
app.get("/api/chirps/:chirpId", catchAsync(handlerGetChirp));

app.post("/admin/reset", catchAsync(handlerReset));
//app.post("/admin/rest", catchAsync(handlerReset)); 
// app.post("/api/validate_chirp", catchAsync(handlerValidate));
app.post("/api/users", catchAsync(handlerAddUser));
app.post("/api/chirps", catchAsync(handlerChirpsValidate));
app.post("/api/login", catchAsync(handlerLogin));
app.post("/api/refresh", catchAsync(handlerRefresh));
app.post("/api/revoke", catchAsync(handlerRevoke));
app.post("/api/polka/webhooks", catchAsync(handlerUpgradeRed));

app.put("/api/users", catchAsync(handlerUpdateEmailPw));

app.delete("/api/chirps/:chirpId", catchAsync(handlerDeleteChirp))


//error handler
app.use(errorMiddlware);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});

