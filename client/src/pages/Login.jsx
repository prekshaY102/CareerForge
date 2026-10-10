import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-ink mb-1">CareerForge</h1>
        <p className="text-muted text-sm mb-8">Log in to keep building your pipeline.</p>
        <form onSubmit={handleSubmit} className="border border-line rounded-sm p-6 bg-white">
          {error && <p className="text-sm text-red-700 mb-4">{error}</p>}
          <label className="block text-xs text-muted mb-1">Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 text-ink focus:outline-none focus:border-forge"
            required
          />
          <label className="block text-xs text-muted mb-1">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 mb-6 text-ink focus:outline-none focus:border-forge"
            required
          />
          <button type="submit" className="w-full bg-ink text-paper rounded-sm py-2.5 font-medium hover:bg-forge transition-colors">
            Log in
          </button>
        </form>
        <p className="text-sm text-muted mt-6">
          No account? <Link to="/register" className="text-forge font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}