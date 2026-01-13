import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import LetterGlitch from "../components/LetterGlitch.jsx";
import API from "../api/axios.js";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const uploadId = location.state?.uploadId;

  useEffect(() => {
    if (!uploadId) {
      toast.error("No upload ID found. Redirecting to upload page.");
      navigate("/", { replace: true });
      return;
    }

    const analyzeUpload = async () => {
      try {
        const response = await API.get(`/analytics/${uploadId}`);

        const data = response.data;

        console.log("Analysis Data:", data);

        toast.success("Analysis completed successfully!");

        setTimeout(() => {
          navigate(`/dashboard/${uploadId}`, { replace: true });
        }
        , 1500);

      } catch (error) {
        console.error("Analysis Error:", error);
        toast.error("Analysis failed. Please try again.");
        navigate("/", { replace: true });
      }
    };

    
    analyzeUpload();
  }, [uploadId, navigate]);

  return (
    <>
      
      <div className="fixed inset-0 w-screen h-screen overflow-hidden">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette
          outerVignette={false}
          smooth
          className="w-full h-full"
        />
      </div>

      
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />

          <p className="text-lg font-medium">Analyzing your data...</p>
          <p className="text-sm text-gray-400 mt-1">
            Generating insights and metrics
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Processing;
