import Record from "../model/Record.js";

export const getAnalytics = async (req, res) => {
  try {
    const { uploadId } = req.params;


    if (!uploadId) {
      return res.status(400).json({ message: "uploadId is required" });
    }

    const records = await Record.find({ uploadId }).sort({ "data.date": 1 });

    if (!records || records.length === 0) {
      return res.json({
        metrics: {
          totalTasks: 0,
          completedTasks: 0,
          productivityScore: 0,
          consistencyScore: 0,
        },
        chartData: [],
        records: [],
      });
    }

    const totalTasks = records.length;

    const completedTasks = records.filter(
      (r) => String(r.data?.status || "").toLowerCase() === "completed"
    ).length;

    const productivityScore =
      totalTasks === 0 ? 0 : Number((completedTasks / totalTasks).toFixed(2));

    const uniqueDaysSet = new Set();
    const chartMap = {};

    for (let r of records) {
      let dateValue = null;
      let timeValue = 0;

      
      for (let key of Object.keys(r.data || {})) {
        if (key.toLowerCase().includes("date")) {
          const d = new Date(r.data[key]);
          if (!isNaN(d.getTime())) {
            dateValue = d;
            break;
          }
        }
      }

      
      for (let key of Object.keys(r.data || {})) {
        const k = key.toLowerCase();
        if (k.includes("time") || k.includes("spent") || k.includes("hours")) {
          const num = Number(r.data[key]);
          if (!isNaN(num)) {
            timeValue = num;
            break;
          }
        }
      }

      if (!dateValue) continue;

      const day = dateValue.toISOString().split("T")[0];
      uniqueDaysSet.add(day);

      chartMap[day] = (chartMap[day] || 0) + timeValue;
    }

    

    const chartData = Object.entries(chartMap)
      .map(([date, totalTime]) => ({ date, totalTime }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

      let consistencyScore = 0;

if (uniqueDaysSet.size > 0 && chartData.length > 0) {
  const firstDate = new Date(chartData[0].date);
  const lastDate = new Date(chartData[chartData.length - 1].date);

  const totalDaysInRange =
    Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;

  const activeDays = uniqueDaysSet.size;

  const consistencyRatio = activeDays / totalDaysInRange;

  consistencyScore = Math.min(10, Math.round(consistencyRatio * 10));
}

    res.json({
      metrics: {
        totalTasks,
        completedTasks,
        productivityScore,
        consistencyScore,
      },
      chartData,
      records,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
