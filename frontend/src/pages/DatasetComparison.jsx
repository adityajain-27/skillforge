import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listDatasets, compareDatasets as apiCompare } from '../services/api';

const DatasetComparison = () => {
  const { isPro, user } = useAuth();

  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  const [datasetIdA, setDatasetIdA] = useState('');
  const [datasetIdB, setDatasetIdB] = useState('');
  const [variable, setVariable] = useState('temperature');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load available datasets for the selects
  useEffect(() => {
    listDatasets()
      .then((data) => setDatasets(data))
      .catch(() => {})
      .finally(() => setLoadingDatasets(false));
  }, []);

  const handleCompare = async () => {
    setError('');
    setResult(null);
    if (!datasetIdA || !datasetIdB) { setError('Please select both datasets.'); return; }
    if (datasetIdA === datasetIdB) { setError('Please select two different datasets.'); return; }
    if (!isPro) { setError('Dataset comparison requires a Pro subscription.'); return; }

    try {
      setLoading(true);
      const data = await apiCompare(datasetIdA, datasetIdB, variable);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TopBar */}
      <header className="h-[60px] border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
        <h1 className="text-lg font-semibold font-display">Compare Datasets</h1>
        <div className="flex items-center gap-4">
          {!isPro && (
            <span className="hidden sm:inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm">lock</span> Pro Feature
            </span>
          )}
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Selector Row */}
        <section className="bg-white dark:bg-slate-900 p-5 md:p-[20px] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {!isPro && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">lock</span>
              This feature requires a <strong>Pro</strong> subscription. Upgrade to run comparisons.
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_1fr_auto] gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="ds-a">Dataset A</label>
              {loadingDatasets ? (
                <div className="h-11 bg-slate-100 rounded-lg animate-pulse"></div>
              ) : (
                <select
                  id="ds-a"
                  value={datasetIdA}
                  onChange={(e) => setDatasetIdA(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary"
                >
                  <option value="">— Select Dataset A —</option>
                  {datasets.map((ds) => (
                    <option key={ds._id} value={ds._id}>{ds.name || ds.filename}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center justify-center pb-2 hidden lg:flex">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">VS</div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="ds-b">Dataset B</label>
              {loadingDatasets ? (
                <div className="h-11 bg-slate-100 rounded-lg animate-pulse"></div>
              ) : (
                <select
                  id="ds-b"
                  value={datasetIdB}
                  onChange={(e) => setDatasetIdB(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary"
                >
                  <option value="">— Select Dataset B —</option>
                  {datasets.map((ds) => (
                    <option key={ds._id} value={ds._id}>{ds.name || ds.filename}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2 lg:border-l lg:border-slate-200 dark:lg:border-slate-700 lg:pl-6">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="compare-variable">Variable</label>
              <select
                id="compare-variable"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary"
              >
                <option value="temperature">Surface Temperature</option>
                <option value="precipitation">Precipitation</option>
                <option value="pressure">Sea Level Pressure</option>
              </select>
            </div>
            <button
              id="compare-run"
              onClick={handleCompare}
              disabled={loading || !isPro}
              className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold h-11 px-8 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="material-symbols-outlined animate-spin text-sm">autorenew</span> Running…</>
              ) : (
                <><span className="material-symbols-outlined text-sm">play_arrow</span> Run Comparison</>
              )}
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        {/* Results — real data from backend */}
        {result && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">difference</span>
                Comparison Results
              </h3>
              <pre className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Placeholder visualisations (shown when no real data yet) */}
        {!result && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Heatmap Card A */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    Dataset A — {variable}
                  </h3>
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Select dataset to compare</span>
                </div>
                <div
                  className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative group opacity-40"
                  style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd, #fde68a, #f87171)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                    Run comparison to see data
                  </div>
                </div>
              </div>
              {/* Heatmap Card B */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">event</span>
                    Dataset B — {variable}
                  </h3>
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Select dataset to compare</span>
                </div>
                <div
                  className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative group opacity-40"
                  style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #93c5fd, #fde68a, #fbbf24, #ef4444, #b91c1c)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                    Run comparison to see data
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DatasetComparison;
