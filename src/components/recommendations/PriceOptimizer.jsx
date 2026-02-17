import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { enrichInventoryItem } from '../../utils/calculations';
import { formatCurrencyFull, formatPricePerLb, formatPercent } from '../../utils/formatters';

export default function PriceOptimizer() {
  const { inventory } = useData();
  const { currency, convert } = useCurrency();
  const items = inventory.map(enrichInventoryItem).filter(Boolean).sort((a, b) => b.potentialProfit - a.potentialProfit);
  const totalCost = items.reduce((s, i) => s + i.totalCost, 0);
  const totalValue = items.reduce((s, i) => s + i.currentValue, 0);
  const totalProfit = totalValue - totalCost;
  const overallMargin = totalValue > 0 ? ((totalValue - totalCost) / totalValue) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mt-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Resumen de Valorización</h3>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Costo Total Inv.', value: formatCurrencyFull(convert(totalCost), currency), color: 'text-slate-700' },
          { label: 'Valor de Mercado', value: formatCurrencyFull(convert(totalValue), currency), color: 'text-emerald-600' },
          { label: 'Ganancia Potencial', value: formatCurrencyFull(convert(totalProfit), currency), color: 'text-emerald-600' },
          { label: 'Margen General', value: formatPercent(overallMargin), color: 'text-emerald-600' },
        ].map((kpi) => (
          <div key={kpi.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase">{kpi.label}</p>
            <p className={`text-base font-mono font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100">
            <th className="text-left pb-2">Material</th><th className="text-right pb-2">Costo/lb</th>
            <th className="text-right pb-2">Mercado/lb</th><th className="text-right pb-2">Margen</th>
            <th className="text-right pb-2">Gan. Potencial</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(0, 10).map((item) => (
            <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td className="py-2 text-slate-600">{item.category.commonName}</td>
              <td className="py-2 text-right font-mono text-slate-500">{formatPricePerLb(convert(item.avgCostPerLb), currency)}</td>
              <td className="py-2 text-right font-mono text-slate-600">{formatPricePerLb(convert(item.marketPrice), currency)}</td>
              <td className="py-2 text-right">
                <span className={`font-mono ${item.margin > 10 ? 'text-emerald-600' : item.margin > 5 ? 'text-amber-600' : 'text-red-500'}`}>{formatPercent(item.margin)}</span>
              </td>
              <td className="py-2 text-right font-mono text-emerald-600">{formatCurrencyFull(convert(item.potentialProfit), currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
