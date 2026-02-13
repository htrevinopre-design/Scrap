import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { getInventoryByMetal } from '../../utils/calculations';
import { formatCurrencyFull } from '../../utils/formatters';

const COLORS = {
  Cobre: '#d97706',
  Aluminio: '#6366f1',
  Acero: '#3b82f6',
  Bronce: '#10b981',
  'Acero Inox': '#8b5cf6',
};

export default function InventoryOverview({ inventory }) {
  const { currency, convert } = useCurrency();
  const byMetal = getInventoryByMetal(inventory);

  const data = Object.entries(byMetal)
    .map(([metal, info]) => ({
      name: metal,
      value: Math.round(convert(info.value)),
      weight: info.weight,
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const pct = ((d.value / total) * 100).toFixed(1);
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
        <p className="text-sm font-semibold text-slate-700">{d.name}</p>
        <p className="text-sm font-mono font-bold text-emerald-600">
          {formatCurrencyFull(d.value, currency)}
        </p>
        <p className="text-xs text-slate-400">{d.weight.toLocaleString()} lbs</p>
        <p className="text-xs text-slate-400">{pct}% del total</p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Distribución del Inventario por Valor
      </h3>
      <div className="flex items-center">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2.5 ml-2 min-w-[120px]">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[entry.name] }}
              />
              <div>
                <p className="text-xs font-medium text-slate-600 leading-tight">{entry.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {((entry.value / total) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
