import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Quiz from '../components/Quiz';
import { apiGet, apiPost } from '../api/aiService';
import { useAuth } from '../context/AuthContext';

function renderContent(text) {
  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'code', content: code.join('\n') });
      i++;
      continue;
    }

    if (line.startsWith('• ')) {
      const items = [];
      while (i < lines.length && lines[i].startsWith('• ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    if (line.startsWith('**') && line.endsWith('**')) {
      blocks.push({ type: 'heading', content: line.replace(/\*\*/g, '') });
      i++;
      continue;
    }

    if (line.trim() === '') { i++; continue; }

    blocks.push({ type: 'para', content: line });
    i++;
  }

  return blocks.map((b, idx) => {
    switch (b.type) {
      case 'code':
        return <pre key={idx} className="lesson-code"><code>{b.content}</code></pre>;
      case 'list':
        return <ul key={idx} className="lesson-list">{b.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}</ul>;
      case 'heading':
        return <h4 key={idx} className="lesson-subheading">{b.content}</h4>;
      case 'para':
        return <p key={idx} className="lesson-p">{renderInline(b.content)}</p>;
      default:
        return null;
    }
  });
}

function renderInline(text) {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return p;
  });
}

export default function LessonView() {
  const { moduleId, lessonId } = useParams();
  const { token } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      apiGet(`/learning/modules/${moduleId}`, token),
      apiGet(`/learning/modules/${moduleId}/lessons/${lessonId}`, token),
    ]).then(([modRes, lesRes]) => {
      if (modRes.success) setModule(modRes.data);
      if (lesRes.success) { setLesson(lesRes.data); setCompleted(lesRes.data.completed); }
      else setError(lesRes.error);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [moduleId, lessonId, token]);

  async function handleQuizComplete(correct, total) {
    const score = Math.round((correct / total) * 100);
    await apiPost('/learning/complete', { lessonId, quizScore: score }, token);
    setCompleted(true);
  }

  if (loading) return <Layout><Header title="Loading..." /><div className="content"><div className="loading"><div className="spinner" /></div></div></Layout>;
  if (error) return <Layout><Header title="Error" /><div className="content"><div className="toast toast-error">{error}<br /><Link to="/dashboard/learn" className="btn btn-secondary" style={{marginTop:'0.5rem'}}>Back to Learning</Link></div></div></Layout>;

  const lessonIdx = module?.lessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = lessonIdx > 0 ? module.lessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx >= 0 && lessonIdx < (module?.lessons?.length ?? 1) - 1 ? module.lessons[lessonIdx + 1] : null;

  return (
    <Layout>
      <Header title={lesson?.title || 'Lesson'} />
      <div className="content lesson-content">
        <div className="lesson-breadcrumb">
          <Link to="/dashboard/learn">← {module?.title || 'Back to Modules'}</Link>
        </div>

        <h2 className="lesson-title">{lesson?.title}</h2>

        <div className="lesson-body">
          {lesson?.content && renderContent(lesson.content)}
        </div>

        {lesson?.takeaways && lesson.takeaways.length > 0 && (
          <div className="lesson-takeaways">
            <h4>Key Takeaways</h4>
            <ul>
              {lesson.takeaways.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        )}

        {lesson?.quiz && lesson.quiz.length > 0 && (
          <Quiz questions={lesson.quiz} onComplete={handleQuizComplete} />
        )}

        {completed && (
          <div className="lesson-complete-badge">✓ Lesson Completed</div>
        )}

        <div className="lesson-nav">
          {prevLesson ? (
            <Link to={`/dashboard/learn/${moduleId}/${prevLesson.id}`} className="btn btn-secondary">← {prevLesson.title}</Link>
          ) : <div />}
          {nextLesson ? (
            <Link to={`/dashboard/learn/${moduleId}/${nextLesson.id}`} className="btn btn-primary">{nextLesson.title} →</Link>
          ) : (
            <Link to="/dashboard/learn" className="btn btn-primary">Back to Modules →</Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
