import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import ArchitectureResult from '../components/ArchitectureResult';
import CodeReferences from '../components/CodeReferences';
import { apiGet } from '../api/aiService';
import { useAuth } from '../context/AuthContext';

export default function ArchitectureDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!token) return;
    apiGet(`/history/${id}`, token).then((res) => {
      if (res.success) setData(res.data);
      else setError(res.error);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return (
    <Layout><Header title="Loading..." /><div className="content"><div className="loading"><div className="spinner" /><p>Loading...</p></div></div></Layout>
  );

  if (error) return (
    <Layout><Header title="Error" /><div className="content"><div className="toast toast-error">{error}<br /><Link to="/dashboard/history" className="btn btn-secondary" style={{marginTop:'0.5rem',display:'inline-block'}}>Back to History</Link></div></div></Layout>
  );

  return (
    <Layout>
      <Header title={data?.title || 'Architecture Detail'} />
      <div className="content">
        <div className="tab-bar">
          <button className={`tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>Overview</button>
          <button className={`tab ${tab === 'code' ? 'active' : ''}`} onClick={() => setTab('code')}>Code & References</button>
        </div>

        {tab === 'overview' && data?.data && (
          <>
            <div className="back-link">
              <Link to="/dashboard/history">← Back to History</Link>
            </div>
            <ArchitectureResult data={data.data} codeDocs={data.codeDocs} />
          </>
        )}

        {tab === 'code' && data?.data && (
          <>
            <div className="back-link">
              <Link to="/dashboard/history">← Back to History</Link>
            </div>
            {data.codeDocs ? (
              <ArchitectureResult data={data.data} codeDocs={data.codeDocs} />
            ) : (
              <CodeReferences architecture={data.data} />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
