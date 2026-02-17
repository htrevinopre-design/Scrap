import { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../../context/DataContext';
import { getScoreColor } from '../../utils/buyerScoring';
import { formatWeight, formatPercent } from '../../utils/formatters';

const colors = ['#10b981', '#f59e0b', '#6366f1'];

export default function BuyerComparison() {
  const { scoredBuyers } = useData();
  const [selected, setSelected] = useState([scoredBuyers[0]?.id, scoredBuyers[1]?.id].filter(Boolean));

  const toggleBuyer = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const selectedBuyers = selected.map((id) => scoredBuyers.find((b) => b.id === id)).filter(Boolean);
  const radarData = ['Precio', 'Pago', 'Volumen', 'Confiab.', 'Frecuencia'].map((metric) => {
    const key = { Precio: 'price', Pago: 'paymentSpeed', Volumen: 'volume', 'Confiab.': 'reliability', Frecuencia: 'frequency' }[metric];
    const entry = { metric };
    selectedBuyers.forEach((b, i) => { entry[`buyer${i}`] = b.scoreBreakdown[key]; });
    return entry;
  });

  const metrics = [
    { label: 'Score Total', fn: (b) => b.score, format: (v) => v, color: (v) => getScoreColor(v).text },
    { label: 'Precio vs Mkt', fn: (b) => b.stats.avgPriceVsMarket * 100, format: (v) => formatPercent(v), color: (v) => v >= 0 ? 'text-emerald-600' : 'text-red-500' },
    { label: 'Días Pago', fn: (b) => b.stats.avgDaysToPayment, format: (v) => `${v}d`, color: (v) => v <= 20 ? 'text-emerald-600' : v <= 40 ? 'text-amber-600' : 'text-red-500' },
    { label: 'Volumen Total', fn: (b) => b.stats.totalVolumeLbs, format: (v) => formatWeight(v), color: () => 'text-slate-600' },
    { label: 'Confiabilidad', fn: (b) => b.stats.reliability * 100, format: (v) => `${v.toFixed(0)}%`, color: (v) => v >= 90 ? 'text-emerald-600' : v >= 75 ? 'text-amber-600' : 'text-red-500' },
    { label: 'Transacciones', fn: (b) => b.stats.totalTransactions, format: (v) => v, color: () => 'text-slate-600' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Selecciona 2-3 compradores</h3>
        <div className="flex flex-wrap gap-2">
          {scoredBuyers.map((b) => {
            const isSelected = selected.includes(b.id);
            const idx = selected.indexOf(b.id);
            return (
              <button key={b.id} onClick={() => toggleBuyer(b.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${isSelected ? 'border-transparent text-white shadow-sm' : 'border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                style={isSelected ? { backgroundColor: colors[idx] } : {}}>
                {b.name} ({b.score})
              </button>
            );
          })}
        </div>
      </div>

      {selectedBuyers.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Comparación Visual</h4>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} />
                {selectedBuyers.map((_, i) => (
                  <Radar key={i} dataKey={`buyer${i}`} stroke={colors[i]} fill={colors[i]} fillOpacity={0.08} strokeWidth={2} />
                ))}
                <Legend formatter={(value) => {
                  const idx = parseInt(value.replace('buyer', ''));
                  return <span className="text-xs text-slate-500">{selectedBuyers[idx]?.name}</span>;
                }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Métricas Lado a Lado</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-2 text-slate-400">Métrica</th>
                  {selectedBuyers.map((b, i) => <th key={b.id} className="text-right pb-2 font-semibold" style={{ color: colors[i] }}>{b.name.split(' ')[0]}</th>)}
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.label} className="border-b border-slate-50">
                    <td className="py-2 text-slate-500">{m.label}</td>
                    {selectedBuyers.map((b) => { const val = m.fn(b); return <td key={b.id} className={`py-2 text-right font-mono ${m.color(val)}`}>{m.format(val)}</td>; })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
