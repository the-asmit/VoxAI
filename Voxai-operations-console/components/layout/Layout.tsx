
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] text-slate-900 font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
        <Header onToggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="w-full max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
