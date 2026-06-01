import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import PromptForm from '../components/PromptForm';
import ArchitectureResult from '../components/ArchitectureResult';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateArchitecture, apiPost } from '../api/aiService';
import { useAuth } from '../context/AuthContext';

export default function NewDesign() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [codeDocs, setCodeDocs] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handlePrompt(prompt) {
    setLoading(true);
    setError(null);
    setResult(null);
    setCodeDocs(null);
    try {
      const response = await generateArchitecture(prompt);
      if (response.success) {
        setResult(response.data);
        setCodeDocs(response.codeDocs);
        if (token) {
          const payload = { prompt, title: response.data.title, data: response.data, codeDocs: response.codeDocs };
          apiPost('/history', payload, token).catch(() => {});
        }
      } else {
        setError(response.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Header title="New Architecture Design" />
      <div className="content">
        <PromptForm onSubmit={handlePrompt} disabled={loading} />
        {loading && <LoadingSpinner />}
        {error && <div className="toast toast-error">{error}</div>}
        {result && <ArchitectureResult data={result} codeDocs={codeDocs} />}
      </div>
    </Layout>
  );
}
