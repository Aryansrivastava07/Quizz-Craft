import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];
// This regex will match Netlify deploy previews like `https://deploy-preview-123--quizz-craft.netlify.app`
const netlifyPreviewRegex =
  /^https:\/\/([a-z0-9-]+)--quizz-craft\.netlify\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || netlifyPreviewRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use("/avatars", express.static("public/avatars"));
app.use(cookieParser());

import quizCreation from "./routes/quiz.routes.js";
import user from "./routes/user.routes.js";
import attempt from "./routes/attempt.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use("/api/v1/user", user);
app.use("/api/v1/quiz", quizCreation);
app.use("/api/v1/attempt", attempt);

// Error handling middleware (must be last)
app.use(errorHandler);

export { app };
