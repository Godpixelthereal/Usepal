// PAL's AI assistant logic and personality system
const palLogic = {
  // Sample greetings with Nigerian personality
  greetings: [
    "Hey boss! How your business dey today?",
    "Good to see you again! Ready to make some money today?",
    "Welcome back! Your business don dey miss you o.",
    "Oga at the top! How we dey perform today?",
    "Hey! PAL don dey here to help you succeed."
  ],
  
  // Quick responses based on time of day
  timeBasedGreetings() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning boss! Ready to crush it today?";
    if (hour < 17) return "Afternoon! How business dey move?";
    return "Evening boss! Let's check how we performed today.";
  },
  
  // Business insights and encouragement
  insights: [
    "You dey try sha! Your sales don increase by 12% this week.",
    "Hmm, expenses dey climb small. Make we check where the money dey go?",
    "Your top product don sell well today. E be like say customers like am well-well!",
    "You get one new project wey fit bring good money. Make we plan am well.",
    "Your business dey grow steady. Small-small, we go reach the top!"
  ],
  
  // Process user message and generate contextual response
  processMessage(message) {
    const lowerMsg = message.toLowerCase();
    
    // Check for specific keywords and return appropriate responses
    if (lowerMsg.includes('sale') || lowerMsg.includes('revenue') || lowerMsg.includes('income')) {
      return this.getSalesResponse();
    }
    
    if (lowerMsg.includes('expense') || lowerMsg.includes('spending') || lowerMsg.includes('cost')) {
      return this.getExpenseResponse();
    }
    
    if (lowerMsg.includes('profit') || lowerMsg.includes('margin') || lowerMsg.includes('earning')) {
      return this.getProfitResponse();
    }
    
    if (lowerMsg.includes('project') || lowerMsg.includes('client') || lowerMsg.includes('work')) {
      return this.getProjectResponse();
    }
    
    if (lowerMsg.includes('tip') || lowerMsg.includes('advice') || lowerMsg.includes('help')) {
      return this.getBusinessTip();
    }
    
    // Default response if no keywords match
    return "I dey here to help your business grow. You fit ask me about your sales, expenses, profits, or projects. Or tell me what you need help with today.";
  },
  
  // Generate mock sales data and response
  getSalesResponse() {
    const amount = Math.floor(Math.random() * 50000) + 10000;
    const change = Math.floor(Math.random() * 15) + 1;
    const isPositive = Math.random() > 0.3; // 70% chance of positive change
    
    if (isPositive) {
      return `You don make ₦${amount.toLocaleString()} in sales today! That's ${change}% up from yesterday. You dey do well, boss! 🚀`;
    } else {
      return `Sales today na ₦${amount.toLocaleString()}, which is ${change}% down from yesterday. No worry, tomorrow go better! 💪🏾`;
    }
  },
  
  // Generate mock expense data and response
  getExpenseResponse() {
    const amount = Math.floor(Math.random() * 30000) + 5000;
    const category = ['marketing', 'inventory', 'staff', 'rent', 'utilities'][Math.floor(Math.random() * 5)];
    
    return `Your expenses today reach ₦${amount.toLocaleString()}. Your biggest spending na for ${category}. You want make I show you where you fit cut costs?`;
  },
  
  // Generate mock profit data and response
  getProfitResponse() {
    const amount = Math.floor(Math.random() * 20000) + 5000;
    const margin = Math.floor(Math.random() * 20) + 10;
    
    return `Boss! You don make ₦${amount.toLocaleString()} profit today with ${margin}% profit margin. E good, but I think we fit push am reach 25% if we adjust some things.`;
  },
  
  // Generate mock project data and response
  getProjectResponse() {
    const projects = [
      { name: "Website Redesign", client: "Fashion Palace", status: "In Progress", deadline: "Next week" },
      { name: "Inventory System", client: "Market Express", status: "Pending", deadline: "This month" },
      { name: "Social Media Campaign", client: "Juice Republic", status: "Completed", deadline: "Yesterday" }
    ];
    
    const activeProjects = projects.filter(p => p.status === "In Progress");
    
    return `You get ${projects.length} projects total. ${activeProjects.length} dey active right now. The most urgent one na "${activeProjects[0]?.name}" for ${activeProjects[0]?.client}, wey go end ${activeProjects[0]?.deadline}.`;
  },
  
  // Business tips with Nigerian flavor
  getBusinessTip() {
    const tips = [
      "Try to reduce your expenses small-small. Even 5% reduction go add plenty money to your profit.",
      "Your best customers deserve special treatment. Give them small discount or bonus to keep them loyal.",
      "No forget to follow up with clients wey never pay. Cash flow na king for business o!",
      "Make you try new marketing strategy. Social media fit bring you new customers without spending plenty money.",
      "Your time get value. Focus on the work wey go bring more money, delegate the rest if possible."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  },
  
  // Suggested quick actions based on context
  getSuggestedActions(context) {
    if (context === 'sales') {
      return [
        "Add New Sale",
        "View Sales Report",
        "Set Sales Goal"
      ];
    }
    
    if (context === 'expense') {
      return [
        "Add Expense",
        "Expense Breakdown",
        "Cost-Cutting Tips"
      ];
    }
    
    if (context === 'project') {
      return [
        "Add New Project",
        "View All Projects",
        "Project Timeline"
      ];
    }
    
    // Default actions
    return [
      "Add Sale",
      "Add Expense",
      "New Project",
      "Business Tips"
    ];
  }
};

export default palLogic;