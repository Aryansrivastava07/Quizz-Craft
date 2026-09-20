import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  plugins,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { useMemo, useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useTheme } from "./ThemeContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  plugins,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

export const DoughnutChart = ({ result, length }) => {
  const { darkMode } = useTheme();
  
  const textColor = darkMode ? "#ffffff" : "#1f2937";

  const data = useMemo(() => ({
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "# of Votes",
        data: [result, length - result],
        backgroundColor: [
          "rgb(75, 192, 192)",
          "rgb(255, 99, 132)",
          "rgb(255, 205, 86)",
          "rgb(201, 203, 207)",
          "rgb(54, 162, 235)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(201, 203, 207, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        hoverBackgroundColor: [
          "rgb(200, 203, 229)",
          "rgb(200, 203, 229)",
          "rgb(200, 203, 229)",
          "rgb(200, 203, 229)",
          "rgb(200, 203, 229)",
        ],
        borderWidth: 0,
      },
    ],
  }), [result, length]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          font: {
            size: 12,
            weight: "bold",
          },
          padding: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    rotation: 180,
    cutout: '50%',
    elements: {
      arc: {
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    },
  }), [textColor]);

  const percentage = useMemo(() => `${Math.round((result / length) * 100)}%`, [result, length]);

  const centerTextPlugin = useMemo(() => ({
    id: "centerText",
    beforeDraw: (chart) => {
      if (!percentage) return;
      const {
        ctx,
        chartArea: { top, bottom, left, right, width, height },
      } = chart;
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;
      
      // Calculate responsive font size based on chart size
      const minDimension = Math.min(width, height);
      const fontSize = Math.max(16, Math.min(32, minDimension * 0.15));
      
      ctx.save();
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = textColor;
      ctx.fillText(percentage, centerX, centerY);
      ctx.restore();
    },
  }), [percentage, textColor]);

  return (
    <Doughnut 
      key={`doughnut-${darkMode}`}
      data={data} 
      options={options} 
      plugins={[centerTextPlugin]} 
    />
  );
};

export const BarChart = ({ quesTimer }) => {
  const data = {
    labels: Array.from({ length: quesTimer.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Answers",
        data: quesTimer,
        backgroundColor: [
          "rgb(78, 139, 250)",
          "rgb(92, 161, 255)",
          "rgb(200, 203, 229)",
          "rgb(78, 139, 250)",
        ],
        borderWidth: 0,
        barPercentage: 0.5, // Shrinks bar width relative to category
        categoryPercentage: 0.5,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#333",
          font: { size: 14 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          stepSize: 2,
          color: "#333",
          font: { size: 14 },
        },
      },
    },
  };

  return <Bar data={data} options={options} className="full-size-chart" />;
};

export const LineChart = ({ quesTimer }) => {
  const { darkMode } = useTheme();
  
  const textColor = darkMode ? "#ffffff" : "#1f2937";
  const gridColor = darkMode ? "#ffffff" : "#e5e7eb";

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    elements: {
      line: {
        tension: .3,
        borderColor: "#4e8bfa", // blue in both modes
        backgroundColor: "#4e8bfa", // blue in both modes
      },
      point: {
        backgroundColor: "#4e8bfa", // blue in both modes
        borderColor: "#4e8bfa", // blue in both modes
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: {
            weight: 'bold',
          },
        },
        grid: { 
          display: true,
          color: gridColor,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          font: {
            weight: 'bold',
          },
        },
        grid: { display: false },
      },
    },
  }), [textColor, gridColor]);

  const data = useMemo(() => ({
    labels: Array.from({ length: quesTimer.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "Answers",
        data: Array.from(
          { length: quesTimer.length },
          (_, i) =>  quesTimer[i++]
        ),
        borderColor: "#4e8bfa", // blue in both modes
        backgroundColor: "#4e8bfa", // blue in both modes
        pointBackgroundColor: "#4e8bfa", // blue in both modes
        pointBorderColor: "#4e8bfa", // blue in both modes
      },
    ],
  }), [quesTimer]);

  return <Line key={`line-${darkMode}`} options={options} data={data} />;
};
