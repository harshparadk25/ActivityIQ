import crypto from "crypto";
import Record from "../model/Record.js";
import { parseCSVBuffer } from "../utils/csvProcessor.js";
import { ingestRows } from "../services/ingest.js";

export const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    
    const fileHash = crypto
      .createHash("sha1")
      .update(req.file.buffer)
      .digest("hex");

   
    const existingFile = await Record.findOne({ fileHash });

    let uploadId;

    if (existingFile) {
      
      uploadId = existingFile.uploadId;
    } else {
      
      uploadId = crypto.randomUUID();
    }

    const rows = await parseCSVBuffer(req.file.buffer);

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: "CSV file is empty" });
    }

    
    const result = await ingestRows({
      rows,
      uploadId,
      fileHash,
      sourceFile: req.file.originalname
    });

    res.json({
      message: existingFile
        ? "CSV updated successfully (existing dataset)"
        : "CSV uploaded successfully (new dataset)",
      uploadId,
      ...result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "CSV processing failed",
      error: err.message
    });
  }
};
