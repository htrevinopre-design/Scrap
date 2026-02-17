export default function FastmarketsConfig() {
  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-500 font-mono';
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Conexión Fastmarkets</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">API Endpoint</label>
          <input type="text" value="https://api.fastmarkets.com/v2/prices" readOnly className={inputCls} />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">API Key</label>
          <input type="password" value="fm_live_xxxxxxxxxxxxxxxxxxx" readOnly className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Región principal</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600">
              <option>US Midwest</option><option>US East Coast</option><option>Mexico</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Frecuencia de sync</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600">
              <option>Cada 5 minutos</option><option>Cada 15 minutos</option><option>Cada hora</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">Conexión activa — Última sync: hace 5 min</span>
        </div>
      </div>
    </div>
  );
}
