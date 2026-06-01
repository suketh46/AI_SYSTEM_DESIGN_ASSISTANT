import { useState, useEffect } from 'react';
import { apiGet } from '../api/aiService';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Header from '../components/Header';

function ExerciseView({ exercise, onBack }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function checkFillBlank() {
    const val = answer.toLowerCase();
    const match = exercise.expectedKeywords.some((kw) => val.includes(kw.toLowerCase()));
    if (match) setFeedback({ ok: true, msg: 'Correct! Great answer.' });
    else setFeedback({ ok: false, msg: `Not quite. Hint: ${exercise.hints?.[0] || 'Try thinking about the component\'s purpose'}` });
  }

  function checkMultipleChoice(idx) {
    setRevealed(true);
    if (idx === exercise.correct) setFeedback({ ok: true, msg: 'Correct! ' + (exercise.explanation || '') });
    else setFeedback({ ok: false, msg: exercise.explanation || 'Not quite, try again.' });
  }

  function checkOrdering() {
    const userOrder = answer.split('\n').map((s) => s.trim()).filter(Boolean);
    const correct = exercise.correctOrder.join('|').toLowerCase();
    const user = userOrder.join('|').toLowerCase();
    if (user === correct) setFeedback({ ok: true, msg: 'Perfect order! You understand the request flow.' });
    else setFeedback({ ok: false, msg: `Not quite. Expected: ${exercise.correctOrder.join(' → ')}` });
  }

  function reset() {
    setAnswer('');
    setFeedback(null);
    setRevealed(false);
  }

  const hasItems = !!exercise.items;
  const hasOptions = !!exercise.options;

  return (
    <div className="playground-exercise">
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>← Back to Exercises</button>
      <h3>{exercise.title}</h3>
      <p className="exercise-instruction">{exercise.instruction}</p>

      {exercise.template && (
        <div className="exercise-section">
          <pre className="code-block template-block"><code>{exercise.template}</code></pre>
          <textarea
            className="exercise-input"
            rows={4}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button className="btn btn-primary" onClick={checkFillBlank} disabled={!answer.trim()}>Check Answer</button>
        </div>
      )}

      {hasOptions && (
        <div className="exercise-section">
          <div className="quiz-options">
            {exercise.options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option ${revealed ? (i === exercise.correct ? 'correct' : (feedback && !feedback.ok && answer === i ? 'wrong' : '')) : ''}`}
                onClick={() => { setAnswer(i); checkMultipleChoice(i); }}
                disabled={revealed}
              >
                <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {hasItems && (
        <div className="exercise-section">
          <p className="exercise-hint">Enter each item on a new line, in the correct order:</p>
          <p className="exercise-items-hint">{exercise.items.join(', ')}</p>
          <textarea
            className="exercise-input"
            rows={exercise.items.length + 1}
            placeholder={`${exercise.items[0]}\n${exercise.items[1]}\n...`}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button className="btn btn-primary" onClick={checkOrdering} disabled={!answer.trim()}>Check Order</button>
        </div>
      )}

      {exercise.hints && !feedback && (
        <div className="exercise-hints">
          <p className="hints-label">Hints:</p>
          <ul>{exercise.hints.map((h, i) => <li key={i}>{h}</li>)}</ul>
        </div>
      )}

      {feedback && (
        <div className={`exercise-feedback ${feedback.ok ? 'correct' : 'wrong'}`}>
          <p>{feedback.ok ? '✓' : '✕'} {feedback.msg}</p>
          <button className="btn btn-secondary" onClick={reset} style={{ marginTop: '0.5rem' }}>Try Again</button>
        </div>
      )}
    </div>
  );
}

export default function CodingPlayground() {
  const { token } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiGet('/learning/playground', token).then((res) => { if (res.success) setExercises(res.data); }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Layout><Header title="Coding Playground" /><div className="content"><div className="loading"><div className="spinner" /></div></div></Layout>;

  if (selected) {
    return (
      <Layout>
        <Header title={selected.title} />
        <div className="content"><ExerciseView exercise={selected} onBack={() => setSelected(null)} /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="Coding Playground" />
      <div className="content">
        <p className="template-intro">Practice your skills with interactive exercises. Fill in blanks, order components, and test your knowledge.</p>
        <div className="template-grid">
          {exercises.map((ex) => (
            <button key={ex.id} className="template-card-btn" onClick={() => setSelected(ex)}>
              <h3>{ex.title}</h3>
              <p>{ex.instruction}</p>
              <div className="template-card-footer">
                <span className="template-count">{ex.options ? 'Multiple Choice' : ex.items ? 'Ordering' : ex.template ? 'Fill in the Blank' : 'Exercise'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
