import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Play,
  CheckCircle2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { UploadCSV } from "../api/upload";
import { analyzeExternalData } from "../api/external";
import TextType from "../components/TextType";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploadId, setUploadId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadId(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadId(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    try {
      setLoading(true);

      const res = await UploadCSV(file);

      const { uploadId, message } = res.data;
      console.log("Upload Response:", res.data);

      setUploadId(uploadId);

      toast.success(message || "File uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!uploadId) {
      toast.error("Please upload a file first");
      return;
    }

    navigate("/process", { state: { uploadId } });
  };


  const handleAnalyzeExternal = async () => {
    try {
      setLoading(true);

      const res = await analyzeExternalData();

      const { uploadId, message } = res.data;

      toast.success(message || "External data analyzed successfully");

      navigate("/process", { state: { uploadId } });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "External analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-5"
        >
          <TextType 
            text={["📊 ActivityIQ"]}
            typingSpeed={100}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            className="text-4xl md:text-5xl font-bold text-slate-900"
          />

          <p className="text-lg text-slate-600">
            Smart CSV Activity Analyzer for Teams & Interns
          </p>
          <p className="text-slate-500 max-w-md">
            Upload your activity CSV and instantly get insights, summaries,
            performance metrics and smart analytics. Built for productivity
            tracking and reporting.
          </p>

          <div className="flex gap-4 text-sm text-slate-500">
            <div>✅ Smart Merge</div>
            <div>📈 Auto Analytics</div>
            <div>⚡ Instant Reports</div>
          </div>

          <div className="mt-6 bg-white/80 border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-slate-800">📄 Expected CSV Format</h3>

            <p className="text-sm text-slate-600">
              Your CSV file must contain the following columns:
            </p>

            <div className="bg-slate-100 rounded-lg p-3 text-sm font-mono">
              date, task, timeSpent, status, user (optional)
            </div>

            <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
              <li><b>date</b>: YYYY-MM-DD</li>
              <li><b>task</b>: Task name</li>
              <li><b>timeSpent</b>: Number (hours)</li>
              <li><b>status</b>: completed / pending</li>
              <li><b>user</b>: Optional</li>
            </ul>

            <a
              href="task.csv"
              download
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ⬇ Download Sample CSV
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white shadow-xl border border-slate-200 rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">
                Upload Activity CSV
              </CardTitle>
              <CardDescription>
                Select your CSV file and analyze your data
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              {!file && (
                <motion.label
                  whileHover={{ scale: 1.03 }}
                  className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-slate-400 transition text-center"
                >
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="flex flex-col items-center gap-3 text-slate-600">
                    <UploadCloud className="w-10 h-10" />
                    <p>Click to select CSV file</p>
                    <p className="text-xs text-slate-400">
                      Only .csv files supported
                    </p>
                  </div>
                </motion.label>
              )}

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <FileText className="w-4 h-4" />
                    {file.name}
                  </div>

                  <div className="flex items-center gap-3">
                    {uploadId && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Uploaded
                      </div>
                    )}

                    <button
                      onClick={handleRemoveFile}
                      className="text-slate-400 hover:text-red-500 transition"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="w-full flex gap-4 mt-2 flex-wrap">
                <Button
                  onClick={handleUpload}
                  disabled={loading || !file}
                  className="flex-1"
                >
                  {loading ? "Uploading..." : "Upload"}
                </Button>

                <Button
                  onClick={handleAnalyze}
                  variant="secondary"
                  className="flex-1 flex items-center gap-2"
                  disabled={!uploadId}
                >
                  <Play className="w-4 h-4" />
                  Analyze
                </Button>

                
                <Button
                  onClick={handleAnalyzeExternal}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  disabled={loading}
                >
                  ⚡ Analyze External Data
                </Button>
              </div>

              <p className="text-xs text-center text-slate-400">
                Step 1: Upload CSV → Step 2: Click Analyze OR Analyze External Data
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default Upload;
