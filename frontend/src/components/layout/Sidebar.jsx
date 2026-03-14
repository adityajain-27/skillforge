import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isPro, isResearcher } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get initials from name
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const navItem = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
      isActive ? 'bg-primary/20 text-white' : 'hover:bg-slate-800'
    }`;

  return (
    <aside className="w-[240px] bg-[#0F172A] flex-shrink-0 flex flex-col text-slate-300 h-full overflow-y-auto">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary rounded-lg p-1 flex items-center justify-center">
          <span className="material-symbols-outlined text-white">public</span>
        </div>
        <Link to="/" className="text-white text-lg font-bold font-display tracking-tight">
          PyClimaExplorer
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        <p className="px-2 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</p>

        <NavLink to="/dashboard" end className={navItem} id="nav-dashboard">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </NavLink>

        {/* Only researchers can upload */}
        {isResearcher && (
          <NavLink to="/dashboard/upload" className={navItem} id="nav-upload">
            <span className="material-symbols-outlined">cloud_upload</span>
            <span>Upload Dataset</span>
          </NavLink>
        )}

        {/* Pro-only: Compare */}
        <NavLink to="/dashboard/compare" className={navItem} id="nav-compare">
          <span className="material-symbols-outlined">compare_arrows</span>
          <span>Compare</span>
          {!isPro && (
            <span className="ml-auto material-symbols-outlined text-slate-600 text-sm">lock</span>
          )}
        </NavLink>

        <NavLink to="/dashboard/globe" className={navItem} id="nav-globe">
          <span className="material-symbols-outlined">language</span>
          <span>3D Globe</span>
        </NavLink>

        {/* Pro-only: Predictions */}
        <NavLink to="/dashboard/predictions" className={navItem} id="nav-predictions">
          <span className="material-symbols-outlined">trending_up</span>
          <span>Predictions</span>
          {!isPro && (
            <span className="ml-auto material-symbols-outlined text-slate-600 text-sm">lock</span>
          )}
        </NavLink>

        <p className="px-2 pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tools</p>

        <NavLink to="/dashboard/stories" className={navItem} id="nav-stories">
          <span className="material-symbols-outlined">auto_stories</span>
          <span>Story Mode</span>
        </NavLink>

        <NavLink to="/dashboard/news" className={navItem} id="nav-news">
          <span className="material-symbols-outlined">newspaper</span>
          <span>Climate News</span>
        </NavLink>

        <NavLink to="/dashboard/reports" className={navItem} id="nav-reports">
          <span className="material-symbols-outlined">description</span>
          <span>Reports</span>
        </NavLink>
      </nav>

      {/* Pro upgrade banner */}
      {!isPro && (
        <div className="mx-4 mb-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
          <p className="text-xs font-bold text-primary mb-1">Free Plan</p>
          <p className="text-[10px] text-slate-400 mb-2">
            {user?.datasetsAnalyzed ?? 0}/3 analyses used
          </p>
          <Link
            to="/public"
            className="block w-full text-center bg-primary text-white text-xs font-bold py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}

      {/* User info footer */}
      <div className="p-4 border-t border-slate-800 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/30 overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
        <div className="flex flex-col truncate flex-1">
          <span className="text-white text-sm font-medium truncate">{user?.name || 'Loading…'}</span>
          <span className="text-slate-500 text-xs capitalize">{user?.role} {isPro ? '· Pro' : '· Free'}</span>
        </div>
        <button
          onClick={handleLogout}
          id="sidebar-logout"
          title="Logout"
          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
