import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title);

const OrdersAreaChart = (token) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const fetchOrdersData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/order/monthly");
      console.log(response);

      setChartData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const data = {
    labels: chartData.map((item) => `Day ${item.day}`),

    datasets: [
      {
        label: "Orders",
        data: chartData.map((item) => item.orders),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Orders Per Day",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default OrdersAreaChart;
