import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getFastmarketsHistory } from '../../data/mockFastmarkets';
import { useCurrency } from '../../context/CurrencyContext';

const materials = [
  { code: 'copper-berry', label: 'Cobre #1', color: '#d97706' },
  { code: 'copper-birch', label: 'Cobre #2', color: '#ea580c' },
  { code: 'aluminum-toto', label: 'Aluminio 6063', color: '#6366f1' },
  { code: 'steel-shred', label: 'Acero Shred', color: '#3b82f6' },
  { code: 'brass-honey', label: 'Bronce Yellow', color: '#10b981' },
  { code: 'ss-316', label: '316 SS', color: '#8b5cf6' },
];

export default function PriceTrends() {
  const [selected, setSelected] = useState(materials[0]);
  const { currency, convert } = useCurrency();
  const history = getFastmarketsHistory(selected.code);
  const data = history.map((d) => ({ date: d.date.slice(5), avg: Math.round(convert(d.avg) * 1000) / 1000, low: Math.round(convert(d.low) * 1000) / 1000, high: Math.round(convert(d.high) * 1000) / 1000 }));
  const prefix = currency === 'MXN' ? 'MX$' : '$';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const p = payload[0]?.payload;
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-slate-400">Low: <span className="text-slate-600 font-mono">{prefix}{p.low}</span></p>
        <p style={{ color: selected.color }}>Avg: <span className="font-mono font-bold">{prefix}{p.avg}</span></p>
        <p className="text-slate-400">High: <span className="text-slate-600 font-mono">{prefix}{p.high}</span></p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Precios Fastmarkets — 30 Días</h3>
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {materials.map((m) => (
          <button key={m.code} onClick={() => setSelected(m)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
              selected.code === m.code ? 'text-white border-transparent shadow-sm' : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`} style={selected.code === m.code ? { backgroundColor: m.color } : {}}>
            {m.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(v) => `${prefix}${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="avg" stroke={selected.color} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: selected.color, stroke: 'white', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
