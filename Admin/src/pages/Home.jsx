import OrdersAreaChart from "../components/Graph";
import { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useEffect } from "react";

const Home = ({ token }) => {
  
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });

  const fetchStats = async ({ token }) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/total`, { headers: { token }});
      setStats(response.data);
      console.log("Stats fetched:", response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }; 

  useEffect(() => {
    fetchStats({ token });
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Dashboard</h1>

      <p className="text-gray-600 mb-6">Here you can manage products, view orders, and analyze sales data.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
          <p className="text-2xl font-bold">₹{stats.totalSales.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Customers</h2>
          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Sales Overview</h2>
        {/* Graph component will go here */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <OrdersAreaChart token={token} />
        </div>
      </div>
    </div>
  );
};

export default Home;
