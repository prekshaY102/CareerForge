import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-ink">Welcome, {user?.name || user?.email}</h1>
        <button onClick={logout} className="text-sm text-muted hover:text-ember">Log out</button>
      </div>
      <p className="text-muted">Profile, resumes, and applications land here next.</p>
    </div>
  );
}