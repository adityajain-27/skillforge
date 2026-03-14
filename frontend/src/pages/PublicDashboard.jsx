import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { upgradeToPro } from '../services/api';

const PublicDashboard = () => {
  const { user, saveAuth, token } = useAuth();
  const navigate = useNavigate();
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState('');

  const handleUpgrade = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      setUpgrading(true);
      const result = await upgradeToPro();
      // Re-sync user — update tier in context
      setUpgradeMsg(result.message || 'Upgraded to Pro!');
      // navigate to dashboard so sidebar refreshes with pro status
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setUpgradeMsg(err.message || 'Upgrade failed.');
    } finally {
      setUpgrading(false);
    }
  };

  const analysesUsed = user?.datasetsAnalyzed ?? 0;
  const analysesTotal = 3;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-display">
      {/* Top Banner */}
      {user?.tier === 'free' && (
        <div className="w-full bg-amber-100 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800 py-2 px-4 flex justify-center items-center gap-4 text-amber-800 dark:text-amber-200 text-sm font-medium">
          <span>Free Plan · {analysesUsed} of {analysesTotal} analyses used</span>
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="flex items-center gap-1 hover:underline text-primary dark:text-primary font-bold disabled:opacity-60"
          >
            Upgrade to Pro <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      )}
      {upgradeMsg && (
        <div className="w-full bg-emerald-100 border-b border-emerald-200 py-2 px-4 text-center text-sm text-emerald-700 font-medium">
          {upgradeMsg}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined">tsunami</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">PyClima</h2>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <Link to="/public" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link to="/public" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">database</span>
              <span className="text-sm">Data Explorer</span>
            </Link>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 dark:text-slate-500 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">public</span>
                <span className="text-sm">3D Globe</span>
              </div>
              <span className="material-symbols-outlined text-sm">lock</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 dark:text-slate-500 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">query_stats</span>
                <span className="text-sm">Predictions</span>
              </div>
              <span className="material-symbols-outlined text-sm">lock</span>
            </div>
          </nav>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-auto">
            {user ? (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium">{user.name}</span>
                  <span className="text-xs text-slate-500">{analysesUsed}/{analysesTotal}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-2">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(analysesUsed / analysesTotal) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-500 capitalize">{user.role} · {user.tier} tier</p>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-primary hover:bg-slate-100 dark:hover:bg-slate-800 font-medium">
                <span className="material-symbols-outlined">login</span>
                <span className="text-sm">Sign In</span>
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Navbar */}
          <header className="flex h-[60px] items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-4 md:hidden">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-sm">tsunami</span>
              </div>
            </div>
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  readOnly
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary"
                  placeholder="Search datasets, sensors or locations..."
                  type="text"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              {user?.tier !== 'pro' ? (
                <button
                  id="upgrade-pro-btn"
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="flex items-center gap-2 bg-primary text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">bolt</span>
                  <span className="hidden sm:inline">{upgrading ? 'Upgrading…' : 'Upgrade to Pro'}</span>
                  <span className="sm:hidden">Pro</span>
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">star</span> Pro
                </span>
              )}
              {user && (
                <div
                  className="size-8 md:size-10 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold text-sm shrink-0"
                >
                  {user.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </header>

          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Public Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of real-time climate telemetry and historical data points.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
              <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <span className="material-symbols-outlined">analytics</span>
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Analyses Used</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">{analysesUsed} / {analysesTotal}</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                    <span className="material-symbols-outlined">data_object</span>
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Account Tier</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1 capitalize">{user?.tier || 'free'}</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                    <span className="material-symbols-outlined">person</span>
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Role</p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1 capitalize">{user?.role || 'public'}</h3>
              </div>
            </div>

            {/* Main Feature Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Analysis Log */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <h4 className="font-bold text-base md:text-lg">Historical Analysis Log</h4>
                </div>
                <div className="p-6 text-slate-400 text-sm text-center py-12">
                  {user
                    ? `${analysesUsed} of ${analysesTotal} free analyses used. Upload datasets from the researcher dashboard to see logs.`
                    : 'Sign in to see your analysis history.'}
                </div>
              </div>

              {/* Locked Map */}
              <div className="relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden group">
                <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-base md:text-lg">Global Climate Map</h4>
                </div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 relative h-64 lg:h-auto overflow-hidden">
                  <div className="w-full h-full opacity-40 grayscale" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e293b 100%)' }}></div>
                  <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="size-12 md:size-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/30">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">lock</span>
                    </div>
                    <h5 className="text-lg md:text-xl font-bold mb-2">Upgrade to Pro</h5>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6">Access interactive real-time heatmaps and high-resolution climate overlays.</p>
                    <button
                      id="upgrade-map-btn"
                      onClick={handleUpgrade}
                      disabled={upgrading}
                      className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60"
                    >
                      {upgrading ? 'Upgrading…' : 'Unlock Premium Maps'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-black mb-2">Ready for deeper insights?</h2>
                <p className="text-blue-50/80 max-w-lg text-sm sm:text-base">Get unlimited analyses, 3D globe visualization, ML-driven weather predictions, and API access to 100+ years of historical data.</p>
              </div>
              <button
                id="upgrade-cta-btn"
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full md:w-auto bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg shadow-xl shadow-black/20 hover:bg-blue-50 transition-colors shrink-0 text-center disabled:opacity-60"
              >
                {upgrading ? 'Upgrading…' : 'Upgrade Now'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PublicDashboard;
