import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listDatasets, deleteDataset } from '../services/api';

const ResearcherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listDatasets();
        setDatasets(Array.isArray(data) ? data : []);
      } catch {
        // Backend offline — silently show empty list
        setDatasets([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this dataset?')) return;
    setDeletingId(id);
    try {
      await deleteDataset(id);
      setDatasets((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert(err.message || 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const ICON_COLORS = ['blue', 'emerald', 'amber', 'purple', 'red', 'cyan'];
  const getColor = (i) => ICON_COLORS[i % ICON_COLORS.length];

  return (
    <>
      {/* Top Bar */}
      <header className="h-[60px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0">
        <h2 className="text-xl font-medium text-slate-900 dark:text-white font-display">Dashboard</h2>
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden sm:block text-sm text-slate-500">
              {user.name} <span className="font-mono text-primary">({user.role})</span>
            </span>
          )}
          <div className="relative w-64 hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              readOnly
              className="w-full pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Search datasets, maps..."
              type="text"
            />
          </div>
          <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          {user?.role === 'researcher' && (
            <Link
              to="/dashboard/upload"
              id="upload-btn"
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg">cloud_upload</span>
              <span className="hidden sm:inline">Upload Dataset</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-medium"
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC] dark:bg-background-dark">
        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Datasets Uploaded</p>
            <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white">{loading ? '—' : datasets.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Analyses Used</p>
            <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white">{user?.datasetsAnalyzed ?? '—'}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Account Tier</p>
            <p className={`text-3xl font-bold font-mono ${user?.tier === 'pro' ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
              {user?.tier ? user.tier.toUpperCase() : '—'}
            </p>
          </div>
        </div>

        {/* Recent Datasets */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">My Datasets</h3>
            {user?.role === 'researcher' && (
              <Link to="/dashboard/upload" className="text-xs font-medium text-primary hover:underline">+ Upload New</Link>
            )}
          </div>

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50">{error}</div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-32 text-slate-400">
              <span className="material-symbols-outlined animate-spin mr-2">autorenew</span> Loading…
            </div>
          )}

          {!loading && datasets.length === 0 && !error && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No datasets found.{' '}
              {user?.role === 'researcher' && (
                <Link to="/dashboard/upload" className="text-primary hover:underline">Upload your first dataset.</Link>
              )}
            </div>
          )}

          <div className="flex-1">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {datasets.map((ds, i) => (
                <div key={ds._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className={`w-10 h-10 rounded bg-${getColor(i)}-100 dark:bg-${getColor(i)}-900/30 flex items-center justify-center text-${getColor(i)}-600`}>
                    <span className="material-symbols-outlined">table_chart</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{ds.name || ds.filename}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      By {ds.uploadedBy?.name || 'You'} ·{' '}
                      {ds.variables?.length > 0 ? `${ds.variables.length} variables` : 'No variables'}
                      {ds.isPublic ? ' · Public' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/compare`}
                      id={`dataset-compare-${ds._id}`}
                      className="p-1 text-slate-400 hover:text-primary"
                      title="Compare"
                    >
                      <span className="material-symbols-outlined text-sm">compare_arrows</span>
                    </Link>
                    {ds.uploadedBy?._id === user?._id && (
                      <button
                        id={`dataset-delete-${ds._id}`}
                        onClick={() => handleDelete(ds._id)}
                        disabled={deletingId === ds._id}
                        className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-40"
                        title="Delete dataset"
                      >
                        <span className="material-symbols-outlined text-sm">
                          {deletingId === ds._id ? 'autorenew' : 'delete'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pro upgrade notice */}
        {user?.tier !== 'pro' && (
          <div className="bg-gradient-to-r from-primary to-blue-700 text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-lg mb-1">Researcher Pro — Unlimited Access</h3>
              <p className="text-blue-100 text-sm">All features are available. Upgrade for priority support and unlimited storage.</p>
            </div>
            <Link
              to="/contact"
              id="upgrade-btn"
              className="bg-white text-primary font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors shrink-0"
            >
              Contact Us
            </Link>
          </div>
        )}

        {/* Navigation shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Stories', icon: 'auto_stories', to: '/dashboard/stories' },
            { label: 'News', icon: 'newspaper', to: '/dashboard/news' },
            { label: 'Predictions', icon: 'query_stats', to: '/dashboard/predictions' },
            { label: 'Reports', icon: 'description', to: '/dashboard/reports' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              id={`nav-${item.label.toLowerCase()}`}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col items-center gap-2 hover:border-primary hover:shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default ResearcherDashboard;
