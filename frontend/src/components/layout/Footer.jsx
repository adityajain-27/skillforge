import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 text-white mb-6">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>public</span>
            <span className="text-[16px] font-bold">Cli-Lens</span>
          </div>
          <p className="text-[14px] leading-relaxed">
            Advancing global climate intelligence through powerful open-source visualization and machine learning.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-white font-bold text-[14px] mb-6">Platform</h4>
          <ul className="space-y-3 text-[14px]">
            <li><Link to="/login"             className="hover:text-primary transition-colors">Get Started</Link></li>
            <li><Link to="/dashboard"         className="hover:text-primary transition-colors">Dashboard</Link></li>
            <li><Link to="/dashboard/upload"  className="hover:text-primary transition-colors">Upload Dataset</Link></li>
            <li><Link to="/dashboard/compare" className="hover:text-primary transition-colors">Compare Datasets</Link></li>
          </ul>
        </div>

        {/* Tools */}
        <div>
          <h4 className="text-white font-bold text-[14px] mb-6">Tools</h4>
          <ul className="space-y-3 text-[14px]">
            <li><Link to="/dashboard/predictions" className="hover:text-primary transition-colors">Climate Predictions</Link></li>
            <li><Link to="/dashboard/stories"     className="hover:text-primary transition-colors">Story Mode</Link></li>
            <li><Link to="/dashboard/news"        className="hover:text-primary transition-colors">Climate News</Link></li>
            <li><Link to="/dashboard/reports"     className="hover:text-primary transition-colors">Reports</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-bold text-[14px] mb-6">Company</h4>
          <ul className="space-y-3 text-[14px]">
            <li><Link to="/about"   className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li>
              <a
                href="https://github.com/adityajain-27/Cli-Lens"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1200px] mx-auto border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[12px]">© 2026 Cli-Lens · Built at IIT (BHU) Varanasi</p>
        <div className="flex gap-6 text-[12px]">
          <Link to="/about"   className="hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link to="/login"   className="hover:text-white transition-colors">Sign In</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
