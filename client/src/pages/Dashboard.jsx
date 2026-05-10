import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { FiUsers, FiUserPlus, FiUserCheck, FiDollarSign } from 'react-icons/fi';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Import AuthContext at the top

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (!user) throw new Error('Not logged in'); // Skip fetching real data if not logged in
        const res = await api.get('/analytics');
        setAnalytics(res.data);
      } catch (error) {
        // Fallback to mock data if unauthorized/not logged in
        setAnalytics({
          cards: { totalCustomers: 124, newCustomers: 32, contactedCustomers: 45, convertedCustomers: 28 },
          statusDistribution: [
            { _id: 'New', count: 32 },
            { _id: 'Contacted', count: 45 },
            { _id: 'Qualified', count: 19 },
            { _id: 'Converted', count: 28 }
          ],
          monthlyGrowth: [
            { _id: '2023-08', count: 12 },
            { _id: '2023-09', count: 19 },
            { _id: '2023-10', count: 25 },
            { _id: '2023-11', count: 32 },
            { _id: '2023-12', count: 45 },
            { _id: '2024-01', count: 58 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  const { cards, statusDistribution, monthlyGrowth } = analytics || {};

  const statsCards = [
    { title: 'Total Customers', value: cards?.totalCustomers || 0, icon: <FiUsers />, color: 'bg-blue-500' },
    { title: 'New Customers', value: cards?.newCustomers || 0, icon: <FiUserPlus />, color: 'bg-emerald-500' },
    { title: 'Contacted', value: cards?.contactedCustomers || 0, icon: <FiUserCheck />, color: 'bg-yellow-500' },
    { title: 'Converted', value: cards?.convertedCustomers || 0, icon: <FiDollarSign />, color: 'bg-purple-500' },
  ];

  // Chart Data Preparation
  const doughnutData = {
    labels: statusDistribution?.map((s) => s._id) || [],
    datasets: [
      {
        data: statusDistribution?.map((s) => s.count) || [],
        backgroundColor: ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: monthlyGrowth?.map((m) => m._id) || [],
    datasets: [
      {
        label: 'Customers Generated',
        data: monthlyGrowth?.map((m) => m.count) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-gray-500">Welcome back! Here's what's happening with your customers.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center rounded-2xl bg-white p-4 md:p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`mr-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl text-xl md:text-2xl text-white ${stat.color} shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 rounded-2xl bg-white p-4 md:p-6 shadow-sm lg:col-span-2"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Customer Growth</h3>
          <div className="h-[250px] md:h-[300px] w-full">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 rounded-2xl bg-white p-4 md:p-6 shadow-sm"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Status Distribution</h3>
          <div className="flex h-[250px] md:h-[300px] items-center justify-center">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '70%' }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
