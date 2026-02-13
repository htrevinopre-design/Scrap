export default function Header({ title, subtitle }) {
  const now = new Date();
  const timeStr = now.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="text-right">
        <p className="text-xs text-slate-400 capitalize">{timeStr}</p>
        <div className="flex items-center gap-1.5 justify-end mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-emerald-600 font-medium">Datos en vivo</span>
        </div>
      </div>
    </header>
  );
}
