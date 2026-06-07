import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', username: '', password: '', role: 'admin', master_key: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', form);
      setSuccess(res.data.message);
      setTimeout(() => navigate('/khususorangdalam'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 font-['Inter']">
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-10 rounded-[2rem] shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl font-black tracking-tighter uppercase mb-2">KALREN</h1>
          <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase">Daftar Akun Tim</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'name', placeholder: 'Nama Lengkap', type: 'text' },
            { name: 'email', placeholder: 'Email', type: 'email' },
            { name: 'username', placeholder: 'Username', type: 'text' },
            { name: 'password', placeholder: 'Password', type: 'password' },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              required
              className="w-full bg-black border border-white/5 p-4 rounded-xl text-white text-sm outline-none focus:border-white/20"
            />
          ))}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full bg-black border border-white/5 p-4 rounded-xl text-white text-sm outline-none focus:border-white/20"
          >
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>

          <input
            type="password"
            name="master_key"
            placeholder="Kode Sakral (dari Owner)"
            value={form.master_key}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/5 p-4 rounded-xl text-white text-sm outline-none focus:border-white/20"
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center font-bold uppercase tracking-wide">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-xl text-center font-bold uppercase tracking-wide">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Mendaftarkan...' : 'Buat Akun'}
          </button>

          <p
            onClick={() => navigate('/khususorangdalam')}
            className="text-center text-gray-600 text-xs cursor-pointer hover:text-gray-400 transition-all pt-2"
          >
            Sudah punya akun? Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;