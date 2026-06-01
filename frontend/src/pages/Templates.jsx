import { useState, useEffect } from 'react';
import { apiGet } from '../api/aiService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Header from '../components/Header';
import ArchitectureTemplateDiagram from '../components/ArchitectureTemplateDiagram';

const DIFFICULTY_COLORS = { beginner: '#22c55e', intermediate: '#e67e22', advanced: '#ef4444' };

function TemplateDetail({ template, onBack }) {
  if (!template) return null;
  return (
    <div className="template-detail">
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>← Back to Templates</button>
      <h2>{template.name}</h2>
      <span className="template-diff" style={{ color: DIFFICULTY_COLORS[template.difficulty] }}>{template.difficulty}</span>
      <p className="template-desc">{template.description}</p>

      <div className="template-info-grid">
        <div className="template-info-card">
          <strong>Use Case</strong>
          <p>{template.useCase}</p>
        </div>
        <div className="template-info-card">
          <strong>When to Use</strong>
          <p>{template.whenToUse}</p>
        </div>
        <div className="template-info-card">
          <strong>Key Considerations</strong>
          <p>{template.considerations}</p>
        </div>
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Architecture Diagram</h4>
      <div className="diagram-container">
        <ArchitectureTemplateDiagram nodes={template.nodes} edges={template.edges} />
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Components</h4>
      <div className="card-grid">
        {template.nodes.map((n) => (
          <div key={n.id} className="card">
            <strong>{n.label}</strong>
            <span className="badge">{n.type}</span>
            <span className="badge tech">{n.group}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Templates() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiGet('/learning/templates', token).then((res) => { if (res.success) setTemplates(res.data); }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Layout><Header title="Architecture Templates" /><div className="content"><div className="loading"><div className="spinner" /></div></div></Layout>;

  if (selected) {
    return (
      <Layout>
        <Header title={selected.name} />
        <div className="content"><TemplateDetail template={selected} onBack={() => setSelected(null)} /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Architecture Templates" />
      <div className="content">
        <p className="template-intro">Pre-built architecture templates for common patterns. Click any template to see the full diagram and details.</p>
        <div className="template-grid">
          {templates.map((t) => (
            <button key={t.id} className="template-card-btn" onClick={() => setSelected(t)}>
              <div className="template-card-header">
                <h3>{t.name}</h3>
                <span className="template-diff" style={{ color: DIFFICULTY_COLORS[t.difficulty] }}>{t.difficulty}</span>
              </div>
              <p>{t.description}</p>
              <div className="template-card-footer">
                <span className="template-count">{t.nodes.length} components</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
