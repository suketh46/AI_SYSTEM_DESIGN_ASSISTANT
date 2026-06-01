import { useState } from 'react';

export default function Quiz({ questions, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function select(questionIdx, optionIdx) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  }

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);
    const correct = questions.filter((q, i) => answers[i] === q.correct).length;
    if (onComplete) onComplete(correct, questions.length);
  }

  const allAnswered = questions.every((_, i) => typeof answers[i] === 'number');
  const correctCount = submitted ? questions.filter((q, i) => answers[i] === q.correct).length : 0;

  if (!questions || questions.length === 0) return null;

  return (
    <div className="quiz">
      <h4 className="quiz-title">Check Your Understanding</h4>
      {questions.map((q, qi) => (
        <div key={qi} className={`quiz-question ${submitted ? 'quiz-submitted' : ''}`}>
          <p className="quiz-q-text">{qi + 1}. {q.question}</p>
          <div className="quiz-options">
            {q.options.map((opt, oi) => {
              let cls = 'quiz-option';
              if (submitted) {
                if (oi === q.correct) cls += ' correct';
                else if (oi === answers[qi] && oi !== q.correct) cls += ' wrong';
              } else if (answers[qi] === oi) {
                cls += ' selected';
              }
              return (
                <button key={oi} className={cls} onClick={() => select(qi, oi)} disabled={submitted}>
                  <span className="quiz-option-letter">{String.fromCharCode(65 + oi)}</span>
                  <span>{opt}</span>
                  {submitted && oi === q.correct && <span className="quiz-icon">✓</span>}
                  {submitted && oi === answers[qi] && oi !== q.correct && <span className="quiz-icon">✕</span>}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="quiz-explanation">{q.explanation}</p>
          )}
        </div>
      ))}
      {!submitted && (
        <button className="btn btn-primary" onClick={handleSubmit} disabled={!allAnswered}>
          Submit Answers
        </button>
      )}
      {submitted && (
        <div className="quiz-score">
          Score: {correctCount}/{questions.length} ({Math.round((correctCount / questions.length) * 100)}%)
        </div>
      )}
    </div>
  );
}
