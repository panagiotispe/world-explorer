import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 h-14">
        <NavLink to="/" className="text-xl font-bold text-blue-600 mr-4">
          🌍 World Explorer
        </NavLink>
        <NavLink to="/" className={linkClass} end>
          Browse
        </NavLink>
        <NavLink to="/quiz" className={linkClass}>
          Flag Quiz
        </NavLink>
        <NavLink to="/challenge" className={linkClass}>
          Challenge
        </NavLink>
      </div>
    </nav>
  );
}
