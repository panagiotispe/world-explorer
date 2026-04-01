import { useEffect, useState } from 'react';
import { fetchQuizQuestions, fetchQuizLeaderboard, submitQuizScore } from '../services/api';
import type { QuizQuestion, QuizScoreOut } from '../types/country';

type Phase = 'loading' | 'playing' | 'finished' | 'error';

export default function FlagQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState<QuizScoreOut[]>([]);

  const loadQuestions = async () => {
    setPhase('loading');
    setScore(0);
    setCurrent(0);
    setSelected(null);
    setSaved(false);
    try {
      const qs = await fetchQuizQuestions(10);
      setQuestions(qs);
      setPhase('playing');
    } catch {
      setPhase('error');
    }
  };

  useEffect(() => { loadQuestions(); }, []);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === questions[current].answer;
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      const next = current + 1;
      if (next >= questions.length) {
        setPhase('finished');
        fetchQuizLeaderboard().then(setLeaderboard).catch(() => {});
      } else {
        setCurrent(next);
        setSelected(null);
      }
    }, 1000);
  };

  const handleSave = async () => {
    if (!playerName.trim()) return;
    try {
      await submitQuizScore({ player_name: playerName.trim(), score, total: questions.length });
      setSaved(true);
      const lb = await fetchQuizLeaderboard();
      setLeaderboard(lb);
    } catch {
      alert('Failed to save score.');
    }
  };

  if (phase === 'loading') return <p className="text-center text-slate-500 mt-20">Generating quiz…</p>;
  if (phase === 'error') return <p className="text-center text-red-500 mt-20">Failed to load quiz. Is the backend running?</p>;

  if (phase === 'finished') {
    return (
      <div className="max-w-lg mx-auto text-center mt-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Quiz Complete!</h1>
        <p className="text-2xl text-blue-600 font-semibold mb-6">
          {score} / {questions.length}
        </p>

        {!saved ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <p className="text-sm text-slate-600 mb-3">Save your score to the leaderboard</p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
            />
            <button
              onClick={handleSave}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Save Score
            </button>
          </div>
        ) : (
          <p className="text-green-600 font-medium mb-6">Score saved!</p>
        )}

        {leaderboard.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 text-left">
            <h2 className="font-semibold text-slate-800 mb-3">Leaderboard</h2>
            {leaderboard.map((entry, i) => (
              <div key={entry.id} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                <span className="text-slate-600">{i + 1}. {entry.player_name}</span>
                <span className="font-medium text-slate-900">{entry.score}/{entry.total}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={loadQuestions}
          className="py-2 px-6 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="flex justify-between text-sm text-slate-500 mb-4">
        <span>Question {current + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <img
          src={q.flag_url}
          alt="Flag — which country?"
          className="w-full h-56 object-cover"
        />
      </div>

      <p className="text-center text-slate-700 font-medium mb-4">Which country does this flag belong to?</p>

      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt) => {
          let cls = 'py-3 px-4 rounded-xl border text-sm font-medium transition-colors text-center ';
          if (!selected) {
            cls += 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer';
          } else if (opt === q.answer) {
            cls += 'border-green-500 bg-green-50 text-green-800';
          } else if (opt === selected) {
            cls += 'border-red-400 bg-red-50 text-red-700';
          } else {
            cls += 'border-slate-200 bg-slate-50 text-slate-400';
          }
          return (
            <button key={opt} className={cls} onClick={() => handleSelect(opt)} disabled={!!selected}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
