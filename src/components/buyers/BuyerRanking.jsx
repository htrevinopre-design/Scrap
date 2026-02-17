import { useData } from '../../context/DataContext';
import { getScoreColor } from '../../utils/buyerScoring';
import { formatWeight, formatPercent, daysAgo } from '../../utils/formatters';

function ScoreBadge({ score }) {
  const c = getScoreColor(score);
  return <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-mono font-bold text-sm border ${c.bg} ${c.text} ${c.border}`}>{score}</span>;
}

const typeColors = {
  Fundidora: 'bg-orange-50 text-orange-600',
  Exportador: 'bg-blue-50 text-blue-600',
  Broker: 'bg-purple-50 text-purple-600',
  Refinería: 'bg-emerald-50 text-emerald-600',
};

export default function BuyerRanking({ onSelectBuyer }) {
  const { scoredBuyers } = useData();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Ranking de Compradores</h3>
        <span className="text-[10px] text-slate-400">{scoredBuyers.length} compradores</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100">
              <th className="text-left pb-2 font-semibold w-8">#</th>
              <th className="text-center pb-2 font-semibold">Score</th>
              <th className="text-left pb-2 font-semibold">Comprador</th>
              <th className="text-left pb-2 font-semibold">Tipo</th>
              <th className="text-right pb-2 font-semibold">Precio vs Mkt</th>
              <th className="text-right pb-2 font-semibold">Pago Prom</th>
              <th className="text-right pb-2 font-semibold">Volumen</th>
              <th className="text-right pb-2 font-semibold">Últ. Txn</th>
            </tr>
          </thead>
          <tbody>
            {scoredBuyers.map((buyer, i) => {
              const lastDays = daysAgo(buyer.stats.lastTransactionDate);
              return (
                <tr key={buyer.id} onClick={() => onSelectBuyer(buyer)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${i < scoredBuyers.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <td className="py-2.5 text-slate-400 font-mono">{i + 1}</td>
                  <td className="py-2.5 text-center"><ScoreBadge score={buyer.score} /></td>
                  <td className="py-2.5">
                    <p className="text-slate-700 font-medium">{buyer.name}</p>
                    <p className="text-[10px] text-slate-400">{buyer.location}</p>
                  </td>
                  <td className="py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColors[buyer.type] || 'bg-slate-50 text-slate-500'}`}>{buyer.type}</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`font-mono ${buyer.stats.avgPriceVsMarket >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatPercent(buyer.stats.avgPriceVsMarket * 100)}</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`font-mono ${buyer.stats.avgDaysToPayment <= 20 ? 'text-emerald-600' : buyer.stats.avgDaysToPayment <= 40 ? 'text-amber-600' : 'text-red-500'}`}>{buyer.stats.avgDaysToPayment}d</span>
                  </td>
                  <td className="py-2.5 text-right font-mono text-slate-500">{formatWeight(buyer.stats.totalVolumeLbs)}</td>
                  <td className="py-2.5 text-right">
                    <span className={`font-mono ${lastDays <= 14 ? 'text-emerald-600' : lastDays <= 30 ? 'text-slate-500' : 'text-red-500'}`}>{lastDays}d</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
