import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-line bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <span className="font-semibold text-ink">CareerForge</span>
          <div className="flex gap-5">
            {links.map((link) => (
              <Link
                key={link.to} to={link.to}
                className={`text-sm ${location.pathname === link.to ? 'text-forge font-medium' : 'text-muted hover:text-ink'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">{user?.name || user?.email}</span>
          <button onClick={logout} className="text-sm text-muted hover:text-ember">Log out</button>
        </div>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  );
}