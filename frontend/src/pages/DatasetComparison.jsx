import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listDatasets, compareDatasets as apiCompare } from '../services/api';
import PlotlyHeatmap from '../components/PlotlyHeatmap';

const DatasetComparison = () => {
  const { isPro, user } = useAuth();

  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  const [datasetIdA, setDatasetIdA] = useState('');
  const [datasetIdB, setDatasetIdB] = useState('');
  const [variable, setVariable] = useState('');

  // Collect variables common to BOTH selected datasets
  const EXCLUDED = ['climatology_bounds', 'valid_yr_count', 'lat', 'lon', 'level', 'time', 'latitude', 'longitude'];
  const selectedA = datasets.find(d => d._id === datasetIdA);
  const selectedB = datasets.find(d => d._id === datasetIdB);
  const varsA = (selectedA?.variables || []).filter(v => !EXCLUDED.includes(v));
  const varsB = new Set((selectedB?.variables || []).filter(v => !EXCLUDED.includes(v)));
  const commonVars = selectedB ? varsA.filter(v => varsB.has(v)) : varsA;

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

  // Auto-select first common variable when dataset selections change
  useEffect(() => {
    if (commonVars.length > 0 && !commonVars.includes(variable)) {
      setVariable(commonVars[0]);
    } else if (commonVars.length === 0) {
      setVariable('');
    }
  }, [datasetIdA, datasetIdB]);

  const handleCompare = async () => {
    setError('');
    setResult(null);
    if (!datasetIdA || !datasetIdB) { setError('Please select both datasets.'); return; }
    if (datasetIdA === datasetIdB) { setError('Please select two different datasets.'); return; }
    if (!variable) { setError('Please select a variable. Both datasets must share at least one common variable.'); return; }
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

  const downloadReport = () => {
    if (!result) return;
    
    const report = {
      generatedAt: new Date().toISOString(),
      platform: 'Cli-Lens',
      analysisType: 'Dataset Comparison',
      variable: result.variable,
      datasetA: {
        id: selectedA?._id,
        name: selectedA?.name || selectedA?.filename || 'Unknown',
      },
      datasetB: {
        id: selectedB?._id,
        name: selectedB?.name || selectedB?.filename || 'Unknown',
      },
      gridSize: `${result.datasetA?.latitudes?.length || 0} lat × ${result.datasetA?.longitudes?.length || 0} lon`,
      data: {
        difference: result.difference,
        datasetA: result.datasetA?.values,
        datasetB: result.datasetB?.values,
        latitudes: result.datasetA?.latitudes,
        longitudes: result.datasetA?.longitudes,
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cli-lens-compare-report-${result.variable}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

        {/* Pro gate — blocks non-Pro users */}
        {!isPro && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-amber-500" style={{ fontSize: 40 }}>lock</span>
            </div>
            <h2 className="text-[24px] font-bold text-slate-900 dark:text-white mb-2">Pro Feature</h2>
            <p className="text-slate-500 dark:text-slate-400 text-[15px] mb-8 max-w-[420px]">
              Dataset comparison is available on the <strong>Researcher Pro</strong> plan.
              Upgrade to compare multiple climate models side-by-side and download full contrast reports.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Contact Us to Upgrade
            </a>
          </div>
        )}

        {/* Selector Row — only shown to Pro users */}
        {isPro && (
        <section className="bg-white dark:bg-slate-900 p-5 md:p-[20px] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">

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
            <div className="hidden lg:flex items-center justify-center pb-2">
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
                <option value="">— Select Variable —</option>
                {commonVars.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
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
        )} {/* end isPro */}

        {/* Error */}
        {isPro && error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        {/* Results — real data from backend */}
        {isPro && result && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-2">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">compare_arrows</span>
                  Comparison Results
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Grid size: {result.datasetA?.latitudes?.length || 0} × {result.datasetA?.longitudes?.length || 0}
                </p>
              </div>
              <button onClick={downloadReport} className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                <span className="material-symbols-outlined text-sm">download</span> Download Report
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">difference</span>
                Absolute Difference (B - A)
              </h3>
              <p className="text-sm text-slate-500 mb-4">Positive values mean Dataset B is higher. Negative means Dataset A is higher.</p>
              <PlotlyHeatmap
                data={{ ...result.difference, latitudes: result.datasetA?.latitudes, longitudes: result.datasetA?.longitudes, variable: result.variable }}
                title={`${result.variable?.toUpperCase() || 'Variable'} — Difference (B − A)`}
                isDifference={true}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">calendar_today</span>
                  Dataset A — {selectedA?.name || selectedA?.filename || ''}
                </h3>
                <PlotlyHeatmap data={{ ...result.datasetA, variable: result.variable }} title={`${selectedA?.name || 'Dataset A'} — ${result.variable?.toUpperCase() || ''}`} />
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">event</span>
                  Dataset B — {selectedB?.name || selectedB?.filename || ''}
                </h3>
                <PlotlyHeatmap data={{ ...result.datasetB, variable: result.variable }} title={`${selectedB?.name || 'Dataset B'} — ${result.variable?.toUpperCase() || ''}`} />
              </div>
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
