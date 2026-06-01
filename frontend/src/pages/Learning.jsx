import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { apiGet } from '../api/aiService';
import { useAuth } from '../context/AuthContext';

const DIFFICULTY_COLORS = { beginner: '#22c55e', intermediate: '#e67e22', advanced: '#ef4444' };

export default function Learning() {
  const { token } = useAuth();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      apiGet('/learning/modules', token),
      apiGet('/learning/progress', token),
    ]).then(([modRes, progRes]) => {
      if (modRes.success) setModules(modRes.data);
      if (progRes.success) setProgress(progRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  return (
    <Layout>
      <Header title="Learning Hub" />
      <div className="content">
        <div className="learn-hero">
          <h2>Learn System Design from Scratch</h2>
          <p>No experience needed. Start with the basics and work your way up to designing real-world architectures.</p>
        </div>

        {progress && (
          <ProgressBar
            value={progress.completedCount}
            max={progress.totalLessons}
            label="Overall Progress"
          />
        )}

        {loading && <div className="loading"><div className="spinner" /><p>Loading modules...</p></div>}

        <div className="module-list">
          {modules.map((mod, idx) => (
            <div key={mod.id} className="module-card">
              <div className="module-number">{String(idx + 1).padStart(2, '0')}</div>
              <div className="module-body">
                <div className="module-header">
                  <h3 className="module-title">{mod.title}</h3>
                  <span className="module-meta">
                    <span className="module-diff" style={{ color: DIFFICULTY_COLORS[mod.difficulty] }}>{mod.difficulty}</span>
                    <span className="module-time">~{mod.estimatedMinutes} min</span>
                  </span>
                </div>
                <p className="module-desc">{mod.description}</p>
                <div className="module-lessons">
                  {mod.lessons.map((lesson) => (
                    <Link key={lesson.id} to={`/dashboard/learn/${mod.id}/${lesson.id}`} className="module-lesson-link">
                      <span className={`lesson-dot ${progress?.completedLessons?.includes(lesson.id) ? 'done' : ''}`} />
                      <span>{lesson.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="learn-extra-links">
          <Link to="/dashboard/templates" className="learn-extra-card">
            <span className="learn-extra-icon">◆</span>
            <div>
              <h4>Architecture Templates</h4>
              <p>Pre-built templates for common patterns</p>
            </div>
          </Link>
          <Link to="/dashboard/playground" className="learn-extra-card">
            <span className="learn-extra-icon">⌘</span>
            <div>
              <h4>Coding Playground</h4>
              <p>Practice with interactive exercises</p>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
