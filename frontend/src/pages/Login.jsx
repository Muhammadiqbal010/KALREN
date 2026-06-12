import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, fetchCurrentUser } = useAuth();

  // State modal lupa password
  const [showReset, setShowReset] = useState(false);
  const [resetForm, setResetForm] = useState({ email: '', new_password: '', master_key: '' });
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

// Login.jsx — useEffect cek token dari localStorage
useEffect(() => {
  const token = localStorage.getItem('kalren_token');
  if (token) {
    navigate('/admin');
  }
}, [navigate]);

// Login.jsx — simpan token ke localStorage setelah login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/api/auth/login', {
        email: username.trim(),
        password
      });

      if (res.data?.success) {
        // Simpan token & user ke localStorage
        if (res.data.access_token) {
          localStorage.setItem('kalren_token', res.data.access_token);
        }
        if (res.data.user) {
          localStorage.setItem('kalren_user', JSON.stringify(res.data.user));
          setUser(res.data.user); // ← langsung set user, tidak perlu tunggu fetch
        }
        navigate('/admin');
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail[0]?.msg : detail || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetError(''); setResetSuccess(''); setResetLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', resetForm);
      setResetSuccess(res.data.message);
      setTimeout(() => { setShowReset(false); setResetForm({ email: '', new_password: '', master_key: '' }); }, 2500);
    } catch (err) {
      setResetError(err.response?.data?.detail || 'Gagal reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 font-['Inter']">
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-10 rounded-[2rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-white text-4xl font-black tracking-tighter uppercase mb-2">KALREN</h1>
          <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase">Internal Access Only</p>
        </div>

        {!showReset ? (
          // ─── FORM LOGIN ───
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="email" placeholder="Enter Registered Email"
              value={username} onChange={(e) => setUsername(e.target.value)}
              required autoComplete="email"
              className="w-full bg-black border border-white/5 p-4 rounded-xl text-white text-sm outline-none focus:border-white/20"
            />
            <input
              type="password" placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required autoComplete="current-password"
              className="w-full bg-black border border-white/5 p-4 rounded-xl text-white text-sm outline-none focus:border-white/20"
            />
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center font-bold uppercase tracking-wide">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 cursor-pointer">
              {loading ? 'Authenticating...' : 'Unlock Dashboard'}
            </button>
            <p onClick={() => setShowReset(true)}
              className="text-center text-gray-600 text-xs cursor-pointer hover:text-gray-400 transition-all">
              Lupa Password?
            </p>
          </form>
        ) : (
          // ─── FORM RESET PASSWORD ───
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-gray-400 text-xs text-center mb-2 uppercase tracking-widest">Reset Password</p>
            <input
              type="email" placeholder="Email Terdaftar"
              value={resetForm.email} onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
              required
              className="w-full bg-black border border-white/5 p-4 rounded-xl text-white text-sm outline-none focus:border-white/20"
            />
            <input
              type="password" placeholder="Password Baru"
              value={resetForm.new_password} onChange={(e) => setResetForm({ ...resetForm, new_password: e.target.value })}
              required
              className="w-full bg-black border border-white/5 p-4 rounded-xl text-white text-sm outline-none focus:border-white/20"
            />
            <input
              type="password" placeholder="Kode Sakral (dari Owner)"
              value={resetForm.master_key} onChange={(e) => setResetForm({ ...resetForm, master_key: e.target.value })}
              required
              className="w-full bg-black border border-white/5 p-4 rounded-xl text-white text-sm outline-none focus:border-white/20"
            />
            {resetError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center font-bold uppercase tracking-wide">
                {resetError}
              </div>
            )}
            {resetSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-xl text-center font-bold uppercase tracking-wide">
                {resetSuccess}
              </div>
            )}
            <button type="submit" disabled={resetLoading}
              className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 cursor-pointer">
              {resetLoading ? 'Memproses...' : 'Ganti Password'}
            </button>
            <p onClick={() => { setShowReset(false); setResetError(''); setResetSuccess(''); }}
              className="text-center text-gray-600 text-xs cursor-pointer hover:text-gray-400 transition-all">
              ← Kembali ke Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;