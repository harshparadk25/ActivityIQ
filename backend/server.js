import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import uploadRoutes from "./routes/uploadRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173"
  ],
}));

app.use(express.json({ limit: "10mb" }));


app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "ActivityIQ Backend Running" });
});

app.use("/api/uploads", uploadRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/analytics", analyticsRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


