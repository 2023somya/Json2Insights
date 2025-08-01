import React from 'react';
import QuarterlyDashboard from './QuarterlyDashboard';
import AILandingPage from './AILandingPage'; // Add this import


const DashboardRouter = ({ view }) => {
  switch (view) {
    case 'Quarterly': return <QuarterlyDashboard />;
    case 'Ask-AI': return <AILandingPage />; // Add this case
    default: return <p>Select a dashboard view.</p>;
  }
};

export default DashboardRouter;