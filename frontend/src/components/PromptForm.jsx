import { useState } from 'react';

const EXAMPLES = [
  'Design a social media platform',
  'Design a real-time chat application',
  'Design a video streaming service',
  'Design an e-commerce marketplace',
];

export default function PromptForm({ onSubmit, disabled }) {
  const [prompt, setPrompt] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (prompt.trim()) onSubmit(prompt.trim());
  }

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <label htmlFor="prompt-input" className="prompt-label">What system would you like to design?</label>
      <textarea
        id="prompt-input"
        className="prompt-input"
        rows={3}
        placeholder="e.g. Design a social media platform that handles 10M daily active users..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={disabled}
      />
      <div className="prompt-actions">
        <div className="examples">
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" className="example-btn" disabled={disabled} onClick={() => { setPrompt(ex); onSubmit(ex); }}>
              {ex}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-primary" disabled={disabled || !prompt.trim()}>
          {disabled ? 'Generating...' : 'Generate Architecture'}
        </button>
      </div>
    </form>
  );
}
