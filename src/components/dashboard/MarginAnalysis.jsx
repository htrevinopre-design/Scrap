import { useCurrency } from '../../context/CurrencyContext';
import { useData } from '../../context/DataContext';
import { enrichInventoryItem } from '../../utils/calculations';
import { formatCurrencyFull, formatPercent, formatWeight } from '../../utils/formatters';

export default function MarginAnalysis() {
  const { currency, convert } = useCurrency();
  const { inventory } = useData();
  const items = inventory.map(enrichInventoryItem).filter(Boolean).filter((i) => i.recommendation === 'SELL').sort((a, b) => b.margin - a.margin).slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Top Materiales Listos para Vender</h3>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-xs text-slate-400">No hay recomendaciones de venta activas</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-emerald-100">
            <div>
              <p className="text-sm text-slate-700 font-medium">{item.category.commonName}</p>
              <p className="text-[11px] text-slate-400">{formatWeight(item.weightLbs)} — {item.days}d en inv.</p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-mono font-semibold inline-block px-2 py-0.5 rounded-full ${item.margin > 15 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {formatPercent(item.margin)}
              </span>
              <p className="text-[10px] text-emerald-600 font-mono mt-0.5">{formatCurrencyFull(convert(item.potentialProfit), currency)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
