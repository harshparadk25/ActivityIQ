import crypto from "crypto";
import { fetchExternalRecords } from "../services/external.js";
import { ingestRows } from "../services/ingest.js";

export const ingestExternalData = async (req, res) => {
  try {
    
    const rows = await fetchExternalRecords();

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: "No data received from external API" });
    }

    
    const uploadId = crypto.randomUUID();

    
    const result = await ingestRows({
      rows,
      uploadId,
      fileHash: "external-api",
      sourceFile: "external-api"
    });

    
    res.json({
      message: "External data analyzed successfully",
      uploadId,
      ...result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "External ingestion failed",
      error: err.message
    });
  }
};
