import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mainLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '◉' },
  { to: '/dashboard/new', label: 'New Design', icon: '＋' },
  { to: '/dashboard/history', label: 'History', icon: '☰' },
];

const learnLinks = [
  { to: '/dashboard/learn', label: 'Learning Hub', icon: '📘' },
  { to: '/dashboard/templates', label: 'Templates', icon: '◆' },
  { to: '/dashboard/playground', label: 'Playground', icon: '⌘' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">◆</span>
        <span className="sidebar-title">SystemDesign AI</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Main</div>
        {mainLinks.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="sidebar-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
        <div className="sidebar-nav-label" style={{ marginTop: '0.75rem' }}>Learn</div>
        {learnLinks.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === '/dashboard/learn'} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="sidebar-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.[0] || '?'}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name || 'User'}</span>
            <span className="sidebar-user-email">{user?.email || ''}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
