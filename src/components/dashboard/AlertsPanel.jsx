import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { enrichInventoryItem } from '../../utils/calculations';
import { formatWeight, formatPercent, formatCurrencyFull } from '../../utils/formatters';

const styles = {
  SELL: { badge: 'bg-emerald-600 text-white', card: 'bg-emerald-50 border-emerald-200' },
  HOLD: { badge: 'bg-blue-500 text-white', card: 'bg-blue-50 border-blue-200' },
  WATCH: { badge: 'bg-amber-500 text-white', card: 'bg-amber-50 border-amber-200' },
};

export default function AlertsPanel() {
  const { inventory } = useData();
  const { currency, convert } = useCurrency();
  const items = inventory.map(enrichInventoryItem).filter(Boolean).filter((i) => i.recommendation !== 'HOLD')
    .sort((a, b) => ({ SELL: 0, WATCH: 1, HOLD: 2 }[a.recommendation] - { SELL: 0, WATCH: 1, HOLD: 2 }[b.recommendation])).slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Recomendaciones Activas</h3>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {items.map((item) => {
          const s = styles[item.recommendation] || styles.HOLD;
          return (
            <div key={item.id} className={`p-3 rounded-xl border ${s.card}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-medium text-slate-700">{item.category.commonName}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{item.recommendation}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-1.5">{item.recommendationReason}</p>
              <div className="flex gap-3 text-[11px]">
                <span className="text-slate-400">{formatWeight(item.weightLbs)}</span>
                <span className="text-emerald-600 font-medium">{formatPercent(item.margin)}</span>
                <span className="text-emerald-600 font-mono">{formatCurrencyFull(convert(item.potentialProfit), currency)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
