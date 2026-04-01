export interface CountryName {
  common: string;
  official: string;
}

export interface CountryFlags {
  svg: string;
  png: string;
}

export interface Country {
  cca3: string;
  cca2: string;
  name: CountryName;
  flags: CountryFlags;
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  area: number;
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
  latlng: number[];
}

export interface QuizQuestion {
  country_code: string;
  flag_url: string;
  options: string[];
  answer: string;
}

export interface QuizScoreCreate {
  player_name: string;
  score: number;
  total: number;
}

export interface QuizScoreOut extends QuizScoreCreate {
  id: number;
  created_at: string;
}

export interface ChallengeCountry {
  name: string;
  flag_url: string;
}

export interface ChallengeScoreCreate {
  player_name: string;
  region: string;
  found_count: number;
  total_count: number;
}

export interface ChallengeScoreOut extends ChallengeScoreCreate {
  id: number;
  created_at: string;
}
