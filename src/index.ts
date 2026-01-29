
import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidate } from "./api/validate.js"

import { errorMiddlware, middlewareLogResponses, middlewareMetricsInc } from "./api/middleware.js";
import { error } from "node:console";

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

//app.post("/admin/reset", handlerReset);
app.post("/admin/rest", catchAsync(handlerReset));
app.post("/api/validate_chirp", catchAsync(handlerValidate));


//error handler
app.use(errorMiddlware);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

