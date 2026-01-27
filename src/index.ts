
import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidate } from "./api/validate.js"

import { middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));


app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", handlerMetrics);
// app.get("/admin/reset", handlerReset);

app.post("/admin/reset", handlerReset);

app.post("/api/validate_chirp", handlerValidate)

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

