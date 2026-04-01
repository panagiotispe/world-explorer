import { useState } from 'react';
import type { Country } from '../types/country';

interface Props {
  country: Country;
}

export default function CountryCard({ country }: Props) {
  const [expanded, setExpanded] = useState(false);

  const fmt = (n: number) => n.toLocaleString();
  const capital = country.capital?.[0] ?? '—';
  const languages = Object.values(country.languages ?? {}).join(', ') || '—';
  const currencies = Object.values(country.currencies ?? {})
    .map((c) => `${c.name} (${c.symbol})`)
    .join(', ') || '—';

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setExpanded((p) => !p)}
    >
      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        className="w-full h-36 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1">
          {country.name.common}
        </h3>
        <p className="text-xs text-slate-500 mb-2">{country.region}{country.subregion ? ` · ${country.subregion}` : ''}</p>
        <div className="text-sm text-slate-700 space-y-0.5">
          <p><span className="text-slate-500">Capital:</span> {capital}</p>
          <p><span className="text-slate-500">Population:</span> {fmt(country.population)}</p>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-700 space-y-0.5">
            <p><span className="text-slate-500">Official name:</span> {country.name.official}</p>
            <p><span className="text-slate-500">Area:</span> {fmt(country.area)} km²</p>
            <p><span className="text-slate-500">Languages:</span> {languages}</p>
            <p><span className="text-slate-500">Currencies:</span> {currencies}</p>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">{expanded ? 'Click to collapse ▲' : 'Click for details ▼'}</p>
      </div>
    </div>
  );
}
