import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { FiAlertCircle, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';
import { dashboardData, getBusinessData } from '../data/mockData';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const router = useRouter();
  const [businessData, setBusinessData] = useState(null);
  
  useEffect(() => {
    // Check if business data exists in localStorage
    const data = getBusinessData();
    if (!data) {
      // Redirect to onboarding if no business data
      router.push('/');
      return;
    }
    setBusinessData(data);
  }, [router]);

  // Prepare chart data
  const chartData = {
    labels: dashboardData.sales.map(item => item.date),
    datasets: [
      {
        label: 'Sales',
        data: dashboardData.sales.map(item => item.amount),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 2,
      },
      {
        label: 'Expenses',
        data: dashboardData.expenses.map(item => item.amount),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.10)',
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 2,
        borderDash: [6, 4],
      },
      {
        label: 'Profit',
        data: dashboardData.profit.map(item => item.amount),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.18)',
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: 'start',
      },
    ],
  };

  // Compute scaling based on profit values
  const profitValues = dashboardData.profit.map(item => item.amount);
  const minProfit = Math.min(...profitValues);
  const maxProfit = Math.max(...profitValues);
  const padding = Math.round((maxProfit - minProfit) * 0.1) || 100;
  const suggestedMin = Math.max(0, minProfit - padding);
  const suggestedMax = maxProfit + padding;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, boxWidth: 8 },
      },
      title: {
        display: true,
        text: 'Financial Performance',
        font: { weight: '600' },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y || 0;
            const label = context.dataset.label || '';
            return `${label}: $${value.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: 'Amount (USD)' },
        beginAtZero: false,
        suggestedMin,
        suggestedMax,
        ticks: {
          callback: function(value) { return '$' + Number(value).toLocaleString(); },
        },
        grid: { color: 'rgba(203, 213, 225, 0.3)' },
      },
    },
    elements: {
      line: { borderJoinStyle: 'round' },
      point: { hoverBorderWidth: 2 },
    },
  };

  // Alert icon mapping
  const alertIcons = {
    success: <FiTrendingUp className="text-green-500" />,
    warning: <FiAlertCircle className="text-yellow-500" />,
    danger: <FiTrendingDown className="text-red-500" />,
    info: <FiDollarSign className="text-blue-500" />,
  };

  if (!businessData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Dashboard | PAL - AI Business Partner</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{businessData.businessName} Dashboard</h1>
            <p className="text-gray-600">{businessData.category} • ${businessData.dailyBudget} Daily Budget</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-sm font-medium text-gray-500">Last updated: Today at 9:30 AM</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-blue-50 to-white border-l-4 border-primary">
            <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
            <p className="text-2xl font-bold text-gray-800">${dashboardData.summary.totalSales.toLocaleString()}</p>
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
          
          <div className="card bg-gradient-to-br from-red-50 to-white border-l-4 border-red-500">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-gray-800">${dashboardData.summary.totalExpenses.toLocaleString()}</p>
            <span className="text-sm text-red-600">+5% from last month</span>
          </div>
          
          <div className="card bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
            <p className="text-2xl font-bold text-gray-800">${dashboardData.summary.totalProfit.toLocaleString()}</p>
            <span className="text-sm text-green-600">+18% from last month</span>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500">Profit Margin</h3>
            <p className="text-2xl font-bold text-gray-800">{dashboardData.summary.profitMargin}%</p>
            <span className="text-sm text-purple-600">+2.5% from last month</span>
          </div>
        </div>

        {/* Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Performance</h2>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Smart Alerts */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Smart Alerts</h2>
          <div className="space-y-4">
            {dashboardData.alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg flex items-start space-x-3 ${
                  alert.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                  alert.type === 'danger' ? 'bg-red-50 border-l-4 border-red-500' :
                  'bg-blue-50 border-l-4 border-blue-500'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {alertIcons[alert.type]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}