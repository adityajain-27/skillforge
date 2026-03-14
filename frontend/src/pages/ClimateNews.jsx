import React, { useState, useEffect } from 'react';
import { getNews } from '../services/api';

// Fallback articles shown when the backend is offline
const SAMPLE_ARTICLES = [
  {
    id: 1,
    title: 'Record-breaking heatwaves sweep South Asia for third consecutive year',
    summary: 'Scientists have confirmed that 2026 saw the highest average temperatures across South Asia since records began, with multiple countries reporting all-time highs above 50°C.',
    source: 'Climate Monitor',
    publishedAt: 'Mar 14, 2026',
    keywords: ['record temperatures', 'heatwave', 'South Asia'],
    url: '#',
  },
  {
    id: 2,
    title: 'Arctic sea ice extent reaches new annual minimum',
    summary: 'The Arctic sea ice extent in September 2026 broke the previous record set in 2012, continuing a decades-long trend of declining polar ice cover.',
    source: 'NSIDC',
    publishedAt: 'Mar 12, 2026',
    keywords: ['arctic warming', 'sea ice', 'polar'],
    url: '#',
  },
  {
    id: 3,
    title: 'India floods displace 4 million people in worst monsoon season on record',
    summary: 'Extreme precipitation events linked to a warming Bay of Bengal caused unprecedented flooding across northeastern India, with meteorologists warning of continued risks.',
    source: 'Reuters Climate',
    publishedAt: 'Mar 10, 2026',
    keywords: ['India floods', 'precipitation', 'monsoon'],
    url: '#',
  },
  {
    id: 4,
    title: 'Global CO₂ concentrations surpass 430 ppm for first time in human history',
    summary: 'Monthly atmospheric CO₂ readings from the Mauna Loa Observatory have exceeded 430 parts per million, setting a new benchmark that climate scientists call alarming.',
    source: 'NOAA',
    publishedAt: 'Mar 8, 2026',
    keywords: ['global warming', 'CO2', 'emissions'],
    url: '#',
  },
  {
    id: 5,
    title: 'Saharan dust storms intensify, impacting European air quality',
    summary: 'An increase in the frequency and intensity of Saharan dust transport events is being linked to desertification trends driven by rising temperatures across the Sahel region.',
    source: 'EEA',
    publishedAt: 'Mar 6, 2026',
    keywords: ['dust storms', 'air quality', 'desertification'],
    url: '#',
  },
];

// Map of keyword → filter chip label
const FILTER_CHIPS = [
  { label: 'All', q: '' },
  { label: 'Flooding', q: 'India floods' },
  { label: 'Drought', q: 'global warming' },
  { label: 'Temperature', q: 'record temperatures' },
  { label: 'Arctic', q: 'arctic warming' },
  { label: 'Oceans', q: 'sea ice' },
];

const ClimateNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQ, setSearchQ] = useState('');

  const fetchArticles = async (q) => {
    setLoading(true);
    setError('');
    try {
      const data = await getNews(q);
      // Backend returned data — use it
      if (Array.isArray(data) && data.length > 0) {
        setArticles(data);
      } else {
        // Empty array from backend or offline — use sample data
        const filtered = q
          ? SAMPLE_ARTICLES.filter((a) =>
              a.keywords?.some((k) => k.toLowerCase().includes(q.toLowerCase())) ||
              a.title.toLowerCase().includes(q.toLowerCase())
            )
          : SAMPLE_ARTICLES;
        setArticles(filtered.length > 0 ? filtered : SAMPLE_ARTICLES);
      }
    } catch {
      // Backend unreachable — fall back to sample data silently
      const filtered = q
        ? SAMPLE_ARTICLES.filter((a) =>
            a.keywords?.some((k) => k.toLowerCase().includes(q.toLowerCase())) ||
            a.title.toLowerCase().includes(q.toLowerCase())
          )
        : SAMPLE_ARTICLES;
      setArticles(filtered.length > 0 ? filtered : SAMPLE_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(activeFilter);
  }, [activeFilter]);

  const handleFilterClick = (chip) => {
    setActiveFilter(chip.q);
    setSearchQ('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveFilter(searchQ);
  };

  const [featured, ...rest] = articles;

  return (
    <>
      {/* Topbar */}
      <header className="h-[60px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
        <form className="relative w-full max-w-sm hidden sm:block" onSubmit={handleSearch}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input
            id="news-search"
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400 text-slate-900 dark:text-white"
            placeholder="Search climate news…"
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
          />
        </form>
        <div className="flex items-center gap-4 ml-auto">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          {/* Page Title + Filter Chips */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Climate News</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {FILTER_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  id={`filter-${chip.label.toLowerCase()}`}
                  onClick={() => handleFilterClick(chip)}
                  className={`px-5 py-1.5 rounded-full font-medium transition-colors ${
                    activeFilter === chip.q
                      ? 'bg-primary text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Layout */}
          <div className="mt-8 flex flex-col lg:flex-row gap-8">
            {/* News Feed */}
            <div className="flex-1 space-y-6">
              {loading && (
                <div className="flex items-center justify-center h-48 text-slate-400">
                  <span className="material-symbols-outlined animate-spin mr-2">autorenew</span> Loading news…
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
              )}
              {!loading && !error && articles.length === 0 && (
                <div className="p-8 text-center text-slate-400">No articles found for this filter.</div>
              )}

              {/* Featured card (first article) */}
              {!loading && featured && (
                <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col relative group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary z-10"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-primary uppercase">{featured.source}</span>
                      <span className="text-xs text-slate-400">• {featured.publishedAt}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 hover:text-primary transition-colors">
                      {featured.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{featured.summary}</p>
                    {featured.keywords && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featured.keywords.map((kw) => (
                          <span key={kw} className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded uppercase tracking-wide">{kw}</span>
                        ))}
                      </div>
                    )}
                    {featured.url && featured.url !== '#' && (
                      <a href={featured.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-semibold text-sm hover:underline">
                        Read more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Remaining articles */}
              {!loading && rest.map((article) => (
                <div key={article.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{article.source}</span>
                      <span className="text-[10px] text-slate-400">• {article.publishedAt}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{article.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{article.summary}</p>
                    {article.keywords && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {article.keywords.map((kw) => (
                          <span key={kw} className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded uppercase">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-[280px] lg:shrink-0 space-y-6">
              <section className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                  Quick Filters
                </h5>
                <div className="space-y-3">
                  {FILTER_CHIPS.slice(1).map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => handleFilterClick(chip)}
                      className="block w-full text-left group cursor-pointer hover:text-primary transition-colors"
                    >
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-primary">{chip.label}</p>
                      <p className="text-[10px] text-slate-400">Filter by &ldquo;{chip.q}&rdquo;</p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-primary/5 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Newsletter</h5>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">Get the weekly climate digest directly in your inbox.</p>
                <input
                  className="w-full text-xs py-2 px-3 rounded border border-slate-200 dark:border-slate-700 mb-2 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="email@example.com"
                  type="email"
                  id="newsletter-email"
                />
                <button className="w-full bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90 transition-opacity shadow-sm">
                  Subscribe
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClimateNews;
