import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CompletionChart = ({ metrics }) => {
  const data = [
    { name: "Completed", value: metrics.completedTasks },
    { name: "Pending", value: metrics.totalTasks - metrics.completedTasks }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-5 rounded-xl shadow h-[350px]"
    >
      <h2 className="font-semibold text-slate-700 mb-3">✅ Task Completion</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={100}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CompletionChart;
