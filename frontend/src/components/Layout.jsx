import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentRoute, setCurrentRoute] = useState(null);

    const handleRouteSelect = (startId, endId) => {
        setCurrentRoute({ startId, endId });
        // optionally close sidebar on mobile after selecting
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
            {/* Sidebar Navigation */}
            <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onRouteSelect={handleRouteSelect}
            />

            {/* Main Content Area (Map) */}
            <main className="flex-1 relative">
                <Outlet context={{ currentRoute }} />
            </main>
        </div>
    );
}

export default Layout;
