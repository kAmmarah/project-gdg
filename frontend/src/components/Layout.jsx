import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Clock, Heart, Menu, X, Sun, Moon } from 'lucide-react';
import AIChatWidget from './AIChatWidget';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
    };

    return (
        <div className="app-container">
            {/* Sidebar Navigation */}
            <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`} style={{ display: sidebarOpen ? 'flex' : 'none' }}>
                <div className="sidebar-header">
                    <Heart size={28} />
                    <span>MindFlow</span>
                </div>

                <nav className="nav-links">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/routines" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Clock size={20} />
                        <span>Routines</span>
                    </NavLink>
                    <NavLink to="/mindfulness" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Heart size={20} />
                        <span>Mindfulness</span>
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="topbar">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-icon">
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <button onClick={toggleDarkMode} className="btn-icon">
                        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </header>

                <Outlet />
            </main>

            {/* Persistent AI Chat Widget */}
            <AIChatWidget />
        </div>
    );
};

export default Layout;
