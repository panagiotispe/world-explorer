import { useEffect, useState, useRef } from 'react';
import {
  fetchRegions,
  fetchChallengeCountries,
  fetchChallengeLeaderboard,
  submitChallengeScore,
} from '../services/api';
import type { ChallengeCountry, ChallengeScoreOut } from '../types/country';

type Phase = 'select' | 'playing' | 'done';

export default function ContinentChallenge() {
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [countries, setCountries] = useState<ChallengeCountry[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('select');
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState<ChallengeScoreOut[]>([]);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRegions()
      .then(setRegions)
      .catch(() => setError('Failed to load regions.'));
  }, []);

  const startChallenge = async () => {
    if (!selectedRegion) return;
    try {
      const data = await fetchChallengeCountries(selectedRegion);
      setCountries(data);
      setFound(new Set());
      setRevealed(false);
      setInput('');
      setSaved(false);
      setPhase('playing');
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setError('Failed to load challenge data.');
    }
  };

  const handleInput = (value: string) => {
    setInput(value);
    const trimmed = value.trim().toLowerCase();
    const match = countries.find(
      (c) => c.name.toLowerCase() === trimmed && !found.has(c.name)
    );
    if (match) {
      const next = new Set(found);
      next.add(match.name);
      setFound(next);
      setInput('');
      if (next.size === countries.length) {
        setPhase('done');
        fetchChallengeLeaderboard(selectedRegion).then(setLeaderboard).catch(() => {});
      }
    }
  };

  const handleGiveUp = () => {
    setRevealed(true);
    setPhase('done');
    fetchChallengeLeaderboard(selectedRegion).then(setLeaderboard).catch(() => {});
  };

  const handleSave = async () => {
    if (!playerName.trim()) return;
    try {
      await submitChallengeScore({
        player_name: playerName.trim(),
        region: selectedRegion,
        found_count: found.size,
        total_count: countries.length,
      });
      setSaved(true);
      const lb = await fetchChallengeLeaderboard(selectedRegion);
      setLeaderboard(lb);
    } catch {
      alert('Failed to save score.');
    }
  };

  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  if (phase === 'select') {
    return (
      <div className="max-w-sm mx-auto mt-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Continent Challenge</h1>
        <p className="text-slate-500 text-sm mb-8">Name every country in a continent from memory.</p>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white mb-4"
        >
          <option value="">Select a region…</option>
          {regions.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <button
          disabled={!selectedRegion}
          onClick={startChallenge}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start
        </button>
      </div>
    );
  }

  const pct = Math.round((found.size / countries.length) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">{selectedRegion}</h2>
        <span className="text-sm text-slate-500">{found.size} / {countries.length} found</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-3 mb-5">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {phase === 'playing' && (
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Type a country name…"
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleGiveUp}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Give Up
          </button>
        </div>
      )}

      {/* Country grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
        {countries.map((c) => {
          const isFound = found.has(c.name);
          const show = isFound || revealed;
          return (
            <div
              key={c.name}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
                isFound
                  ? 'bg-green-50 border-green-300 text-green-800'
                  : revealed
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-white border-slate-200 text-transparent'
              }`}
            >
              {show && (
                <img src={c.flag_url} alt="" className="w-6 h-4 object-cover rounded-sm shrink-0" />
              )}
              <span className={show ? '' : 'select-none'}>
                {show ? c.name : '—'}
              </span>
            </div>
          );
        })}
      </div>

      {phase === 'done' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="font-bold text-slate-900 text-lg mb-1">
            {found.size === countries.length ? '🎉 Complete!' : `You got ${found.size}/${countries.length}`}
          </h3>
          {!saved ? (
            <>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name (to save)"
                maxLength={50}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mt-3 mb-3"
              />
              <button
                onClick={handleSave}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Score
              </button>
            </>
          ) : (
            <p className="text-green-600 font-medium mt-2">Score saved!</p>
          )}
        </div>
      )}

      {leaderboard.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">Leaderboard — {selectedRegion}</h3>
          {leaderboard.map((entry, i) => (
            <div key={entry.id} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-0">
              <span className="text-slate-600">{i + 1}. {entry.player_name}</span>
              <span className="font-medium text-slate-900">{entry.found_count}/{entry.total_count}</span>
            </div>
          ))}
        </div>
      )}

      {phase === 'done' && (
        <button
          onClick={() => setPhase('select')}
          className="py-2 px-6 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
        >
          Pick Another Region
        </button>
      )}
    </div>
  );
}
