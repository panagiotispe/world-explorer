import { useEffect, useMemo, useState } from 'react';
import { fetchCountries } from '../services/api';
import type { Country } from '../types/country';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';
import RegionFilter from '../components/RegionFilter';

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');

  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .catch(() => setError('Failed to load countries. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(countries.map((c) => c.region).filter(Boolean))).sort(),
    [countries]
  );

  const filtered = useMemo(() => {
    let list = countries;
    if (region) list = list.filter((c) => c.region === region);
    if (search) list = list.filter((c) => c.name.common.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [countries, search, region]);

  if (loading) return <p className="text-center text-slate-500 mt-20">Loading countries…</p>;
  if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <SearchBar value={search} onChange={setSearch} />
        <RegionFilter regions={regions} value={region} onChange={setRegion} />
        <span className="text-sm text-slate-500 ml-auto">{filtered.length} countries</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((c) => (
          <CountryCard key={c.cca3} country={c} />
        ))}
      </div>
    </div>
  );
}
