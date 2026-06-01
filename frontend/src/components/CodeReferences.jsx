import { useState } from 'react';
import { apiPost } from '../api/aiService';
import { useAuth } from '../context/AuthContext';

export default function CodeReferences({ architecture }) {
  const { token } = useAuth();
  const [codeData, setCodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost('/ai/generate-code', { architecture }, token);
      if (res.success) setCodeData(res.data);
      else setError(res.error);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="code-refs">
      {!codeData && !loading && (
        <div className="code-refs-cta">
          <p>Generate Docker Compose, Terraform snippets, and GitHub repo references for this architecture.</p>
          <button className="btn btn-primary" onClick={handleGenerate}>Generate Code & References</button>
        </div>
      )}

      {loading && <div className="loading"><div className="spinner" /><p>Generating code references...</p></div>}
      {error && <div className="toast toast-error">{error}</div>}

      {codeData && (
        <div className="code-refs-content">
          <h4>Deployment</h4>
          {codeData.deployment && <pre className="code-block"><code>{codeData.deployment}</code></pre>}

          <h4>Docker Compose</h4>
          {codeData.docker ? <pre className="code-block"><code>{codeData.docker}</code></pre> : <p className="muted">Not generated</p>}

          <h4>Terraform / IaC</h4>
          {codeData.terraform ? <pre className="code-block"><code>{codeData.terraform}</code></pre> : <p className="muted">Not generated</p>}

          {codeData.githubRepos?.length > 0 && (
            <>
              <h4>GitHub Repositories</h4>
              <div className="repo-list">
                {codeData.githubRepos.map((r, i) => (
                  <div key={i} className="repo-card">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="repo-name">{r.name}</a>
                    <p className="repo-desc">{r.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {codeData.tools?.length > 0 && (
            <>
              <h4>Recommended Tools</h4>
              <ul className="tool-list">
                {codeData.tools.map((t, i) => (
                  <li key={i}><strong>{t.name}</strong> — {t.description}</li>
                ))}
              </ul>
            </>
          )}

          {codeData.bestPractices?.length > 0 && (
            <>
              <h4>Best Practices</h4>
              <ul className="bp-list">
                {codeData.bestPractices.map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </>
          )}

          <button className="btn btn-secondary" onClick={() => setCodeData(null)} style={{ marginTop: '1rem' }}>Regenerate</button>
        </div>
      )}
    </div>
  );
}
