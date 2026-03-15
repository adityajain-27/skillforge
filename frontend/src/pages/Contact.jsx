import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to a real backend endpoint or EmailJS
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full bg-white dark:bg-slate-950 min-h-screen">

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">Get In Touch</p>
          <h1 className="text-[44px] font-light text-slate-900 dark:text-white mb-4 leading-tight">
            We'd love to <span className="font-semibold text-primary">hear from you</span>
          </h1>
          <p className="text-[16px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Whether you're a researcher, student, journalist, or an institution — reach out with questions,
            feedback, collaboration proposals, or dataset requests.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-16">

          {/* Left — contact info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: 'mail', label: 'Email', value: 'contact@cli-lens.io', href: 'mailto:contact@cli-lens.io' },
                  { icon: 'location_on', label: 'Location', value: 'IIT (BHU), Varanasi\nUttar Pradesh, India — 221005', href: null },
                  { icon: 'schedule', label: 'Response Time', value: 'Within 24 hours on weekdays', href: null },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-[14px] text-primary font-medium hover:underline">{value}</a>
                      ) : (
                        <p className="text-[14px] text-slate-700 dark:text-slate-300 font-medium whitespace-pre-line">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-[15px]">Common Topics</h3>
              <ul className="space-y-2 text-[13px] text-slate-500 dark:text-slate-400">
                {[
                  'Dataset upload issues or format support',
                  'API access or programmatic integrations',
                  'Research collaboration or internship',
                  'Institutional or academic licensing',
                  'Feature requests and bug reports',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">check_small</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                💡 For technical issues, please include your browser version, the dataset filename, and steps to reproduce the problem. This helps us respond much faster.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-green-500 text-[40px]">check_circle</span>
                </div>
                <h2 className="text-[26px] font-semibold text-slate-900 dark:text-white mb-3">Message Sent!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-[15px] mb-8 max-w-[400px]">
                  Thanks for reaching out, <strong>{form.name}</strong>. We'll get back to you at <strong>{form.email}</strong> within 24 hours.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                    className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Send Another
                  </button>
                  <Link to="/" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors">
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-[20px] font-semibold text-slate-900 dark:text-white mb-6">Send a Message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Name *</label>
                    <input
                      required name="name" type="text" value={form.name} onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Email *</label>
                    <input
                      required name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Subject *</label>
                  <input
                    required name="subject" type="text" value={form.subject} onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Message *</label>
                  <textarea
                    required name="message" rows={6} value={form.message} onChange={handleChange}
                    placeholder="Tell us more about your question, dataset issue, or collaboration idea..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Message
                </button>

                <p className="text-center text-[12px] text-slate-400">
                  We'll respond within 24 hours. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom strip */}
      <section className="py-12 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-[14px] text-slate-500 dark:text-slate-400">
            Prefer to browse first?{' '}
            <Link to="/about" className="text-primary font-semibold hover:underline">Learn about Cli-Lens</Link>
            {' '}or{' '}
            <Link to="/dashboard" className="text-primary font-semibold hover:underline">jump straight to the dashboard</Link>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
