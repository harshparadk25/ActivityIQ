import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const ProductivityChart = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-5 rounded-xl shadow h-[350px]"
    >
      <h2 className="font-semibold text-slate-700 mb-3">⏱ Time Spent Per Day</h2>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />

          <Area
            type="monotone"
            dataKey="totalTime"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorTime)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProductivityChart;
