import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiBriefcase } from 'react-icons/fi';

export default function Overview() {
  const [businessData, setBusinessData] = useState({
    sales: { total: 0, trend: 0 },
    expenses: { total: 0, trend: 0 },
    profit: { total: 0, trend: 0 },
    clients: { total: 0, new: 0 },
    projects: { total: 0, active: 0 }
  });

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockData = {
      sales: { total: 125000, trend: 15 },
      expenses: { total: 45000, trend: -5 },
      profit: { total: 80000, trend: 22 },
      clients: { total: 24, new: 3 },
      projects: { total: 8, active: 5 }
    };
    
    setBusinessData(mockData);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Business Overview</h1>
      
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">Sales</h2>
            <p className="text-2xl font-bold">{formatCurrency(businessData.sales.total)}</p>
          </div>
          <div className={`flex items-center ${businessData.sales.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {businessData.sales.trend > 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
            <span>{Math.abs(businessData.sales.trend)}%</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">Expenses</h2>
            <p className="text-2xl font-bold">{formatCurrency(businessData.expenses.total)}</p>
          </div>
          <div className={`flex items-center ${businessData.expenses.trend < 0 ? 'text-green-500' : 'text-red-500'}`}>
            {businessData.expenses.trend < 0 ? <FiTrendingDown className="mr-1" /> : <FiTrendingUp className="mr-1" />}
            <span>{Math.abs(businessData.expenses.trend)}%</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">Profit</h2>
            <p className="text-2xl font-bold">{formatCurrency(businessData.profit.total)}</p>
          </div>
          <div className={`flex items-center ${businessData.profit.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {businessData.profit.trend > 0 ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
            <span>{Math.abs(businessData.profit.trend)}%</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-4">
        <div className="card flex-1">
          <div className="flex flex-col items-center">
            <FiUsers className="text-primary text-2xl mb-2" />
            <h2 className="card-title">Clients</h2>
            <p className="text-xl font-bold">{businessData.clients.total}</p>
            <p className="text-sm text-green-500">+{businessData.clients.new} new</p>
          </div>
        </div>
        
        <div className="card flex-1">
          <div className="flex flex-col items-center">
            <FiBriefcase className="text-primary text-2xl mb-2" />
            <h2 className="card-title">Projects</h2>
            <p className="text-xl font-bold">{businessData.projects.total}</p>
            <p className="text-sm text-primary">{businessData.projects.active} active</p>
          </div>
        </div>
      </div>
    </div>
  );
}