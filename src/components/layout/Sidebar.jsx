import { useCurrency } from '../../context/CurrencyContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'register', label: 'Registrar', icon: 'M12 4v16m8-8H4' },
  { id: 'history', label: 'Historial', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];

function NavIcon({ path }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function Sidebar({ currentPage, onNavigate }) {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col min-h-screen fixed left-0 top-0 z-10">
      <div className="px-6 py-5 border-b border-slate-100">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-emerald-600">Scrap</span>
          <span className="text-amber-500">Metrics</span>
        </h1>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide uppercase">
          Analytics Platform
        </p>
      </div>

      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              currentPage === item.id
                ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <NavIcon path={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-2 px-1">
          Moneda
        </p>
        <button
          onClick={toggleCurrency}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50/50"
        >
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded transition-all ${
              currency === 'USD' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'
            }`}
          >
            USD
          </span>
          <span className="text-slate-300 text-xs">/</span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded transition-all ${
              currency === 'MXN' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'
            }`}
          >
            MXN
          </span>
        </button>
        <p className="text-[10px] text-slate-300 text-center mt-1.5">TC: $17.50</p>
      </div>
    </aside>
  );
}
