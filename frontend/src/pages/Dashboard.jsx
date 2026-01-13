import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import StatsCards from "../components/dashboard/StatsCards";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import CompletionChart from "../components/dashboard/CompletionChart";
import RecordTable from "../components/dashboard/RecordTable";

const Dashboard = () => {
  const { uploadId } = useParams();
  const navigate = useNavigate();

  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uploadId) {
      navigate("/", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const res = await API.get(`/analytics/${uploadId}`);
        setAnalysisData(res.data);
      } catch (err) {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uploadId]);

  if (loading) return <div>Loading...</div>;
  if (!analysisData) return null;

  const { metrics, chartData, records } = analysisData;

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-6">
      <h1 onClick={() => navigate("/")} className="text-3xl font-bold text-slate-800">📊 ActivityIQ Dashboard</h1>

      <StatsCards metrics={metrics} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProductivityChart data={chartData} />
        </div>
        <CompletionChart metrics={metrics} />
      </div>

      <RecordTable records={records} />
    </div>
  );
};

export default Dashboard;
