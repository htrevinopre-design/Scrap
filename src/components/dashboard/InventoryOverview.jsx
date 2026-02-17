import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { useData } from '../../context/DataContext';
import { getInventoryByMetal } from '../../utils/calculations';
import { formatCurrencyFull } from '../../utils/formatters';

const COLORS = { Cobre: '#d97706', Aluminio: '#6366f1', Acero: '#3b82f6', Bronce: '#10b981', 'Acero Inox': '#8b5cf6' };

export default function InventoryOverview() {
  const { currency, convert } = useCurrency();
  const { inventory } = useData();
  const byMetal = getInventoryByMetal(inventory);
  const data = Object.entries(byMetal).map(([name, info]) => ({ name, value: Math.round(convert(info.value)), weight: info.weight })).sort((a, b) => b.value - a.value);
  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs">
        <p className="font-semibold text-slate-700">{d.name}</p>
        <p className="text-emerald-600 font-mono">{formatCurrencyFull(d.value, currency)}</p>
        <p className="text-slate-400">{d.weight.toLocaleString()} lbs — {((d.value / total) * 100).toFixed(1)}%</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Distribución por Valor</h3>
      <div className="flex items-center">
        <ResponsiveContainer width="60%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" strokeWidth={0}>
              {data.map((e) => <Cell key={e.name} fill={COLORS[e.name] || '#94a3b8'} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2.5 ml-1">
          {data.map((e) => (
            <div key={e.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[e.name] }} />
              <div>
                <p className="text-[11px] text-slate-600 leading-tight font-medium">{e.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{((e.value / total) * 100).toFixed(0)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
