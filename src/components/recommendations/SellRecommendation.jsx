import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { enrichInventoryItem } from '../../utils/calculations';
import { obtenerRecomendacionVenta, getMedalEmoji, getMedalLabel } from '../../utils/recommendations';
import { getScoreColor } from '../../utils/buyerScoring';
import { formatCurrencyFull, formatWeight, formatPercent, formatPricePerLb } from '../../utils/formatters';

export default function SellRecommendation({ onViewBuyer }) {
  const { inventory, scoredBuyers } = useData();
  const { currency, convert } = useCurrency();
  const [selectedId, setSelectedId] = useState(null);

  const enriched = inventory.map(enrichInventoryItem).filter(Boolean).sort((a, b) => b.margin - a.margin);
  const selected = enriched.find((i) => i.id === selectedId);
  const recommendations = selected ? obtenerRecomendacionVenta(selected, scoredBuyers) : [];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Selecciona material del inventario</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {enriched.map((item) => (
            <button key={item.id} onClick={() => setSelectedId(item.id)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                selectedId === item.id ? 'border-emerald-300 bg-emerald-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}>
              <p className="text-[13px] text-slate-700 font-medium">{item.category.commonName}</p>
              <div className="flex justify-between mt-1">
                <span className="text-[11px] text-slate-400">{formatWeight(item.weightLbs)}</span>
                <span className={`text-[11px] font-mono ${item.recommendation === 'SELL' ? 'text-emerald-600' : 'text-slate-400'}`}>{formatPercent(item.margin)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">Recomendación de Venta</h3>
              <p className="text-xs text-slate-400 mt-0.5">Material: {selected.category.commonName}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Cantidad disponible</p>
              <p className="text-sm font-mono font-bold text-slate-700">{formatWeight(selected.weightLbs)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Tu costo prom.</p>
              <p className="text-sm font-mono text-slate-700">{formatPricePerLb(convert(selected.avgCostPerLb), currency)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Fastmarkets hoy</p>
              <p className="text-sm font-mono text-emerald-600">{formatPricePerLb(convert(selected.marketPrice), currency)}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Margen potencial</p>
              <p className="text-sm font-mono text-emerald-600">{formatPercent(selected.margin)}</p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">No hay compradores elegibles para este material</p>
          ) : (
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((rec, i) => {
                const sc = getScoreColor(rec.score);
                const isBest = i === 0;
                return (
                  <div key={rec.buyer.id} className={`p-4 rounded-xl border transition-all ${isBest ? 'border-amber-300 bg-amber-50/40' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMedalEmoji(i)}</span>
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${isBest ? 'text-amber-600' : 'text-slate-400'}`}>{getMedalLabel(i)}</p>
                          <p className="text-sm font-semibold text-slate-700">{rec.buyer.name}</p>
                        </div>
                      </div>
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>{rec.score}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      <div>
                        <p className="text-[10px] text-slate-400">Precio esperado</p>
                        <p className="text-sm font-mono text-slate-700">{formatPricePerLb(convert(rec.expectedPrice), currency)}</p>
                        <p className={`text-[10px] font-mono ${rec.priceVsMarket >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatPercent(rec.priceVsMarket * 100)} vs mkt</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Pago estimado</p>
                        <p className={`text-sm font-mono ${rec.daysToPayment <= 20 ? 'text-emerald-600' : rec.daysToPayment <= 40 ? 'text-amber-600' : 'text-red-500'}`}>{rec.daysToPayment} días</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Ganancia proyectada</p>
                        <p className="text-sm font-mono font-bold text-emerald-600">{formatCurrencyFull(convert(rec.expectedProfit), currency)}</p>
                      </div>
                      <div className="flex items-end gap-2">
                        <button onClick={() => onViewBuyer && onViewBuyer(rec.buyer)}
                          className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-all cursor-pointer">
                          Ver perfil
                        </button>
                      </div>
                    </div>

                    {rec.warnings.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {rec.warnings.map((w) => <span key={w} className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">{w}</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
