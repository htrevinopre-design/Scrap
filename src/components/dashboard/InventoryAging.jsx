import { getMarginByCategory } from '../../utils/calculations';
import { formatWeight } from '../../utils/formatters';

export default function InventoryAging({ inventory }) {
  const items = getMarginByCategory(inventory).sort((a, b) => b.days - a.days);

  const getBadge = (days) => {
    if (days > 30) return { text: 'Crítico', color: 'bg-red-50 text-red-600' };
    if (days > 14) return { text: 'Alto', color: 'bg-amber-50 text-amber-600' };
    return { text: 'Normal', color: 'bg-emerald-50 text-emerald-600' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Antigüedad del Inventario
      </h3>
      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
        {items.map((item) => {
          const badge = getBadge(item.days);
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  {item.category.commonName}
                </p>
                <p className="text-[11px] text-slate-400">{formatWeight(item.weightLbs)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-semibold text-slate-600">
                  {item.days}d
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badge.color}`}>
                  {badge.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
