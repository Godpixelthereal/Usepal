// Mock data for the PAL - AI Business Partner application

// Dashboard data
export const dashboardData = {
  sales: [
    { date: '2023-01', amount: 12500 },
    { date: '2023-02', amount: 14200 },
    { date: '2023-03', amount: 15800 },
    { date: '2023-04', amount: 16900 },
    { date: '2023-05', amount: 18200 },
    { date: '2023-06', amount: 17500 },
  ],
  expenses: [
    { date: '2023-01', amount: 8200 },
    { date: '2023-02', amount: 8500 },
    { date: '2023-03', amount: 9100 },
    { date: '2023-04', amount: 9300 },
    { date: '2023-05', amount: 9800 },
    { date: '2023-06', amount: 9500 },
  ],
  profit: [
    { date: '2023-01', amount: 4300 },
    { date: '2023-02', amount: 5700 },
    { date: '2023-03', amount: 6700 },
    { date: '2023-04', amount: 7600 },
    { date: '2023-05', amount: 8400 },
    { date: '2023-06', amount: 8000 },
  ],
  alerts: [
    {
      id: 1,
      type: 'success',
      message: 'Sales increased by 15% compared to last month',
      date: '2023-06-15',
    },
    {
      id: 2,
      type: 'warning',
      message: 'Marketing expenses are 10% over budget',
      date: '2023-06-14',
    },
    {
      id: 3,
      type: 'info',
      message: 'New project opportunity detected in your industry',
      date: '2023-06-12',
    },
    {
      id: 4,
      type: 'danger',
      message: 'Customer acquisition cost increased by 20%',
      date: '2023-06-10',
    },
  ],
  summary: {
    totalSales: 95100,
    totalExpenses: 54400,
    totalProfit: 40700,
    profitMargin: 42.8,
  }
};

// Projects data
export const projectsData = [
  {
    id: 1,
    name: 'Website Redesign',
    client: 'ABC Corporation',
    budget: 15000,
    spent: 8500,
    deadline: '2023-08-15',
    status: 'In Progress',
    progress: 65,
  },
  {
    id: 2,
    name: 'Mobile App Development',
    client: 'XYZ Startups',
    budget: 25000,
    spent: 10000,
    deadline: '2023-09-30',
    status: 'In Progress',
    progress: 40,
  },
  {
    id: 3,
    name: 'Marketing Campaign',
    client: 'Global Retail',
    budget: 8000,
    spent: 8000,
    deadline: '2023-06-01',
    status: 'Completed',
    progress: 100,
  },
  {
    id: 4,
    name: 'SEO Optimization',
    client: 'Local Business',
    budget: 5000,
    spent: 1200,
    deadline: '2023-07-15',
    status: 'In Progress',
    progress: 25,
  },
  {
    id: 5,
    name: 'Content Creation',
    client: 'Media Group',
    budget: 12000,
    spent: 3600,
    deadline: '2023-10-01',
    status: 'In Progress',
    progress: 30,
  },
];

// Chat messages
export const chatMessages = [
  {
    id: 1,
    sender: 'system',
    content: 'Hello! I am PAL, your AI Business Partner. How can I help you today?',
    timestamp: '2023-06-15T09:00:00',
  },
  {
    id: 2,
    sender: 'user',
    content: 'Can you analyze my recent sales performance?',
    timestamp: '2023-06-15T09:01:30',
  },
  {
    id: 3,
    sender: 'system',
    content: 'Based on your recent data, your sales have increased by 15% compared to last month. Your best-performing product category is Technology Services, which accounts for 45% of your total revenue.',
    timestamp: '2023-06-15T09:01:45',
  },
  {
    id: 4,
    sender: 'user',
    content: 'What can I do to improve my profit margin?',
    timestamp: '2023-06-15T09:03:20',
  },
  {
    id: 5,
    sender: 'system',
    content: 'To improve your profit margin, I recommend: 1) Reviewing your pricing strategy for low-margin products, 2) Optimizing your marketing spend by focusing on channels with the highest ROI, and 3) Negotiating better terms with your suppliers. Would you like me to create a detailed action plan for any of these areas?',
    timestamp: '2023-06-15T09:03:45',
  },
];

// Helper function to get business data from localStorage (if available)
export const getBusinessData = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('businessData');
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Helper function to save business data to localStorage
export const saveBusinessData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('businessData', JSON.stringify(data));
  }
};