import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/resumes', label: 'Resumes' },
  { to: '/applications', label: 'Applications' },
  { to: '/job-descriptions', label: 'Job descriptions' },
  { to: '/interview', label: 'Interview prep' },
];

const linkClass = ({ isActive }) =>
  `block whitespace-nowrap rounded-sm px-3 py-2 text-sm ${
    isActive ? 'bg-paper font-medium text-forge' : 'text-muted hover:text-ink'
  }`;

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden border-r border-line bg-white px-4 py-6 md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col">
        <Link to="/dashboard" className="mb-8 px-2"><Logo /></Link>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>{link.label}</NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-line px-2 pt-5">
          <p className="truncate text-sm text-ink">{user?.name || user?.email}</p>
          {user?.name && <p className="truncate text-xs text-muted">{user.email}</p>}
          <button onClick={logout} className="mt-3 text-sm text-muted hover:text-ember">Log out</button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b border-line bg-white md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link to="/dashboard"><Logo /></Link>
            <button onClick={logout} className="text-sm text-muted hover:text-ember">Log out</button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>{link.label}</NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl px-5 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}