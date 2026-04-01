interface Props {
  regions: string[];
  value: string;
  onChange: (v: string) => void;
}

export default function RegionFilter({ regions, value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
    >
      <option value="">All regions</option>
      {regions.map((r) => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  );
}
