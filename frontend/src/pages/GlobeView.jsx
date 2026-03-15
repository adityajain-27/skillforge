import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listDatasets, getMapData } from '../services/api';
import Plotly from 'plotly.js-dist-min';
import factory from 'react-plotly.js/factory';

const createPlotlyComponent = factory.default || factory;
const Plot = createPlotlyComponent(Plotly);

const VARIABLE_UNITS = {
  air: '°C', temperature: '°C', tmp: '°C', uwnd: 'm/s', vwnd: 'm/s',
  wspd: 'm/s', prate: 'kg/m²/s', precip: 'mm', pr: 'mm/day',
  slp: 'hPa', hgt: 'm', rhum: '%', sst: '°C',
};

const GlobeView = () => {
  const { user, isPro } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState('');
  const [variable, setVariable] = useState('');
  const [year, setYear] = useState('');
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [projection, setProjection] = useState('orthographic'); // 'orthographic' = 3D globe, 'natural earth' = flat map

  // Get variables from selected dataset
  const selectedDs = datasets.find(d => d._id === selectedDatasetId);
  const dataVars = (selectedDs?.variables || []).filter(
    v => !['climatology_bounds', 'valid_yr_count', 'lat', 'lon', 'level', 'time', 'latitude', 'longitude'].includes(v)
  );

  useEffect(() => {
    listDatasets()
      .then((data) => {
        setDatasets(data);
        if (data.length > 0) {
          setSelectedDatasetId(data[0]._id);
          const vars = (data[0]?.variables || []).filter(
            v => !['climatology_bounds', 'valid_yr_count', 'lat', 'lon', 'level', 'time', 'latitude', 'longitude'].includes(v)
          );
          setVariable(vars[0] || '');
        }
      })
      .catch(() => {});
  }, []);

  const handleRender = async () => {
    if (!selectedDatasetId || !variable) {
      setError('Please select a dataset and variable.');
      return;
    }
    setError('');
    setLoading(true);
    setMapData(null);
    try {
      const data = await getMapData(selectedDatasetId, variable, year);
      setMapData(data);
    } catch (err) {
      setError(err.message || 'Failed to load map data.');
    } finally {
      setLoading(false);
    }
  };

  // Build globe plot data from mapData
  const buildGlobePlot = () => {
    if (!mapData || !mapData.latitudes || !mapData.longitudes || !mapData.values) return null;

    const lats = mapData.latitudes;
    const lons = mapData.longitudes;
    const z = mapData.values;
    const unit = VARIABLE_UNITS[variable?.toLowerCase()] || '';

    // Flatten the 2D grid into arrays for scattergeo
    const flatLats = [];
    const flatLons = [];
    const flatVals = [];
    const flatText = [];

    for (let i = 0; i < lats.length; i++) {
      for (let j = 0; j < lons.length; j++) {
        const val = z[i]?.[j];
        if (val != null && !isNaN(val)) {
          flatLats.push(lats[i]);
          // Normalize longitude to [-180, 180] for proper globe display
          let lon = lons[j];
          if (lon > 180) lon -= 360;
          flatLons.push(lon);
          flatVals.push(val);
          flatText.push(`${variable.toUpperCase()}: ${val.toFixed(2)}${unit ? ' ' + unit : ''}<br>Lat: ${lats[i].toFixed(1)}°<br>Lon: ${lons[j].toFixed(1)}°`);
        }
      }
    }

    return {
      traces: [{
        type: 'scattergeo',
        lat: flatLats,
        lon: flatLons,
        text: flatText,
        hoverinfo: 'text',
        marker: {
          size: 3.5,
          color: flatVals,
          colorscale: [
            [0, '#313695'],
            [0.1, '#4575b4'],
            [0.2, '#74add1'],
            [0.3, '#abd9e9'],
            [0.4, '#e0f3f8'],
            [0.5, '#ffffbf'],
            [0.6, '#fee090'],
            [0.7, '#fdae61'],
            [0.8, '#f46d43'],
            [0.9, '#d73027'],
            [1, '#a50026'],
          ],
          cmin: Math.min(...flatVals),
          cmax: Math.max(...flatVals),
          colorbar: {
            title: {
              text: `${variable?.toUpperCase() || 'Value'}${unit ? ` (${unit})` : ''}`,
              font: { color: '#e2e8f0', size: 12 },
            },
            tickfont: { color: '#94a3b8', size: 10 },
            bgcolor: 'rgba(0,0,0,0)',
            len: 0.75,
            thickness: 15,
            outlinewidth: 0,
          },
          opacity: 0.8,
          line: { width: 0 },
        },
      }],
      layout: {
        title: {
          text: `${variable?.toUpperCase() || ''} – Global Distribution`,
          font: { color: '#e2e8f0', size: 16, family: 'Inter, system-ui, sans-serif' },
          y: 0.97,
        },
        geo: {
          projection: { type: projection, rotation: { lon: 78, lat: 20 }, scale: 1 },
          showland: true,
          landcolor: 'rgb(34, 85, 34)',        // Natural forest green
          showocean: true,
          oceancolor: 'rgb(10, 50, 100)',      // Deep ocean blue
          showcoastlines: true,
          coastlinecolor: 'rgba(200, 200, 180, 0.5)',
          coastlinewidth: 1,
          showlakes: true,
          lakecolor: 'rgb(20, 70, 130)',       // Lake blue
          showrivers: true,
          rivercolor: 'rgb(30, 80, 140)',
          riverwidth: 0.5,
          showcountries: true,
          countrycolor: 'rgba(200, 200, 180, 0.35)',
          countrywidth: 0.6,
          showsubunits: false,
          showframe: false,
          bgcolor: 'rgba(0,0,0,0)',
          lonaxis: { showgrid: true, gridcolor: 'rgba(200,200,200,0.12)', dtick: 30 },
          lataxis: { showgrid: true, gridcolor: 'rgba(200,200,200,0.12)', dtick: 30 },
          resolution: 50,
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 40, l: 0, r: 0, b: 0 },
        autosize: true,
      },
    };
  };

  const globePlot = mapData ? buildGlobePlot() : null;

  return (
    <div className="bg-[#0A0F1E] font-display text-slate-100 overflow-hidden h-screen w-screen relative flex flex-col">
      {/* Top Navigation */}
      <div className="flex justify-between items-center p-4 sm:p-6 z-20 relative">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-slate-200"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-sm font-medium hidden sm:block">Back to Dashboard</span>
        </Link>
        <div className="flex flex-col items-end">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">Cli-Lens</h1>
          <p className="text-[10px] sm:text-xs font-mono text-primary">3D_GLOBE_VISUALIZER</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 sm:p-6 pt-0 overflow-hidden z-10 relative">
        {/* Globe Area */}
        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col">
          {globePlot ? (
            <div className="flex-1">
              <Plot
                data={globePlot.traces}
                layout={globePlot.layout}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{
                  displayModeBar: true,
                  modeBarButtonsToRemove: ['lasso2d', 'select2d', 'sendDataToCloud'],
                  displaylogo: false,
                  responsive: true,
                  scrollZoom: true,
                }}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              {loading ? (
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="material-symbols-outlined animate-spin text-3xl">autorenew</span>
                  <span className="text-lg">Rendering globe data…</span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="material-symbols-outlined text-white/10 text-[120px] block mb-4">public</span>
                  <p className="text-slate-400 text-lg">Select a dataset and variable, then click <strong className="text-primary">Render Globe</strong></p>
                </div>
              )}
            </div>
          )}
          {error && (
            <div className="mx-4 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-300">{error}</div>
          )}
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-[300px] bg-white/95 text-slate-900 p-5 rounded-xl shadow-2xl flex flex-col gap-5 overflow-y-auto">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-tight mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">settings_input_component</span>
              Globe Controls
            </h2>
          </div>
          
          {/* Dataset Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Dataset</label>
            <div className="relative">
              <select
                id="globe-dataset"
                value={selectedDatasetId}
                onChange={(e) => {
                  setSelectedDatasetId(e.target.value);
                  const ds = datasets.find(d => d._id === e.target.value);
                  const vars = (ds?.variables || []).filter(
                    v => !['climatology_bounds', 'valid_yr_count', 'lat', 'lon', 'level', 'time', 'latitude', 'longitude'].includes(v)
                  );
                  setVariable(vars[0] || '');
                }}
                className="w-full bg-slate-100 border-none rounded-lg text-sm font-medium py-2 px-3 appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">— Select Dataset —</option>
                {datasets.map((ds) => (
                  <option key={ds._id} value={ds._id}>{ds.name || ds.filename}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-xl">expand_more</span>
            </div>
          </div>

          {/* Variable Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Variable</label>
            <div className="relative">
              <select
                id="globe-variable"
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-lg text-sm font-medium py-2 px-3 appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">— Select Variable —</option>
                {dataVars.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-2 text-slate-400 pointer-events-none text-xl">expand_more</span>
            </div>
          </div>

          {/* Year (optional) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Year (optional)</label>
            <input
              id="globe-year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g. 2010"
              className="w-full bg-slate-100 border-none rounded-lg text-sm font-medium py-2 px-3 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Projection Toggle */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">View Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setProjection('orthographic')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${projection === 'orthographic' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                🌍 3D Globe
              </button>
              <button
                onClick={() => setProjection('natural earth')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${projection === 'natural earth' ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                🗺 Flat Map
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="pt-2 border-t border-slate-200">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">Color Scale</p>
            <div className="h-3 w-full rounded-full mb-2" style={{ background: 'linear-gradient(to right, #313695, #4575b4, #74add1, #abd9e9, #e0f3f8, #ffffbf, #fee090, #fdae61, #f46d43, #d73027, #a50026)' }}></div>
            <div className="flex justify-between font-mono text-[10px] text-slate-500">
              <span>Low</span>
              <span>Mid</span>
              <span>High</span>
            </div>
          </div>

          <button
            id="globe-render"
            onClick={handleRender}
            disabled={loading || !selectedDatasetId || !variable}
            className="w-full bg-primary text-white font-bold py-2.5 rounded-lg text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 text-center disabled:opacity-60"
          >
            {loading ? 'Rendering…' : 'Render Globe'}
          </button>
        </div>
      </div>

      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(#2a77f4 1px, transparent 1px), linear-gradient(90deg, #2a77f4 1px, transparent 1px)', backgroundSize: '80px 80px' }}
      ></div>
    </div>
  );
};

export default GlobeView;
