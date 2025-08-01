import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Outlet /> {/* This renders the current dashboard page */}
      </div>
    </div>
  );
};

export default DashboardLayout;