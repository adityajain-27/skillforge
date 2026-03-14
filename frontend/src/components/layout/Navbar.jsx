import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full h-[64px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>public</span>
        <Link to="/" className="text-[16px] font-semibold text-slate-900 dark:text-white">PyClimaExplorer</Link>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/public" className="text-[14px] font-medium text-slate-500 hover:text-primary transition-colors">Features</Link>
        <Link to="/dashboard/stories" className="text-[14px] font-medium text-slate-500 hover:text-primary transition-colors">Story Mode</Link>
        <Link to="/dashboard" className="text-[14px] font-medium text-slate-500 hover:text-primary transition-colors">Researchers</Link>
        <Link to="/components" className="text-[14px] font-medium text-slate-500 hover:text-primary transition-colors">Components Kit</Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">
              Hi, <span className="font-semibold">{user.name?.split(' ')[0]}</span>
            </span>
            <Link to="/dashboard" className="bg-primary text-white text-[14px] font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              id="navbar-logout"
              className="text-[14px] font-semibold text-slate-600 dark:text-slate-300 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" id="navbar-signin" className="text-[14px] font-semibold text-slate-600 dark:text-slate-300 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              Sign In
            </Link>
            <Link to="/login" id="navbar-getstarted" className="bg-primary text-white text-[14px] font-bold px-5 py-2 rounded-lg hover:bg-blue-600 transition-all inline-block">
              Get Started Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
