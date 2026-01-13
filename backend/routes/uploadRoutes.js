import express from "express";
import multer from "multer";
import { uploadCSV } from "../controllers/uploadController.js";
import { ingestExternalData } from "../controllers/externalController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/external-ingest", ingestExternalData);

router.post("/", upload.single("file"), uploadCSV);

export default router;
