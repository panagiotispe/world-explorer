import type {
  Country,
  QuizQuestion,
  QuizScoreCreate,
  QuizScoreOut,
  ChallengeCountry,
  ChallengeScoreCreate,
  ChallengeScoreOut,
} from '../types/country';

const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// Countries
export const fetchCountries = (search = '', region = '') => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (region) params.set('region', region);
  const qs = params.toString();
  return request<Country[]>(`/countries${qs ? `?${qs}` : ''}`);
};

export const fetchCountry = (cca3: string) =>
  request<Country>(`/countries/${cca3}`);

// Quiz
export const fetchQuizQuestions = (count = 10) =>
  request<QuizQuestion[]>(`/quiz/questions?count=${count}`);

export const submitQuizScore = (body: QuizScoreCreate) =>
  request<QuizScoreOut>('/quiz/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const fetchQuizLeaderboard = () =>
  request<QuizScoreOut[]>('/quiz/leaderboard');

// Challenge
export const fetchRegions = () => request<string[]>('/challenge/regions');

export const fetchChallengeCountries = (region: string) =>
  request<ChallengeCountry[]>(`/challenge/${encodeURIComponent(region)}`);

export const submitChallengeScore = (body: ChallengeScoreCreate) =>
  request<ChallengeScoreOut>('/challenge/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const fetchChallengeLeaderboard = (region: string) =>
  request<ChallengeScoreOut[]>(`/challenge/${encodeURIComponent(region)}/leaderboard`);
