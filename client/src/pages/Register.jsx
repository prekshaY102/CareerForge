import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-ink mb-1">Create your account</h1>
        <p className="text-muted text-sm mb-8">Start building your career pipeline.</p>
        <form onSubmit={handleSubmit} className="border border-line rounded-sm p-6 bg-white">
          {error && <p className="text-sm text-red-700 mb-4">{error}</p>}
          <label className="block text-xs text-muted mb-1">Name</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 text-ink focus:outline-none focus:border-forge"
          />
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
            Create account
          </button>
        </form>
        <p className="text-sm text-muted mt-6">
          Already have an account? <Link to="/login" className="text-forge font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}