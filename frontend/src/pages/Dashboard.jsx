import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { apiGet } from '../api/aiService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { token, user } = useAuth();
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  useEffect(() => {
    if (!token) return;
    apiGet('/history', token).then((res) => {
      if (res.success) {
        setRecent(res.data.slice(0, 5));
        setStats({
          total: res.data.length,
          today: res.data.filter((a) => new Date(a.createdAt).toDateString() === new Date().toDateString()).length,
        });
      }
    }).catch(() => {});
  }, [token]);

  return (
    <Layout>
      <Header title="Dashboard" />
      <div className="content">
        <div className="welcome-card">
          <h3>Welcome back, {user?.name}!How can I help you?</h3>
          <p>Describe a system and get a complete architecture design with interactive diagrams, code references, and best practices.</p>
          <Link to="/dashboard/new" className="btn btn-primary">New Architecture Design</Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Designs</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.today}</span>
            <span className="stat-label">Designed Today</span>
          </div>
        </div>

        {recent.length > 0 && (
          <section>
            <h3 className="section-title">Recent Designs</h3>
            <div className="recent-list">
              {recent.map((arch) => (
                <Link key={arch.id} to={`/dashboard/architecture/${arch.id}`} className="recent-item">
                  <div className="recent-icon">◆</div>
                  <div className="recent-info">
                    <span className="recent-title">{arch.title}</span>
                    <span className="recent-prompt">{arch.prompt}</span>
                  </div>
                  <span className="recent-date">{new Date(arch.createdAt).toLocaleDateString()}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {recent.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">◆</div>
            <h3>No designs yet</h3>
            <p>Create your first architecture design to see it here.</p>
            <Link to="/dashboard/new" className="btn btn-primary">Create Design</Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
