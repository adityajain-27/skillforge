import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listDatasets, getPredictionTrend } from '../services/api';

const ClimatePredictions = () => {
  const { isPro } = useAuth();

  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  const [datasetId, setDatasetId] = useState('');
  const [variable, setVariable] = useState('temperature');
  const [lat, setLat] = useState('28.6');
  const [lon, setLon] = useState('77.2');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [runId] = useState(() => `CP-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`);

  useEffect(() => {
    listDatasets()
      .then((data) => setDatasets(data))
      .catch(() => {})
      .finally(() => setLoadingDatasets(false));
  }, []);

  const handleGenerate = async () => {
    setError('');
    setResult(null);
    if (!datasetId) { setError('Please select a dataset.'); return; }
    if (!lat || !lon) { setError('Please provide latitude and longitude.'); return; }
    if (!isPro) { setError('Climate predictions require a Pro subscription.'); return; }
    try {
      setLoading(true);
      const data = await getPredictionTrend(datasetId, variable, lat, lon);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Topbar */}
      <header className="h-[60px] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              readOnly
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Search datasets or models..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isPro && (
            <span className="hidden sm:inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm">lock</span> Pro Feature
            </span>
          )}
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Page Body */}
      <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 bg-background-light dark:bg-background-dark">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">Climate Predictions</h2>
            <p className="text-slate-500 mt-1">Generate multi-decadal climate forecasts using ensemble ML models.</p>
          </div>
          <div className="flex gap-2 text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400">RUN_ID:</span>
            <span className="text-primary">{runId}</span>
          </div>
        </div>

        {/* Config Bar */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {!isPro && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">lock</span>
              Predictions require a <strong>Pro</strong> subscription.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            {/* Dataset */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400" htmlFor="pred-dataset">Dataset</label>
              {loadingDatasets ? (
                <div className="h-11 bg-slate-100 rounded-lg animate-pulse"></div>
              ) : (
                <select
                  id="pred-dataset"
                  value={datasetId}
                  onChange={(e) => setDatasetId(e.target.value)}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary"
                >
                  <option value="">— Select Dataset —</option>
                  {datasets.map((ds) => (
                    <option key={ds._id} value={ds._id}>{ds.name || ds.filename}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Variable */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400" htmlFor="pred-variable">Variable</label>
              <select
                id="pred-variable"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary"
              >
                <option value="temperature">Avg Temperature (°C)</option>
                <option value="precipitation">Precipitation (mm)</option>
                <option value="pressure">Surface Pressure</option>
              </select>
            </div>

            {/* Latitude */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400" htmlFor="pred-lat">Latitude</label>
              <input
                id="pred-lat"
                type="number"
                step="0.1"
                min="-90"
                max="90"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="28.6"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400" htmlFor="pred-lon">Longitude</label>
              <input
                id="pred-lon"
                type="number"
                step="0.1"
                min="-180"
                max="180"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="77.2"
              />
            </div>

            {/* Spacer */}
            <div className="hidden lg:block"></div>

            {/* Generate button */}
            <button
              id="pred-generate"
              onClick={handleGenerate}
              disabled={loading || !isPro}
              className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold h-11 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <><span className="material-symbols-outlined text-lg animate-spin">autorenew</span> Running…</>
              ) : (
                <><span className="material-symbols-outlined text-lg">auto_awesome</span> Generate</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Prediction Results — {variable} at ({lat}°, {lon}°)
            </h3>

            {/* If the backend returns a time series, render it */}
            {result.timeSeries && Array.isArray(result.timeSeries) && (
              <div className="mb-4">
                <div className="h-48 relative flex items-end gap-1">
                  {result.timeSeries.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-primary rounded-t"
                      style={{
                        height: `${Math.min(100, Math.max(5, ((pt.value - Math.min(...result.timeSeries.map(p => p.value))) / (Math.max(...result.timeSeries.map(p => p.value)) - Math.min(...result.timeSeries.map(p => p.value)) || 1)) * 100))}%`,
                      }}
                      title={`${pt.year}: ${pt.value}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                  <span>{result.timeSeries[0]?.year}</span>
                  <span>{result.timeSeries[result.timeSeries.length - 1]?.year}</span>
                </div>
              </div>
            )}

            <pre className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>

            {/* Stats */}
            {result.confidence && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Confidence Score</p>
                  <span className="text-2xl font-black font-mono">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                {result.rmse !== undefined && (
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">RMSE</p>
                    <span className="text-2xl font-black font-mono">{result.rmse}°C</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Static chart placeholder (shown before running) */}
        {!result && !loading && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              <h3 className="font-bold text-lg">Temperature Forecast</h3>
              <span className="text-xs text-slate-400 ml-auto">Select parameters above and click Generate</span>
            </div>
            <div className="h-64 w-full relative flex flex-col justify-end items-center p-8 text-slate-300">
              <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 1000 300">
                <line className="text-slate-200 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
                <line className="text-slate-200 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
                <line className="text-slate-200 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
                <path d="M 0 220 Q 50 230 100 200 Q 150 170 200 190 Q 250 210 300 180 Q 350 160 400 175 Q 450 190 500 160 Q 550 130 600 150" fill="none" stroke="#2a77f4" strokeLinecap="round" strokeWidth="3"></path>
                <path d="M 600 150 Q 700 120 800 100 Q 900 80 1000 60" fill="none" stroke="#f59e0b" strokeDasharray="8 6" strokeLinecap="round" strokeWidth="3"></path>
                <path d="M 600 150 Q 700 120 800 100 Q 900 80 1000 60 L 1000 140 Q 900 160 800 180 Q 700 200 600 150" fill="rgba(245, 158, 11, 0.15)"></path>
              </svg>
              <p className="relative text-sm text-slate-400">Run a prediction to see real forecast data from the backend</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClimatePredictions;
