import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { configureDns } from "./config/dns.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
configureDns();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/", (req, res) => {
  res.json({
    name: "Job Application Tracker API",
    status: "running",
    docs: {
      auth: "/api/auth",
      applications: "/api/applications"
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
