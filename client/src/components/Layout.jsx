import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/resumes', label: 'Resumes' },
  { to: '/applications', label: 'Applications' },
  { to: '/job-descriptions', label: 'Job descriptions' },
  { to: '/interview', label: 'Interview prep' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-paper">
      <nav className="border-b border-line bg-white px-6 py-4 flex flex-wrap items-center justify-between gap-y-3">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <span className="font-semibold text-ink">StepWise</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
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