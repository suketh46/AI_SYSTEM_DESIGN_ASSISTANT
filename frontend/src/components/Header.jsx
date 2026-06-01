import { useAuth } from '../context/AuthContext';

export default function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="header-bar">
      <h2 className="header-title">{title}</h2>
      <div className="header-right">
        <span className="header-email">{user?.email}</span>
        <div className="header-avatar">{user?.name?.[0] || '?'}</div>
      </div>
    </header>
  );
}
