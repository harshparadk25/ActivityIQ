import crypto from "crypto";
import Record from "../model/Record.js";

export const ingestRows = async ({
  rows,
  uploadId,
  fileHash = "external",
  sourceFile = "external-api"
}) => {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  const normalizeRow = (row) => {
    const obj = {};
    Object.keys(row)
      .sort()
      .forEach((k) => {
        obj[k] = String(row[k]).trim();
      });
    return JSON.stringify(obj);
  };

  for (let row of rows) {
    const cleanedData = {};
    let hasValidData = false;

    for (let [key, value] of Object.entries(row)) {
      if (value !== null && value !== undefined && value !== "") {
        cleanedData[key] = value;
        hasValidData = true;
      }
    }

    if (!hasValidData) {
      skipped++;
      continue;
    }

    
    const rowHash = crypto
      .createHash("sha1")
      .update(normalizeRow(cleanedData))
      .digest("hex");

    for (let key of Object.keys(cleanedData)) {
      const k = key.toLowerCase();
      if (
        k.includes("time") ||
        k.includes("spent") ||
        k.includes("hours") ||
        k.includes("amount")
      ) {
        const num = Number(cleanedData[key]);
        if (!isNaN(num)) cleanedData[key] = num;
      }
    }

   
    for (let key of Object.keys(cleanedData)) {
      if (key.toLowerCase().includes("date")) {
        const d = new Date(cleanedData[key]);
        if (!isNaN(d.getTime())) cleanedData[key] = d;
      }
    }

    
    const existing = await Record.findOne({ uploadId, rowHash });

    if (existing) {
      existing.data = cleanedData;
      existing.sourceFile = sourceFile;
      await existing.save();
      updated++;
    } else {
      await Record.create({
        data: cleanedData,
        rowHash,
        uploadId,
        fileHash,
        sourceFile
      });
      inserted++;
    }
  }

  return {
    inserted,
    updated,
    skipped,
    totalRows: rows.length,
    columns
  };
};
