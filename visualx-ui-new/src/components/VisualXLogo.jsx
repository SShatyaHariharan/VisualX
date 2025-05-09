import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
} from "recharts";

const letters = "VisualX".split("");

function generateData() {
  return Array.from({ length: 5 }, () => ({
    value: Math.floor(Math.random() * 100) + 10,
  }));
}

function VisualXLogo() {
  const [chartData, setChartData] = useState(
    letters.map(() => generateData())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(letters.map(() => generateData()));
    }, 1500); // update every 1.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-6 mt-12">
      {letters.map((letter, index) => (
        <div key={index} className="flex flex-col items-center">
          <ResponsiveContainer width={50} height={60}>
            <BarChart data={chartData[index]}>
              <Bar dataKey="value" animationDuration={500}>
                {chartData[index].map((_, i) => (
                  <Cell key={i} fill="#22c55e" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-gray-900 dark:text-green-400 text-2xl font-bold mt-1">{letter}</div>
        </div>
      ))}
    </div>
  );
}

export default VisualXLogo;