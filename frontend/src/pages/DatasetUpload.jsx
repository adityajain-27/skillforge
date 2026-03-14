import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadDataset } from '../services/api';

const DatasetUpload = () => {
  const { isResearcher, user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle actual file selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      if (!name) setName(selected.name.replace(/\.nc$/, ''));
      setError('');
      setSuccess('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      if (!name) setName(dropped.name.replace(/\.nc$/, ''));
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file) { setError('Please select a .nc file first.'); return; }
    if (!isResearcher) { setError('Only researchers can upload datasets.'); return; }

    if (user?.tier === 'free' && user?.datasetsAnalyzed >= 3) {
      setError('Free tier limit reached (3 analyses). Upgrade to Pro.');
      return;
    }

    const formData = new FormData();
    formData.append('dataset', file);
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);

    try {
      setLoading(true);
      setError('');
      await uploadDataset(formData);
      setSuccess('Dataset uploaded and processed successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Topbar */}
      <header className="h-[60px] flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400">upload_file</span>
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 font-display">Upload Dataset</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-slate-500">notifications</span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8 dark:bg-background-dark">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Upload Dataset</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Supported format: NetCDF (.nc). Researchers only.</p>
          </div>

          {!isResearcher && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <span className="material-symbols-outlined align-middle mr-2">warning</span>
              Only <strong>researcher</strong> accounts can upload datasets. Your current role is <strong>{user?.role || 'unknown'}</strong>.
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">{success}</div>
          )}

          {/* Drop Zone — triggers real <input type="file"> */}
          <div className="mb-6 w-full max-w-[600px] mx-auto">
            <div
              id="upload-dropzone"
              className={`bg-white dark:bg-slate-900 rounded-xl border-2 border-dashed ${
                dragging ? 'border-primary bg-primary/5' : file ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700'
              } h-[220px] flex flex-col items-center justify-center transition-all hover:border-primary/50 group cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <span className={`material-symbols-outlined text-[40px] ${file ? 'text-primary' : 'text-slate-400 dark:text-slate-500'} mb-4 group-hover:text-primary transition-colors`}>
                cloud_upload
              </span>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">
                {file ? file.name : 'Drag & drop your .nc file here'}
              </p>
              {file && (
                <p className="text-slate-400 text-sm">{(file.size / (1024*1024)).toFixed(2)} MB</p>
              )}
              {!file && (
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  or <span className="text-primary font-semibold hover:underline">browse files</span>
                </p>
              )}
            </div>
            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".nc"
              className="hidden"
              id="dataset-file-input"
              onChange={handleFileChange}
            />
          </div>

          {/* Metadata fields (show after file selected) */}
          {file && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-6 max-w-[600px] mx-auto">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
                <span className="text-sm font-bold text-[#10B981] uppercase tracking-wider">File Selected</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-sm">description</span>
                  {file.name}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label htmlFor="dataset-name" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Dataset Name (optional)
                  </label>
                  <input
                    id="dataset-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={file.name}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="dataset-desc" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Description (optional)
                  </label>
                  <textarea
                    id="dataset-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the dataset…"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  id="upload-submit"
                  onClick={handleSubmit}
                  disabled={loading || !isResearcher}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">autorenew</span>
                      Uploading…
                    </>
                  ) : (
                    <>
                      Confirm & Process Dataset
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Info Alert */}
          <div className="mt-8 flex items-start gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
            <span className="material-symbols-outlined text-primary">info</span>
            <div>
              <p className="text-sm font-semibold text-primary">Processing Note</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Large NetCDF files may take a few minutes to index. You can continue working in the background once processing begins.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DatasetUpload;
