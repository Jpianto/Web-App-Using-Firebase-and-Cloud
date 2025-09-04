// Joshua Pianto 9/3/2025 backend/index.js
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";

function initAdmin() {
  try {
    const saPath = new URL("./serviceAccountKey.json", import.meta.url);
    const serviceAccount = JSON.parse(fs.readFileSync(saPath));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log("Firebase Admin initialized with service account (LOCAL).");
    return;
  } catch (_) {
    // no file locally—fall through to application default (for Cloud Run)
  }

  // On Cloud Run (and other GCP), metadata creds are available automatically
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log("Firebase Admin initialized with ADC (CLOUD).");
}

initAdmin();

const app = express();

// CORS: allow for local dev and Hosting domain
app.use(
  cors({
    origin: [
      "http://localhost:5173",        // Local dev
      "https://web-app-dd054.web.app" // Hosting domain
    ],
    credentials: true,
  })
);
app.use(express.json());

// Simple auth middleware
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/whoami", authMiddleware, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email || null,
    auth_time: req.user.auth_time,
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
