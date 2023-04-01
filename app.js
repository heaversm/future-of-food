import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const app = express();

import indexRouter from "./routes/index.js";
import apiRouter from "./routes/api.js";

const publicDir = path.join(process.cwd(), "public");

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(publicDir));

app.use("/", indexRouter);
app.use("/api", apiRouter);

// Server Setup
console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
