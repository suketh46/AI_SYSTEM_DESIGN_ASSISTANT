import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import { apiGet, apiDel } from '../api/aiService';
import { useAuth } from '../context/AuthContext';

export default function History() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function fetchHistory() {
    if (!token) return;
    setLoading(true);
    apiGet('/history', token).then((res) => {
      if (res.success) setItems(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { fetchHistory(); }, [token]);

  async function handleDelete(id) {
    if (!confirm('Delete this architecture?')) return;
    const res = await apiDel(`/history/${id}`, token);
    if (res.success) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <Layout>
      <Header title="Design History" />
      <div className="content">
        {loading && <div className="loading"><div className="spinner" /><p>Loading...</p></div>}

        {!loading && items.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">☰</div>
            <h3>No designs yet</h3>
            <p>Your generated architectures will appear here.</p>
            <Link to="/dashboard/new" className="btn btn-primary">Create Design</Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="history-list">
            {items.map((item) => (
              <div key={item.id} className="history-item">
                <Link to={`/dashboard/architecture/${item.id}`} className="history-link">
                  <div className="history-icon">◆</div>
                  <div className="history-info">
                    <span className="history-title">{item.title}</span>
                    <span className="history-prompt">{item.prompt}</span>
                    <span className="history-date">{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </Link>
                <button className="btn-icon delete-btn" onClick={() => handleDelete(item.id)} title="Delete">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
