import React, { useState } from 'react';

const ComponentSheet = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-4xl">architecture</span>
            <h1 className="text-4xl font-black tracking-tight font-mono">Cli-Lens <span className="text-primary">UI_KIT</span></h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Design System & Component Library for Climate Research Analytics</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-6">
            <nav className="flex flex-col gap-2 sticky top-6">
              <a className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-bold" href="#buttons">Buttons & Actions</a>
              <a className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400" href="#inputs">Inputs & Selection</a>
              <a className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400" href="#cards">Data & Content Cards</a>
              <a className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400" href="#collaboration">Collaboration Tools</a>
              <a className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400" href="#modals">Modals & Overlays</a>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-20">
            {/* Buttons Section */}
            <section id="buttons">
              <h2 className="text-2xl font-bold mb-6 font-mono border-l-4 border-primary pl-4">01. Buttons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col gap-4">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">send</span> Primary Action
                  </button>
                  <button className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-6 py-3 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">
                    Secondary Action
                  </button>
                  <button className="bg-transparent border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-6 py-3 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    Ghost Button
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <button className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-6 py-3 rounded-lg font-bold hover:bg-red-500/20 transition-all">
                    Danger Action
                  </button>
                  <button className="bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 px-6 py-3 rounded-lg font-bold cursor-not-allowed" disabled>
                    Disabled State
                  </button>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-xs font-bold uppercase font-mono">Public</span>
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase font-mono">Researcher Pro</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Inputs Section */}
            <section id="inputs">
              <h2 className="text-2xl font-bold mb-6 font-mono border-l-4 border-primary pl-4">02. Form Elements</h2>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase font-mono">Default Input</label>
                    <input className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Enter dataset ID..." type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase font-mono">Focus State</label>
                    <input className="w-full bg-slate-50 dark:bg-slate-800 border-primary ring-2 ring-primary/20 rounded-lg px-4 py-3 outline-none" type="text" defaultValue="Active interaction" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-red-500 uppercase font-mono">Error State</label>
                    <input className="w-full bg-red-50 dark:bg-red-900/10 border-red-500 border rounded-lg px-4 py-3 outline-none text-red-500" type="text" defaultValue="Invalid format" />
                    <p className="text-xs text-red-500 font-medium">Please enter a valid climate model identifier.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase font-mono">Dropdown</label>
                    <div className="relative">
                      <select className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-slate-100">
                        <option>Select Region</option>
                        <option>North America</option>
                        <option>European Union</option>
                        <option>Asia-Pacific</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-3.5 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cards Section */}
            <section id="cards">
              <h2 className="text-2xl font-bold mb-6 font-mono border-l-4 border-primary pl-4">03. Information Displays</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <span className="material-symbols-outlined text-primary">thermostat</span>
                    </div>
                    <span className="text-green-500 text-xs font-bold">+2.4% ↑</span>
                  </div>
                  <h3 className="text-slate-500 text-sm font-medium">Mean Temperature</h3>
                  <p className="text-3xl font-black mt-1 font-mono">14.85°C</p>
                </div>

                {/* News Card */}
                <div className="md:col-span-2 flex bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="w-1/3 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDK5bIN9R-fS0qQBOsWBRcNz8YdSAaMeJ3VllKO-Cqhp3KWHLYg9JzURsXkTLw2L1yfJEM9wvhUR9Y4ZPBn6TGEh8YSLMLpO5a6cH1AuCJew78-KJe5HoKdXt9LYpjpPy5mkubP0Fl5SdfLusOB4V7wwTInV-pTRv8XrmaLnLNFiiptwV9X4o4vfnFWn_Jz1X28IO8VUlC3HLHHpUlr8TIh53OxWgW_1cAUtDalmuQ8juu3Uj2Iea77cID-Q7JJ4yXmX5_EUCM-zmY')" }}></div>
                  <div className="w-2/3 p-6 flex flex-col justify-center">
                    <div className="flex gap-2 mb-2">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold uppercase text-slate-600 dark:text-slate-300">Report</span>
                      <span className="text-[10px] text-slate-400 font-medium">12 mins ago</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2 leading-tight">Glacier Retreat Study 2024: New Findings Released</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">Latest satellite telemetry indicates a 15% acceleration in ice shelf thinning across West Antarctica...</p>
                  </div>
                </div>

                {/* Story Card */}
                <div className="md:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 shrink-0 overflow-hidden">
                    <img className="w-full h-full object-cover" alt="Portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9CuoWO_JrwLJMm_T1yM3QXRTR_6p7Zhf_nmBIfYD5KZvC5pH-4YwVTjtgNkr9ANu59SKjLzaFu55bf0h70cLlzyAXbwWV6BbON24MvkVJDv34J5x2l1WwkW1eEiWWuU2-bq1vMyquA5s_PiSof22TzliiItNm4EQ9ZT7OkNhIX1kxT1R2A_8DxDH54vYuZ4u3eOl1uab2iiHaR2YYj2Qyg05KAs0PpaMLR6E6yvj9Rh_jzwzdD1fxauxFpFznicyVqsLVZo-geQs" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <span className="material-symbols-outlined text-primary/40 text-4xl mb-2">format_quote</span>
                    <p className="text-xl italic text-slate-700 dark:text-slate-300 leading-relaxed">"The Cli-Lens tool transformed how we process MODIS data. What used to take weeks now takes minutes, allowing us to focus on policy implications rather than ETL."</p>
                    <div className="mt-4">
                      <p className="font-bold font-mono text-primary">Dr. Marcus Vane</p>
                      <p className="text-sm text-slate-500">Chief Hydrologist, Arctic Alliance</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Collaboration Section */}
            <section id="collaboration">
              <h2 className="text-2xl font-bold mb-6 font-mono border-l-4 border-primary pl-4">04. Collaboration Layer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Sticky Notes */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Annotate & Note</h3>
                  <div className="relative h-64 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-4">
                    <div className="absolute top-8 left-8 w-48 bg-yellow-100 dark:bg-yellow-200 text-slate-800 p-4 shadow-lg -rotate-2 rounded-sm hover:rotate-0 hover:scale-105 transition-all cursor-move z-10">
                      <div className="flex justify-between mb-2">
                        <span className="text-[10px] font-bold font-mono">08/14/24</span>
                        <span className="text-[10px] font-bold bg-slate-800 text-white px-1 rounded">JD</span>
                      </div>
                      <p className="text-sm leading-snug">Check the variance in the 2022 outlier. Seems high compared to ESA data.</p>
                    </div>
                    <div className="absolute bottom-8 right-8 w-44 bg-blue-100 dark:bg-blue-200 text-slate-800 p-4 shadow-lg rotate-3 rounded-sm hover:rotate-0 transition-all cursor-move z-20">
                      <p className="text-sm leading-snug">Dataset approved for public release.</p>
                      <div className="mt-2 text-right">
                        <span className="text-[10px] font-bold font-mono">— AM</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comment Thread */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Activity Feed</h3>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex gap-3">
                        <img className="w-10 h-10 rounded-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb1xTlQJkPPSGc_XlwN2ZlCBMdYSWn8wo9rRdtYJGjsEWYvpIF5rxM_rr8DAjjXjZC8B6xiuNdXGGljQPV7ndLDGQjWt6fU3Q4SQMAT3yd_0Gp6Dh0ZfQad-38RBe1uBVVQGkQz_YP1xc_jOU2bBYA9kHysElYi_Gs0W5CDYL2IepgmNOdYNtUD8xtYzEvS5sVUFeXCtHKr8sOsFFkBJFfR70c-7y_Qlmz-_WqgNLXpBJieZWNNsETMV2RQOaom5ETYMzCewR4r4Q" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h5 className="font-bold text-sm">Elena Rodriguez</h5>
                            <span className="text-xs text-slate-400">2h ago</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">I've updated the normalization script for the North Sea dataset. Can someone review the Python notebook?</p>
                          <div className="mt-3 flex gap-4">
                            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                              <span className="material-symbols-outlined text-sm">reply</span> Reply
                            </button>
                            <button className="text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200">
                              <span className="material-symbols-outlined text-sm">favorite</span> Like
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30">
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">SY</div>
                        <input className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Write a reply..." type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Modals Section */}
            <section id="modals">
              <h2 className="text-2xl font-bold mb-6 font-mono border-l-4 border-primary pl-4">05. Dialogs</h2>
              
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="mb-6 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Open Share Modal
              </button>

              <div className="relative bg-slate-100 dark:bg-slate-800/50 p-6 md:p-12 rounded-2xl flex items-center justify-center min-h-[400px]">
                {/* Embedded visually, or we can use the state. Let's just render it inline for the component sheet representation */}
                <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative z-10">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 relative z-20">
                    <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white">Share Dataset</h3>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-6 bg-white dark:bg-slate-900">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase font-mono">Invite Collaborators</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none text-sm focus:border-primary" placeholder="researcher@university.edu" type="email" />
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 shrink-0 h-[42px]">
                          <button className="px-3 py-1 bg-white dark:bg-slate-700 shadow-sm rounded-md text-xs font-bold text-slate-800 dark:text-white">Viewer</button>
                          <button className="px-3 py-1 text-slate-500 text-xs font-bold hover:text-slate-700 dark:hover:text-slate-300">Editor</button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase font-mono">People with access</label>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">JD</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Jane Doe (You)</p>
                            <p className="text-xs text-slate-500">Owner</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img className="w-8 h-8 rounded-full object-cover shrink-0" alt="Prof" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX468fbQbMD-Iqp_NQCXP5wtjb3SDLXs5ZbmHoBF9RnTG0fpnzFNMQfxIHB2wJmogU7IhUibKiPvOKKfEewzvkSII8NcZB5U76q0VCOz2eQNv6KvDxeatVhjYwxljo218YMN2aRhMiLBb0NvP893DnmOIGyUKVH8tvKFz-Iekg4aemrEOnD1sUdaGSqXRl1PgDjMnPkzMBCCz7BFoE_dSjBhnwU9dwLhv2HkEb0YgpvAwYU2mU3AmPXuAvmO33unotbEECL5I-b_0" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Prof. Alan Turing</p>
                            <p className="text-xs text-slate-500">Editor</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-slate-600">expand_more</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/80 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                    <button className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">link</span> Copy Link
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors">Send Invite</button>
                  </div>
                </div>

                {/* Actual modal rendering if standard modal is open */}
                {isShareModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 relative z-20">
                      <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white">Share Dataset</h3>
                      <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                    <div className="p-6 space-y-6 bg-white dark:bg-slate-900">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase font-mono">Invite Collaborators</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none text-sm focus:border-primary" placeholder="researcher@university.edu" type="email" />
                          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 shrink-0 h-[42px]">
                            <button className="px-3 py-1 bg-white dark:bg-slate-700 shadow-sm rounded-md text-xs font-bold text-slate-800 dark:text-white">Viewer</button>
                            <button className="px-3 py-1 text-slate-500 text-xs font-bold hover:text-slate-700 dark:hover:text-slate-300">Editor</button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase font-mono">People with access</label>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">JD</div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">Jane Doe (You)</p>
                              <p className="text-xs text-slate-500">Owner</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img className="w-8 h-8 rounded-full object-cover shrink-0" alt="Prof" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX468fbQbMD-Iqp_NQCXP5wtjb3SDLXs5ZbmHoBF9RnTG0fpnzFNMQfxIHB2wJmogU7IhUibKiPvOKKfEewzvkSII8NcZB5U76q0VCOz2eQNv6KvDxeatVhjYwxljo218YMN2aRhMiLBb0NvP893DnmOIGyUKVH8tvKFz-Iekg4aemrEOnD1sUdaGSqXRl1PgDjMnPkzMBCCz7BFoE_dSjBhnwU9dwLhv2HkEb0YgpvAwYU2mU3AmPXuAvmO33unotbEECL5I-b_0" />
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">Prof. Alan Turing</p>
                              <p className="text-xs text-slate-500">Editor</p>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-slate-400 text-sm cursor-pointer hover:text-slate-600">expand_more</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/80 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                      <button className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">link</span> Copy Link
                      </button>
                      <button onClick={() => setIsShareModalOpen(false)} className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors">Send Invite</button>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </section>
          </main>
        </div>

        <footer className="mt-32 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
          <div className="flex items-center gap-2 font-mono font-bold">
            <span className="material-symbols-outlined text-primary">cloud</span> Cli-Lens System v2.0.4
          </div>
          <div className="flex gap-8 text-sm">
            <Link className="hover:text-primary transition-colors" to="/components">Documentation</Link>
            <Link className="hover:text-primary transition-colors" to="/components">API Reference</Link>
            <a className="hover:text-primary transition-colors" href="https://github.com/your-username/cli-lens" target="_blank" rel="noopener noreferrer">Github</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ComponentSheet;
