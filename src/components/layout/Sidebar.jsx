import { useCurrency } from '../../context/CurrencyContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'buyers', label: 'Compradores', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'recommend', label: 'Recomendador', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { id: 'register', label: 'Registrar', icon: 'M12 4v16m8-8H4' },
  { id: 'history', label: 'Historial', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'settings', label: 'Configuración', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

function NavIcon({ path }) {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function Sidebar({ currentPage, onNavigate }) {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col min-h-screen fixed left-0 top-0 z-20">
      <div className="px-5 py-5 border-b border-slate-100">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-emerald-600">Scrap</span>
          <span className="text-amber-500">Metrics</span>
        </h1>
        <p className="text-[10px] text-slate-400 mt-0.5 font-medium tracking-widest uppercase">Analytics Platform</p>
      </div>

      <nav className="flex-1 px-3 pt-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
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

      <div className="px-4 py-3 border-t border-slate-100">
        <button
          onClick={toggleCurrency}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50/50"
        >
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${currency === 'USD' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}>USD</span>
          <span className="text-slate-300 text-[10px]">/</span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${currency === 'MXN' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400'}`}>MXN</span>
        </button>
      </div>
    </aside>
  );
}
