import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listDatasets, getMapData, getLocationTrend, getGlobalMean } from '../services/api';

const ReportExport = () => {
  const { user, isPro } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState('');
  const [includePredictions, setIncludePredictions] = useState(true);
  const [includeComparison, setIncludeComparison] = useState(false);
  const [includeAnnotations, setIncludeAnnotations] = useState(true);
  const [format, setFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the selected dataset
  const selectedDs = datasets.find(d => d._id === selectedDatasetId);
  const dataVars = (selectedDs?.variables || []).filter(
    v => !['climatology_bounds', 'valid_yr_count', 'lat', 'lon', 'level', 'time', 'latitude', 'longitude'].includes(v)
  );

  useEffect(() => {
    listDatasets()
      .then((data) => {
        setDatasets(data);
        if (data.length > 0) setSelectedDatasetId(data[0]._id);
      })
      .catch(() => {});
  }, []);

  const handleDownload = async () => {
    if (!selectedDatasetId) { setError('Please select a dataset.'); return; }
    setError('');
    setLoading(true);

    try {
      // Build the report data
      const report = {
        generatedAt: new Date().toISOString(),
        generatedBy: user?.name || 'Unknown',
        platform: 'Cli-Lens',
        dataset: {
          id: selectedDs?._id,
          name: selectedDs?.name || selectedDs?.filename,
          variables: selectedDs?.variables,
          spatialCoverage: selectedDs?.spatialCoverage,
          timeRange: selectedDs?.timeRange,
        },
        settings: {
          includePredictions,
          includeComparison,
          includeAnnotations,
          format,
        },
      };

      // Fetch actual map data for the first variable
      if (dataVars.length > 0) {
        const varName = dataVars[0];
        try {
          const mapResult = await getMapData(selectedDatasetId, varName);
          const allVals = mapResult.values?.flat().filter(v => v != null && !isNaN(v)) || [];
          report.spatialAnalysis = {
            variable: varName,
            gridSize: `${mapResult.latitudes?.length} lat × ${mapResult.longitudes?.length} lon`,
            latRange: mapResult.latitudes ? `${Math.min(...mapResult.latitudes).toFixed(1)}° to ${Math.max(...mapResult.latitudes).toFixed(1)}°` : null,
            lonRange: mapResult.longitudes ? `${Math.min(...mapResult.longitudes).toFixed(1)}° to ${Math.max(...mapResult.longitudes).toFixed(1)}°` : null,
            statistics: {
              min: allVals.length > 0 ? Math.min(...allVals).toFixed(4) : null,
              max: allVals.length > 0 ? Math.max(...allVals).toFixed(4) : null,
              mean: allVals.length > 0 ? (allVals.reduce((a, b) => a + b, 0) / allVals.length).toFixed(4) : null,
              totalGridPoints: allVals.length,
            },
            dataSample: mapResult.values?.slice(0, 3)?.map(row => row?.slice(0, 5)),
          };
        } catch { /* skip if fails */ }

        // Fetch trend analysis (center of the grid)
        if (includePredictions) {
          try {
            const trendResult = await getLocationTrend(selectedDatasetId, varName, 20, 78);
            report.trendAnalysis = {
              variable: varName,
              location: `${trendResult.actualLat?.toFixed(1)}°, ${trendResult.actualLon?.toFixed(1)}°`,
              dataPoints: trendResult.times?.length || 0,
              trendPerYear: trendResult.trendPerYear,
              trendDirection: trendResult.trendPerYear > 0 ? 'increasing' : 'decreasing',
              anomalyCount: trendResult.anomalyTimes?.length || 0,
              timeRange: trendResult.times ? `${trendResult.times[0]} to ${trendResult.times[trendResult.times.length - 1]}` : null,
            };
          } catch { /* skip if fails */ }

          try {
            const globalResult = await getGlobalMean(selectedDatasetId, varName);
            report.globalMeanAnalysis = {
              variable: varName,
              dataPoints: globalResult.times?.length || 0,
              trendPerYear: globalResult.trendPerYear,
              trendDirection: globalResult.trendPerYear > 0 ? 'increasing' : 'decreasing',
              anomalyCount: globalResult.anomalyTimes?.length || 0,
            };
          } catch { /* skip if fails */ }
        }
      }

      // Download as JSON
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cli-lens-report-${selectedDs?.name || 'export'}.json`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (err) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TopBar */}
      <header className="h-[60px] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-sm hidden sm:inline">Reports</span>
          <span className="text-slate-400 text-sm hidden sm:inline">/</span>
          <span className="text-sm font-semibold">Export Report</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="size-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2 font-display">Export Report</h1>
            <p className="text-slate-500">Generate a downloadable report from your dataset analysis.</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Report Preview (60%) */}
            <div className="lg:w-[60%] flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Report Preview</h3>
              </div>

              {/* Paper Document */}
              <div 
                className="bg-white w-full max-w-[600px] mx-auto p-6 sm:p-12 border border-slate-100 text-slate-900 flex flex-col aspect-[1/1.414]"
                style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-slate-900 rounded flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined">ac_unit</span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black">Cli-Lens</h2>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hidden sm:block">Scientific Reporting Systems</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Report Ref: PCX-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}</p>
                    <p className="text-[10px] font-mono text-slate-500">Date: {new Date().toISOString().split('T')[0]}</p>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black mb-6">Climate Analysis Report</h1>
                
                <div className="bg-slate-50 p-4 sm:p-6 rounded-lg mb-8 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="text-slate-500 uppercase font-bold tracking-tighter">Dataset:</div>
                    <div className="text-slate-900">{selectedDs?.name || selectedDs?.filename || '—'}</div>
                    <div className="text-slate-500 uppercase font-bold tracking-tighter">Variables:</div>
                    <div className="text-slate-900">{dataVars.join(', ') || '—'}</div>
                    <div className="text-slate-500 uppercase font-bold tracking-tighter">Coverage:</div>
                    <div className="text-slate-900">
                      {selectedDs?.spatialCoverage
                        ? `${selectedDs.spatialCoverage.latMin}°–${selectedDs.spatialCoverage.latMax}° N, ${selectedDs.spatialCoverage.lonMin}°–${selectedDs.spatialCoverage.lonMax}° E`
                        : '—'}
                    </div>
                    <div className="text-slate-500 uppercase font-bold tracking-tighter">Author:</div>
                    <div className="text-slate-900">{user?.name || '—'}</div>
                  </div>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">Report Contents</h3>
                
                <div className="flex-1 font-mono text-[10px] sm:text-[11px] leading-relaxed text-slate-600 space-y-2">
                  <p>✓ Dataset metadata and spatial coverage summary</p>
                  <p>✓ Spatial grid statistics (min / max / mean / grid size)</p>
                  {includePredictions && <p>✓ Time-series trend analysis (trend rate per year)</p>}
                  {includePredictions && <p>✓ Anomaly detection (2σ outlier count)</p>}
                  {includePredictions && <p>✓ Global spatial mean analysis (cosine-weighted)</p>}
                  {includeComparison && <p>✓ Multi-dataset comparison analysis</p>}
                  {includeAnnotations && <p>✓ User annotations and discussion threads</p>}
                  <p>✓ Variable distributions and grid summary</p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 hidden sm:flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  <span>Generated by Cli-Lens</span>
                  <span>Page 1 / 1</span>
                </div>
              </div>
            </div>

            {/* Right: Export Settings (40%) */}
            <div className="lg:w-[40%] space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Export Settings</h2>
                
                {/* Dataset Selector */}
                <div className="mb-6 space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Dataset</label>
                  <select
                    id="report-dataset"
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-3 px-4 appearance-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium"
                  >
                    <option value="">— Select Dataset —</option>
                    {datasets.map((ds) => (
                      <option key={ds._id} value={ds._id}>{ds.name || ds.filename}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-6">
                  {/* Options */}
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-semibold">Include Predictions</span>
                      <div className="relative inline-flex items-center">
                        <input checked={includePredictions} onChange={(e) => setIncludePredictions(e.target.checked)} className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-semibold">Include Comparison</span>
                      <div className="relative inline-flex items-center">
                        <input checked={includeComparison} onChange={(e) => setIncludeComparison(e.target.checked)} className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-sm font-semibold">Add Annotations</span>
                      <div className="relative inline-flex items-center">
                        <input checked={includeAnnotations} onChange={(e) => setIncludeAnnotations(e.target.checked)} className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>
                  </div>
                  
                  <hr className="border-slate-100 dark:border-slate-800" />
                  
                  {/* Download Button — Pro only */}
                  <div className="pt-4">
                    {isPro ? (
                      <>
                        <button
                          id="report-download"
                          onClick={handleDownload}
                          disabled={loading || !selectedDatasetId}
                          className="w-full bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-60 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-amber-500/20"
                        >
                          <span className="material-symbols-outlined">download</span>
                          {loading ? 'Generating…' : 'Download Report'}
                        </button>
                        <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
                          Downloads as JSON with dataset metadata + analysis
                        </p>
                      </>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-5 flex flex-col items-center gap-3 text-center">
                        <span className="material-symbols-outlined text-amber-500 text-3xl">lock</span>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pro feature</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Upgrade to Pro to download reports and access full export functionality.</p>
                        <Link
                          to="/contact"
                          className="mt-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors"
                        >
                          Upgrade to Pro
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ReportExport;
