import { motion } from "framer-motion";

const Card = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-5 rounded-xl shadow"
  >
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </motion.div>
);

const StatsCards = ({ metrics }) => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card title="Total Tasks" value={metrics.totalTasks} />
      <Card title="Completed Tasks" value={metrics.completedTasks} />
      <Card title="Productivity Score" value={`${Math.round(metrics.productivityScore * 100)}%`} />
      <Card title="Consistency Score" value={`${metrics.consistencyScore}/10`} />
    </div>
  );
};

export default StatsCards;
