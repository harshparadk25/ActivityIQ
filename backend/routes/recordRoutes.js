import express from "express";
import { updateNote, getAllRecords } from "../controllers/recordController.js";

const router = express.Router();

router.get("/:uploadId", getAllRecords);

router.put("/:id/note", updateNote);

export default router;
