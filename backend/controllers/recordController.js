import mongoose from "mongoose";
import Record from "../model/Record.js";

export const updateNote = async (req, res) => {
  try {
    const { note } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    if (typeof note !== "string") {
      return res.status(400).json({ message: "Note must be a string" });
    }

    const trimmedNote = note.trim();

    if (trimmedNote.length === 0) {
      return res.status(400).json({ message: "Note cannot be empty" });
    }

    if (trimmedNote.length > 500) {
      return res.status(400).json({ message: "Note is too long (max 500 chars)" });
    }

    const record = await Record.findByIdAndUpdate(
      id,
      { note: trimmedNote },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update note" });
  }
};


export const getAllRecords = async (req, res) => {
  try {
    const { uploadId } = req.params;


    if (!uploadId) {
      return res.status(400).json({ message: "uploadId is required" });
    }

    const records = await Record.find({ uploadId }).sort({ uploadedAt: -1 });

    const allColumns = new Set();
    records.forEach((r) => {
      Object.keys(r.data || {}).forEach((k) => allColumns.add(k));
    });

    res.json({
      records: records.map((r) => ({
        id: r._id,
        ...r.data,
        note: r.note,
        _metadata: {
          sourceFile: r.sourceFile,
          uploadedAt: r.uploadedAt,
        },
      })),
      columns: Array.from(allColumns),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch records" });
  }
};