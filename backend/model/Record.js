import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    rowHash: {
      type: String,
      index: true
    },

    uploadId: {
      type: String,
      index: true,
      required: true
    },

    fileHash: {
      type: String,
      index: true,
      required: true
    },

    note: {
      type: String,
      default: ""
    },

    sourceFile: String,
    uploadedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    strict: false
  }
);


recordSchema.index({ uploadId: 1, rowHash: 1 }, { unique: true });

const Record = mongoose.model("Record", recordSchema);
export default Record;
