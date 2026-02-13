import { useCurrency } from '../../context/CurrencyContext';
import { getMarginByCategory } from '../../utils/calculations';
import { formatCurrencyFull, formatPercent, formatWeight } from '../../utils/formatters';

export default function MarginAnalysis({ inventory }) {
  const { currency, convert } = useCurrency();

  const items = getMarginByCategory(inventory)
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Top 5 Categorías por Margen
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs border-b border-slate-100">
              <th className="text-left pb-3 font-medium">Categoría</th>
              <th className="text-right pb-3 font-medium">Peso</th>
              <th className="text-right pb-3 font-medium">Margen</th>
              <th className="text-right pb-3 font-medium">Gan. Potencial</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50/80 transition-colors ${
                  i < items.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <td className="py-3">
                  <p className="text-slate-700 font-medium text-sm">
                    {item.category.commonName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.category.code}</p>
                </td>
                <td className="py-3 text-right font-mono text-xs text-slate-500">
                  {formatWeight(item.weightLbs)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`font-mono text-xs font-semibold inline-block px-2 py-0.5 rounded-full ${
                      item.margin > 15
                        ? 'bg-emerald-50 text-emerald-700'
                        : item.margin > 5
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {formatPercent(item.margin)}
                  </span>
                </td>
                <td className="py-3 text-right font-mono text-xs font-semibold text-emerald-600">
                  {formatCurrencyFull(convert(item.potentialProfit), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
