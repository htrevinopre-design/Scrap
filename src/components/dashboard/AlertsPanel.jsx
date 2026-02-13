import { generateAlerts } from '../../utils/calculations';
import { useCurrency } from '../../context/CurrencyContext';
import { formatCurrencyFull, formatWeight, formatPercent } from '../../utils/formatters';

const alertStyles = {
  VENDER: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-600 text-white' },
  'CONSIDERAR VENTA': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-500 text-white' },
  ROTAR: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', badge: 'bg-red-500 text-white' },
  MANTENER: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-500 text-white' },
};

export default function AlertsPanel({ inventory }) {
  const { currency, convert } = useCurrency();
  const alerts = generateAlerts(inventory);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Recomendaciones
        </h3>
        <span className="text-[11px] font-medium bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
          {alerts.length} alertas
        </span>
      </div>
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const style = alertStyles[alert.type] || alertStyles.MANTENER;
          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border ${style.bg} ${style.border} transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-700">
                  {alert.categoryName}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${style.badge}`}>
                  {alert.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{alert.reason}</p>
              <div className="flex gap-4 text-[11px]">
                <span className="text-slate-400">{formatWeight(alert.weightLbs)}</span>
                <span className={style.text}>
                  Margen: {formatPercent(alert.margin)}
                </span>
                <span className="text-emerald-600 font-medium">
                  {formatCurrencyFull(convert(alert.potentialProfit), currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
