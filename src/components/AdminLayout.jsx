import React, { useState } from 'react';
import { AdminDashboardNavbar } from './AdminDashboardNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <AdminDashboardNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className={`flex-1 overflow-y-auto p-4 md:p-4 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;