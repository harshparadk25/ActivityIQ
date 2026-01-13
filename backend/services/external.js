import axios from "axios";

const TASKS = [
  "Design UI",
  "Fix Login Bug",
  "Write API Docs",
  "Build Upload API",
  "Test CSV Parsing",
  "Create Dashboard UI",
  "Fix Chart Bug",
  "Refactor Backend",
  "Optimize Queries",
  "Write README",
  "Add Notes Feature",
  "Deploy Backend",
  "Deploy Frontend",
  "Final Testing",
  "Interview Prep",
];

export const fetchExternalRecords = async () => {
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");

  const startDate = new Date(2026, 0, 1); 
  const today = new Date();

  const totalDays =
    Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

  const records = data.slice(0, 50).map((item, index) => {
    const dayOffset = index % totalDays;
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayOffset);

    return {
      date,
      task: TASKS[index % TASKS.length],
      user: "Harsh",
      timeSpent: Math.floor(Math.random() * 4) + 1,
      status: item.completed ? "completed" : "pending",
    };
  });

  return records;
};
