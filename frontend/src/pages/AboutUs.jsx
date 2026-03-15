import React from 'react';
import { Link } from 'react-router-dom';

const team = [
  {
    name: 'Aditya Jain',
    role: 'Lead Developer & ML Engineer',
    affiliation: 'IIT (BHU) Varanasi',
    avatar: 'AJ',
    color: 'from-blue-500 to-indigo-600',
  },
];

const stats = [
  { value: '150+', label: 'Datasets Processed' },
  { value: '12', label: 'Climate Variables Supported' },
  { value: '40+', label: 'Countries Covered' },
  { value: '99.9%', label: 'Platform Uptime' },
];

const values = [
  {
    icon: 'science',
    title: 'Science-First',
    desc: 'Every feature is designed around real researcher workflows. We obsess over data accuracy, methodological correctness, and reproducible analysis.',
  },
  {
    icon: 'public',
    title: 'Open & Transparent',
    desc: 'We use open data standards — NetCDF, CF Conventions, CMIP6 — and publish our analysis methodology publicly so any researcher can verify our results.',
  },
  {
    icon: 'groups',
    title: 'Community Driven',
    desc: 'Our roadmap is shaped by climate scientists, students, and policymakers who use the platform. Feature requests from the community are prioritized.',
  },
  {
    icon: 'bolt',
    title: 'Performance Obsessed',
    desc: 'We use Python + NumPy/xarray under the hood for all analysis, ensuring results are computed as fast as the hardware allows on even multi-GB datasets.',
  },
  {
    icon: 'lock',
    title: 'Secure & Private',
    desc: 'Your datasets are stored securely and are never shared. Authentication is JWT-based and all API routes are protected by role-based access control.',
  },
  {
    icon: 'auto_awesome',
    title: 'AI-Augmented',
    desc: 'Linear regression trend engines and anomaly detection algorithms run on every dataset, giving researchers automated statistical insights on demand.',
  },
];

const AboutUs = () => {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 min-h-screen">

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[900px] mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">About Cli-Lens</p>
          <h1 className="text-[48px] font-light text-slate-900 dark:text-white leading-tight mb-6">
            Making climate science <br className="hidden md:block" />
            <span className="font-semibold text-primary">accessible to everyone</span>
          </h1>
          <p className="text-[17px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[680px] mx-auto">
            Cli-Lens was born out of a simple frustration: climate data — some of the most
            important data on Earth — is locked behind complex file formats and niche tooling that
            only experts can use. We're here to change that.
          </p>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">The Problem</p>
            <h2 className="text-[32px] font-light text-slate-900 dark:text-white mb-6 leading-snug">
              Climate data is crucial, yet impossible to work with for most people
            </h2>
            <div className="space-y-4 text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <p>
                NOAA, NASA, ERA5, CMIP6 — the world's most important climate datasets are stored in
                NetCDF format, a binary format that requires programming knowledge (Python, NCO,
                CDO) to open, process, or visualize. There is no "open in browser" option.
              </p>
              <p>
                This means that journalists, policymakers, students, and even domain scientists from
                adjacent fields are locked out of the raw data entirely, forced to rely on
                pre-processed summaries from intermediaries.
              </p>
              <p>
                The result: climate communication suffers, research bottlenecks form, and critical
                data-driven decisions get delayed.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { icon: 'upload_file', title: 'Upload NetCDF Directly', desc: 'Just drag-and-drop any .nc file. Our backend parses variables, coordinates, and metadata automatically.' },
              { icon: 'thermostat', title: 'Instant Global Heatmaps', desc: 'Spatial data visualized as interactive Plotly heatmaps and 3D globe views within seconds of upload.' },
              { icon: 'timeline', title: 'Trend Analysis, Out of the Box', desc: 'Time-series trend lines, rolling means, and 2σ anomaly detection — no coding required.' },
              { icon: 'compare_arrows', title: 'Multi-Dataset Comparison', desc: 'Compare two datasets spatially, view the absolute difference map, and export the comparison as a report.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">{icon}</span>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-[15px]">{title}</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-primary">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-[44px] font-mono font-bold text-white">{value}</p>
              <p className="text-[13px] text-blue-200 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">Under The Hood</p>
            <h2 className="text-[32px] font-light text-slate-900 dark:text-white">Built on proven, open-source technology</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React + Vite', role: 'Frontend Framework', icon: 'web' },
              { name: 'Node.js + Express', role: 'Backend API', icon: 'dns' },
              { name: 'Python + xarray', role: 'Scientific Computation', icon: 'calculate' },
              { name: 'MongoDB', role: 'Dataset & User Storage', icon: 'storage' },
              { name: 'Plotly.js', role: 'Interactive Visualizations', icon: 'bar_chart' },
              { name: 'NumPy / SciPy', role: 'Trend & Statistics Engine', icon: 'analytics' },
              { name: 'JWT Auth', role: 'Secure Authentication', icon: 'lock' },
              { name: 'NetCDF4 / CF', role: 'Climate Data Standards', icon: 'layers' },
            ].map(({ name, role, icon }) => (
              <div key={name} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                <span className="material-symbols-outlined text-primary text-[28px] mb-3 block">{icon}</span>
                <p className="font-bold text-slate-900 dark:text-white text-[14px]">{name}</p>
                <p className="text-[12px] text-slate-400 mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">Our Principles</p>
            <h2 className="text-[32px] font-light text-slate-900 dark:text-white">What we stand for</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl transition-all">
                <span className="material-symbols-outlined text-primary text-[32px] mb-4 block">{icon}</span>
                <h3 className="text-[18px] font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-[700px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">The Team</p>
            <h2 className="text-[32px] font-light text-slate-900 dark:text-white mb-4">Behind Cli-Lens</h2>
            <p className="text-slate-500 dark:text-slate-400 text-[15px]">
              Currently a solo project developed at IIT (BHU) Varanasi, with plans to grow the
              team as the platform scales. Built entirely from scratch — backend, ML pipeline,
              frontend, and data engineering.
            </p>
          </div>
          <div className="flex justify-center">
            {team.map(({ name, role, affiliation, avatar, color }) => (
              <div key={name} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-8 text-center shadow-sm w-72">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                  {avatar}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-[18px]">{name}</h3>
                <p className="text-primary text-[13px] font-semibold mt-1">{role}</p>
                <p className="text-slate-400 text-[12px] mt-1">{affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-[32px] font-light text-white mb-4">Ready to explore your climate data?</h2>
          <p className="text-blue-200 text-[16px] mb-8">Join researchers and students already using Cli-Lens.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/login" className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:shadow-xl transition-all">
              Get Started Free
            </Link>
            <Link to="/contact" className="border border-white/40 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
