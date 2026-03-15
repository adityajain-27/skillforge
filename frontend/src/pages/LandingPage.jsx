import React from 'react';
import { Link } from 'react-router-dom';

/* ─── CSS 3D Earth Globe ─────────────────────────────────────────── */
const GLOBE_CSS = `
@keyframes globeSpin {
  from { background-position-x: 0%; }
  to   { background-position-x: 200%; }
}
@keyframes cloudSpin {
  from { background-position-x: 0%; }
  to   { background-position-x: 200%; }
}`;

const LandingGlobe = () => (
  <>
    <style>{GLOBE_CSS}</style>

    {/* Outer wrapper — dark space halo */}
    <div style={{ position: 'relative', width: 460, height: 460 }}>

      {/* Faint star-ring glow */}
      <div style={{
        position: 'absolute', inset: -24, borderRadius: '50%',
        background: 'radial-gradient(circle, transparent 40%, rgba(40,100,255,0.12) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* The Earth sphere */}
      <div style={{
        width: 460, height: 460, borderRadius: '50%', overflow: 'hidden',
        position: 'relative',
        boxShadow: [
          /* Day-night terminator — dark left/bottom */
          'inset 55px 30px 120px rgba(0,0,0,0.75)',
          /* Atmospheric rim */
          'inset -10px -8px 40px rgba(80,160,255,0.15)',
          /* Outer atmosphere glow */
          '0 0 60px 18px rgba(30,100,230,0.22)',
          /* Drop shadow */
          '0 24px 64px rgba(0,0,10,0.5)',
        ].join(', '),
      }}>

        {/* Earth texture layer — rotates */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/earth_texture.png)',
          backgroundSize: '200% 100%',
          backgroundPosition: '0% 50%',
          backgroundRepeat: 'repeat-x',
          animation: 'globeSpin 36s linear infinite',
        }} />

        {/* Specular / ocean shine — top-right bright spot */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(ellipse at 65% 28%, rgba(255,255,255,0.18) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* Polar ice caps overlay — subtle white at top & bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'radial-gradient(ellipse at 50% 0%,  rgba(220,240,255,0.45) 0%, transparent 30%)',
            'radial-gradient(ellipse at 50% 100%, rgba(220,240,255,0.35) 0%, transparent 25%)',
          ].join(', '),
          pointerEvents: 'none',
        }} />

        {/* Thin dark-side vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 28% 60%, transparent 45%, rgba(0,0,20,0.55) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Floating drag hint */}
      <div style={{
        position: 'absolute', bottom: -36, left: '50%', transform: 'translateX(-50%)',
        fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        color: 'rgba(100,140,200,0.7)',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        🌍 Rotating Earth · Climate Intelligence Platform
      </div>
    </div>
  </>
);


const LandingPage = () => {
  return (
    <div className="flex flex-col w-full">

      {/* Hero Section */}
      <section className="pt-[160px] pb-[160px] bg-slate-50 dark:bg-slate-950 flex flex-col items-center px-6">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[12px] font-bold mb-8">
          Climate Intelligence Platform
        </div>
        <h1 className="text-[56px] font-light leading-tight text-slate-900 dark:text-white text-center max-w-[720px] mb-6">
          Visualize our planet's climate data like never before.
        </h1>
        <p className="text-[17px] text-slate-500 dark:text-slate-400 text-center mb-10 max-w-[600px]">
          Upload NetCDF datasets, explore global heatmaps, and predict climate trends — all in your browser, no code required.
        </p>
        <div className="flex items-center gap-3 mb-16">
          <Link
            to="/login"
            className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-[16px] hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Get Started
          </Link>
        </div>

        {/* 3D Interactive Globe */}
        <LandingGlobe />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-background-dark px-6">
        <div className="max-w-[1200px] mx-auto text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">Platform Features</p>
          <h2 className="text-[36px] font-light text-slate-900 dark:text-white">Everything climate researchers need</h2>
        </div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: 'upload_file',    title: 'Upload & Process',        desc: 'Handle massive NetCDF datasets with ease using our high-performance ingestion engine.' },
            { icon: 'thermostat',     title: 'Global Heatmaps',         desc: 'Visualize temperature anomalies and moisture distributions across the entire globe.' },
            { icon: 'timeline',       title: 'Time Series Analysis',    desc: 'Analyze historical trends and seasonal cycles with rolling means and anomaly detection.' },
            { icon: 'compare_arrows', title: 'Dataset Comparison',      desc: 'Compare multiple climate models and observational data sources side by side.' },
            { icon: 'auto_awesome',   title: 'AI Predictions',          desc: 'Leverage machine learning to project future climate scenarios and potential risks.' },
            { icon: 'menu_book',      title: 'Story Mode',              desc: 'Turn your data findings into compelling narratives for stakeholders and the public.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all">
              <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '32px' }}>{icon}</span>
              <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[36px] font-light text-slate-900 dark:text-white">Choose your plan</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4">Simple pricing for researchers of all levels.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-[900px] mx-auto">
            {/* Free Plan */}
            <div className="flex-1 p-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-[20px] font-bold text-slate-900 dark:text-white mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[48px] font-mono font-bold">$0</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                {['Up to 5GB Data Storage', 'Global Heatmap Viewer', 'Community Support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[14px] text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="w-full py-4 border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all block text-center">
                Get Started
              </Link>
            </div>
            {/* Researcher Pro */}
            <div className="flex-1 p-10 bg-white dark:bg-slate-900 rounded-2xl border-2 border-primary shadow-xl shadow-primary/5 relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
              <h3 className="text-[20px] font-bold text-slate-900 dark:text-white mb-2">Researcher Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-[48px] font-mono font-bold">$49</span>
                <span className="text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-10">
                {['Unlimited Data Storage', 'AI Trend Prediction Engine', 'Advanced Dataset Comparison', 'Priority Support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[14px] text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>{f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all block text-center">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
