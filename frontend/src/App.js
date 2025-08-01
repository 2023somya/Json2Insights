import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout'; // New layout component
import QuarterlyDashboard from './components/QuarterlyDashboard';
import AILandingPage from './components/AILandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<DashboardLayout />}> {/* Wrapper for all dashboard pages */}
          <Route path="/dashboard" element={<QuarterlyDashboard />} />
          <Route path="/dashboard/ask-ai" element={<AILandingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;