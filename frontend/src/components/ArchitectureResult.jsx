import ArchitectureDiagram from './ArchitectureDiagram';

function Section({ title, items, renderItem, count }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="section">
      <h3 className="section-title">{title} <span className="count-badge">{count || items.length}</span></h3>
      <div className="card-grid">
        {items.map((item, i) => (
          <div key={i} className="card">{renderItem(item)}</div>
        ))}
      </div>
    </section>
  );
}

function CodeBlock({ label, code }) {
  if (!code) return null;
  return (
    <>
      <h4 className="code-label">{label}</h4>
      <pre className="code-block"><code>{code}</code></pre>
    </>
  );
}

export default function ArchitectureResult({ data, codeDocs }) {
  return (
    <div className="result">
      <h2 className="result-title">{data.title}</h2>
      <p className="overview">{data.overview}</p>

      <ArchitectureDiagram nodes={data.diagramNodes} edges={data.diagramEdges} />

      <div className="tabbed-sections">
        <Section title="Components" items={data.components} renderItem={(c) => (
          <><strong>{c.name}</strong><span className="badge">{c.type}</span><p>{c.description}</p></>
        )} />

        <Section title="Databases" items={data.databases} renderItem={(d) => (
          <><strong>{d.name}</strong><span className="badge">{d.type}</span>{d.technology && <span className="badge tech">{d.technology}</span>}<p>{d.description}</p></>
        )} />

        <Section title="Communication" items={data.communication} renderItem={(c) => (
          <><strong>{c.method}</strong><p className="between">{c.between?.join('  →  ')}</p><p>{c.description}</p></>
        )} />

        <Section title="Scalability" items={data.scalability} renderItem={(s) => (
          <><strong>{s.strategy}</strong>{s.component && <span className="badge">{s.component}</span>}<p>{s.description}</p></>
        )} />
      </div>

      {codeDocs && (
        <div className="code-docs-section">
          <h3 className="section-title">Code, Documentation & References</h3>

          <CodeBlock label="Deployment Guide" code={codeDocs.deployment} />
          <CodeBlock label="Docker Compose" code={codeDocs.docker} />
          <CodeBlock label="Terraform / IaC" code={codeDocs.terraform} />
          <CodeBlock label="API Documentation" code={codeDocs.apiDocs} />
          <CodeBlock label="Setup Guide" code={codeDocs.setupGuide} />
          <CodeBlock label="Architecture Decision Record" code={codeDocs.architecture} />

          {codeDocs.githubRepos?.length > 0 && (
            <>
              <h4 className="code-label">GitHub Repositories</h4>
              <div className="repo-list">
                {codeDocs.githubRepos.map((r, i) => (
                  <div key={i} className="repo-card">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="repo-name">{r.name}</a>
                    <p className="repo-desc">{r.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {codeDocs.references?.length > 0 && (
            <>
              <h4 className="code-label">Documentation & References</h4>
              <div className="repo-list">
                {codeDocs.references.map((r, i) => (
                  <div key={i} className="repo-card">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="repo-name">{r.title}</a>
                    <p className="repo-desc">{r.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {codeDocs.tools?.length > 0 && (
            <>
              <h4 className="code-label">Recommended Tools</h4>
              <ul className="tool-list">
                {codeDocs.tools.map((t, i) => (
                  <li key={i}><strong>{t.name}</strong> — {t.description}</li>
                ))}
              </ul>
            </>
          )}

          {codeDocs.bestPractices?.length > 0 && (
            <>
              <h4 className="code-label">Best Practices</h4>
              <ul className="bp-list">
                {codeDocs.bestPractices.map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
