import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin, signup as apiSignup } from '../services/api';

const SignInSignUp = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [role, setRole] = useState('public');   // 'public' | 'researcher'

  // Sign-In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign-Up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) { setError('Please fill all fields.'); return; }
    try {
      setLoading(true);
      const data = await apiLogin(loginEmail, loginPassword);
      saveAuth(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!signupName || !signupEmail || !signupPassword) { setError('Please fill all fields.'); return; }
    try {
      setLoading(true);
      const data = await apiSignup(signupName, signupEmail, signupPassword, role);
      saveAuth(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] w-full">
      {/* Left Panel: Branding */}
      <div className="lg:w-1/2 bg-[#0F172A] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-24">
            <div className="w-8 h-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">PyClimaExplorer</span>
          </div>
          <h1 className="text-white text-[36px] font-light leading-tight mb-8 max-w-md">
            Climate data, beautifully understood.
          </h1>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary bg-primary/20 rounded-full p-1 text-sm">check</span>
              <p className="text-slate-300 text-lg">Advanced climate analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary bg-primary/20 rounded-full p-1 text-sm">check</span>
              <p className="text-slate-300 text-lg">Interactive data visualization</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary bg-primary/20 rounded-full p-1 text-sm">check</span>
              <p className="text-slate-300 text-lg">Global historical datasets</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 pt-12">
          <p className="text-slate-400 text-sm">© 2026 PyClimaExplorer. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel: Forms */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px]">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-8">
            <button
              id="signin-tab"
              onClick={() => { setIsSignIn(true); setError(''); }}
              className={`flex-1 pb-4 text-sm font-semibold border-b-2 ${isSignIn ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Sign In
            </button>
            <button
              id="signup-tab"
              onClick={() => { setIsSignIn(false); setError(''); }}
              className={`flex-1 pb-4 text-sm font-semibold border-b-2 ${!isSignIn ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          {isSignIn ? (
            <form className="space-y-6" onSubmit={handleLogin} id="login-form">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="name@company.com"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700" htmlFor="login-password">Password</label>
                  <Link to="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
                </div>
                <input
                  id="login-password"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Continue'}
              </button>
              <p className="text-center text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => { setIsSignIn(false); setError(''); }} className="text-primary font-medium hover:underline">Sign up</button>
              </p>
            </form>
          ) : (
            // Sign Up Form
            <form className="space-y-5" onSubmit={handleSignup} id="signup-form">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="signup-name">Full Name</label>
                <input
                  id="signup-name"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-primary"
                  placeholder="John Doe"
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-primary"
                  placeholder="john@example.com"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  className="w-full h-12 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <div className="flex gap-3">
                  <button
                    id="role-public"
                    type="button"
                    onClick={() => setRole('public')}
                    className={`flex-1 py-2 px-4 rounded-full border text-sm font-medium transition-all ${role === 'public' ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-600 hover:border-primary'}`}
                  >
                    Public User
                  </button>
                  <button
                    id="role-researcher"
                    type="button"
                    onClick={() => setRole('researcher')}
                    className={`flex-1 py-2 px-4 rounded-full border text-sm font-medium transition-all ${role === 'researcher' ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-600 hover:border-primary'}`}
                  >
                    Researcher
                  </button>
                </div>
              </div>
              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          <div className="mt-8 flex justify-center gap-6">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" type="button">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
            </button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors" type="button">
              <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
