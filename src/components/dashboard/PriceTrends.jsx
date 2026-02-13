import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import mockPrices from '../../data/mockPrices';
import { useCurrency } from '../../context/CurrencyContext';

const metals = ['Cobre', 'Aluminio', 'Acero', 'Bronce', 'Acero Inox'];
const metalColors = {
  Cobre: '#d97706',
  Aluminio: '#6366f1',
  Acero: '#3b82f6',
  Bronce: '#10b981',
  'Acero Inox': '#8b5cf6',
};

export default function PriceTrends() {
  const [selected, setSelected] = useState('Cobre');
  const { currency, convert } = useCurrency();

  const data = mockPrices[selected].map((d) => ({
    date: d.date.slice(5),
    price: Math.round(convert(d.price) * 1000) / 1000,
  }));

  const prefix = currency === 'MXN' ? 'MX$' : '$';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
        <p className="text-[11px] text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-mono font-bold" style={{ color: metalColors[selected] }}>
          {prefix}{payload[0].value.toFixed(3)}/lb
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Precios de Mercado — Últimos 30 Días
      </h3>
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {metals.map((m) => (
          <button
            key={m}
            onClick={() => setSelected(m)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
              selected === m
                ? 'text-white border-transparent shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
            style={selected === m ? { backgroundColor: metalColors[m] } : {}}
          >
            {m}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(v) => `${prefix}${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={metalColors[selected]}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: metalColors[selected], stroke: 'white', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
