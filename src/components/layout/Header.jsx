import { getLastSyncTime } from '../../data/mockFastmarkets';

export default function Header({ title, subtitle }) {
  const syncTime = getLastSyncTime();
  const syncStr = syncTime.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="text-right">
        <p className="text-[11px] text-slate-400">María García — Directora Comercial</p>
        <div className="flex items-center gap-1.5 justify-end mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-600 font-medium">Fastmarkets sync {syncStr}</span>
        </div>
      </div>
    </header>
  );
}
