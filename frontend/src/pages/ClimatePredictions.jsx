import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listDatasets, getLocationTrend, getGlobalMean } from '../services/api';
import PlotlyLineChart from '../components/PlotlyLineChart';

const ClimatePredictions = () => {
  const { isPro } = useAuth();

  const [datasets, setDatasets] = useState([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  const [datasetId, setDatasetId] = useState('');
  const [variable, setVariable] = useState('');
  const [lat, setLat] = useState('28.6');
  const [lon, setLon] = useState('77.2');

  // Get the real variables from the selected dataset
  const selectedDs = datasets.find(d => d._id === datasetId);
  const dataVars = (selectedDs?.variables || []).filter(
    v => !['climatology_bounds', 'valid_yr_count', 'lat', 'lon', 'level', 'time', 'latitude', 'longitude'].includes(v)
  );

  // Location time series state
  const [locationResult, setLocationResult] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Global spatial mean state
  const [globalResult, setGlobalResult] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  useEffect(() => {
    listDatasets()
      .then((data) => setDatasets(data))
      .catch(() => {})
      .finally(() => setLoadingDatasets(false));
  }, []);

  const handleAnalyze = async () => {
    if (!datasetId || !variable) return;

    // Run both analyses in parallel
    setLocationError('');
    setLocationResult(null);
    setLocationLoading(true);
    setGlobalError('');
    setGlobalResult(null);
    setGlobalLoading(true);

    // Location time series
    getLocationTrend(datasetId, variable, lat, lon)
      .then(data => setLocationResult(data))
      .catch(err => setLocationError(err.message || 'Time series analysis failed.'))
      .finally(() => setLocationLoading(false));

    // Global spatial mean
    getGlobalMean(datasetId, variable)
      .then(data => setGlobalResult(data))
      .catch(err => setGlobalError(err.message || 'Global mean analysis failed.'))
      .finally(() => setGlobalLoading(false));
  };

  const anyLoading = locationLoading || globalLoading;

  // Download analysis report as JSON
  const downloadReport = (type) => {
    const report = {
      generatedAt: new Date().toISOString(),
      platform: 'Cli-Lens',
      dataset: selectedDs?.name || selectedDs?.filename || 'Unknown',
      variable,
    };

    if (type === 'location' && locationResult) {
      report.analysisType = 'Location Time Series Trend Analysis';
      report.location = {
        requestedLat: parseFloat(lat),
        requestedLon: parseFloat(lon),
        actualLat: locationResult.actualLat,
        actualLon: locationResult.actualLon,
      };
      report.summary = {
        dataPoints: locationResult.times?.length || 0,
        trendPerYear: locationResult.trendPerYear,
        trendDirection: locationResult.trendPerYear > 0 ? 'increasing' : 'decreasing',
        anomalyCount: locationResult.anomalyTimes?.length || 0,
        timeRange: locationResult.times ? `${locationResult.times[0]} to ${locationResult.times[locationResult.times.length - 1]}` : null,
      };
      report.data = {
        times: locationResult.times,
        values: locationResult.values,
        rollingMean: locationResult.rollingMean,
        trendLine: locationResult.trendLine,
        anomalyTimes: locationResult.anomalyTimes,
        anomalyValues: locationResult.anomalyValues,
      };
    } else if (type === 'global' && globalResult) {
      report.analysisType = 'Global Spatial Mean Analysis (Cosine-latitude weighted)';
      report.summary = {
        dataPoints: globalResult.times?.length || 0,
        trendPerYear: globalResult.trendPerYear,
        trendDirection: globalResult.trendPerYear > 0 ? 'increasing' : 'decreasing',
        anomalyCount: globalResult.anomalyTimes?.length || 0,
        timeRange: globalResult.times ? `${globalResult.times[0]} to ${globalResult.times[globalResult.times.length - 1]}` : null,
      };
      report.data = {
        times: globalResult.times,
        values: globalResult.values,
        rollingMean: globalResult.rollingMean,
        trendLine: globalResult.trendLine,
        anomalyTimes: globalResult.anomalyTimes,
        anomalyValues: globalResult.anomalyValues,
      };
    } else if (type === 'full') {
      report.analysisType = 'Full Analysis Report';
      if (locationResult) {
        report.locationAnalysis = {
          location: `${locationResult.actualLat?.toFixed(1)}°, ${locationResult.actualLon?.toFixed(1)}°`,
          dataPoints: locationResult.times?.length || 0,
          trendPerYear: locationResult.trendPerYear,
          anomalyCount: locationResult.anomalyTimes?.length || 0,
          times: locationResult.times,
          values: locationResult.values,
          rollingMean: locationResult.rollingMean,
          trendLine: locationResult.trendLine,
        };
      }
      if (globalResult) {
        report.globalMeanAnalysis = {
          dataPoints: globalResult.times?.length || 0,
          trendPerYear: globalResult.trendPerYear,
          anomalyCount: globalResult.anomalyTimes?.length || 0,
          times: globalResult.times,
          values: globalResult.values,
          rollingMean: globalResult.rollingMean,
          trendLine: globalResult.trendLine,
        };
      }
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cli-lens-${type}-report-${variable}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Topbar */}
      <header className="h-[60px] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input readOnly className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm" placeholder="Search datasets or models..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Page Body */}
      <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 bg-background-light dark:bg-background-dark">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">query_stats</span>
              Time-Series Trend Analysis
            </h2>
            <p className="text-slate-500 mt-1">Analyze temporal trends with rolling mean, linear regression, and anomaly detection.</p>
          </div>
        </div>

        {/* Config Bar */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
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
                  onChange={(e) => {
                    setDatasetId(e.target.value);
                    const ds = datasets.find(d => d._id === e.target.value);
                    const vars = (ds?.variables || []).filter(
                      v => !['climatology_bounds', 'valid_yr_count', 'lat', 'lon', 'level', 'time', 'latitude', 'longitude'].includes(v)
                    );
                    setVariable(vars[0] || '');
                  }}
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
                <option value="">— Select Variable —</option>
                {dataVars.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Latitude */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400" htmlFor="pred-lat">Latitude</label>
              <input
                id="pred-lat" type="number" step="0.1" min="-90" max="90" value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="28.6"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400" htmlFor="pred-lon">Longitude</label>
              <input
                id="pred-lon" type="number" step="0.1" min="-180" max="360" value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="77.2"
              />
            </div>

            {/* Spacer */}
            <div className="hidden lg:block"></div>

            {/* Analyze button */}
            <button
              id="pred-generate"
              onClick={handleAnalyze}
              disabled={anyLoading || !datasetId || !variable}
              className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold h-11 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
            >
              {anyLoading ? (
                <><span className="material-symbols-outlined text-lg animate-spin">autorenew</span> Analyzing…</>
              ) : (
                <><span className="material-symbols-outlined text-lg">query_stats</span> Analyze</>
              )}
            </button>
          </div>
        </div>

        {/* Errors */}
        {locationError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{locationError}</div>
        )}

        {/* Section 1: Location Time Series Trend Analysis */}
        {locationResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">timeline</span>
                <div>
                  <h3 className="font-bold text-lg">
                    {variable.toUpperCase()} Time Series at {locationResult.actualLat?.toFixed(1)}°{locationResult.actualLat >= 0 ? 'N' : 'S'}, {locationResult.actualLon?.toFixed(1)}°E
                  </h3>
                  <p className="text-sm text-slate-500">
                    {locationResult.times?.length || 0} data points •
                    {locationResult.trendPerYear != null && (
                      <span className={locationResult.trendPerYear > 0 ? ' text-red-400' : ' text-blue-400'}>
                        {' '}Trend: {locationResult.trendPerYear > 0 ? '+' : ''}{locationResult.trendPerYear.toFixed(4)}/yr
                      </span>
                    )}
                    {locationResult.anomalyTimes?.length > 0 && (
                      <span className="text-amber-400"> • {locationResult.anomalyTimes.length} anomalies detected</span>
                    )}
                  </p>
                </div>
              </div>
              {isPro ? (
                <button onClick={() => downloadReport('location')} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-sm">download</span> Download
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed" title="Pro feature">
                  <span className="material-symbols-outlined text-sm">lock</span> Pro
                </span>
              )}
            </div>
            <PlotlyLineChart
              data={locationResult}
              title={`${variable.toUpperCase()} Time Series @ ${locationResult.actualLat?.toFixed(1)}°, ${locationResult.actualLon?.toFixed(1)}°`}
              subtitle={`Showing ${variable} at ${locationResult.actualLat?.toFixed(1)}°${locationResult.actualLat >= 0 ? 'N' : 'S'}, ${locationResult.actualLon?.toFixed(1)}°E (${locationResult.times?.[0]?.slice(0, 4)}–${locationResult.times?.[locationResult.times.length - 1]?.slice(0, 4)})`}
            />
          </div>
        )}

        {/* Section 2: Global Spatial Mean */}
        {globalError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{globalError}</div>
        )}

        {globalResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">public</span>
                <div>
                  <h3 className="font-bold text-lg">
                    Global Spatial Mean Over Time — {variable.toUpperCase()}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Cosine-latitude weighted global average •
                    {globalResult.trendPerYear != null && (
                      <span className={globalResult.trendPerYear > 0 ? ' text-red-400' : ' text-blue-400'}>
                        {' '}Trend: {globalResult.trendPerYear > 0 ? '+' : ''}{globalResult.trendPerYear.toFixed(4)}/yr
                      </span>
                    )}
                  </p>
                </div>
              </div>
              {isPro ? (
                <button onClick={() => downloadReport('global')} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-sm">download</span> Download
                </button>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed" title="Pro feature">
                  <span className="material-symbols-outlined text-sm">lock</span> Pro
                </span>
              )}
            </div>
            <PlotlyLineChart
              data={globalResult}
              title={`${variable.toUpperCase()} (Global Mean) Time Series`}
              subtitle="Cosine-latitude weighted global spatial mean at each time step"
            />
          </div>
        )}

        {/* Full Report Download */}
        {(locationResult || globalResult) && (
          <div className="flex justify-center mt-2">
            {isPro ? (
              <button
                onClick={() => downloadReport('full')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 transform active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">summarize</span>
                Download Full Analysis Report
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2 px-6 py-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl text-center">
                <span className="material-symbols-outlined text-amber-500 text-2xl">lock</span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Download is a Pro feature</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Upgrade to export full analysis reports.</p>
                <a href="/contact" className="mt-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors">Upgrade to Pro</a>
              </div>
            )}
          </div>
        )}

        {/* Placeholder (shown before running) */}
        {!locationResult && !globalResult && !anyLoading && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              <h3 className="font-bold text-lg">Time-Series Trend Analysis</h3>
              <span className="text-xs text-slate-400 ml-auto">Select parameters above and click Analyze</span>
            </div>
            <div className="h-64 w-full relative flex flex-col justify-end items-center p-8 text-slate-300">
              <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 1000 300">
                <line className="text-slate-200 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50" />
                <line className="text-slate-200 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150" />
                <line className="text-slate-200 dark:text-slate-800" stroke="currentColor" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250" />
                <path d="M 0 220 Q 50 230 100 200 Q 150 170 200 190 Q 250 210 300 180 Q 350 160 400 175 Q 450 190 500 160 Q 550 130 600 150" fill="none" stroke="#22d3ee" strokeLinecap="round" strokeWidth="2" />
                <path d="M 0 225 Q 100 215 200 195 Q 300 190 400 180 Q 500 165 600 155" fill="none" stroke="rgba(255,255,255,0.4)" strokeDasharray="4 3" strokeLinecap="round" strokeWidth="1.5" />
                <path d="M 0 230 L 600 140" fill="none" stroke="#f59e0b" strokeDasharray="8 6" strokeLinecap="round" strokeWidth="2" />
                <circle cx="350" cy="160" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
                <circle cx="520" cy="140" r="5" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
              </svg>
              <p className="relative text-sm text-slate-400">Select a dataset and click Analyze to see trend analysis with rolling mean, trend line, and anomaly detection</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClimatePredictions;
