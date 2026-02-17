import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { getScoreColor } from '../../utils/buyerScoring';
import { getCategoryByCode } from '../../data/isriCategories';
import { formatCurrencyFull, formatDate, formatWeight, formatPercent } from '../../utils/formatters';

export default function BuyerProfile({ buyer, onBack }) {
  const { transactions } = useData();
  const { currency, convert } = useCurrency();
  const sc = getScoreColor(buyer.score);
  const buyerTxns = transactions.filter((t) => t.type === 'sale' && t.buyerId === buyer.id).slice(0, 10);

  const radarData = [
    { metric: 'Precio', value: buyer.scoreBreakdown.price },
    { metric: 'Pago', value: buyer.scoreBreakdown.paymentSpeed },
    { metric: 'Volumen', value: buyer.scoreBreakdown.volume },
    { metric: 'Confiab.', value: buyer.scoreBreakdown.reliability },
    { metric: 'Frecuencia', value: buyer.scoreBreakdown.frequency },
  ];

  const paymentData = buyerTxns.filter((t) => t.daysToPayment).slice(0, 8).reverse()
    .map((t) => ({ date: t.date.slice(5), days: t.daysToPayment }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800">{buyer.name}</h3>
          <p className="text-xs text-slate-400">{buyer.type} — {buyer.location}</p>
        </div>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 font-mono font-bold text-lg ${sc.bg} ${sc.text} ${sc.border}`}>{buyer.score}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contacto</h4>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">{buyer.contact}</p>
            <p className="text-slate-500 font-mono text-xs">{buyer.phone}</p>
            <p className="text-slate-500 text-xs">{buyer.email}</p>
          </div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-5 mb-2">Materiales</h4>
          <div className="flex flex-wrap gap-1">
            {buyer.materialsAccepted.map((m) => {
              const cat = getCategoryByCode(m);
              return <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{cat ? cat.commonName : m}</span>;
            })}
          </div>
          {buyer.notes && (
            <>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-5 mb-2">Notas</h4>
              <p className="text-xs text-slate-500">{buyer.notes}</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Score Desglosado</h4>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#64748b' }} />
              <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.12} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {radarData.map((d) => (
              <div key={d.metric} className="flex justify-between text-[11px]">
                <span className="text-slate-400">{d.metric}</span>
                <span className="font-mono text-slate-600">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Días de Pago</h4>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 11 }} />
                <Bar dataKey="days" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-xs text-slate-400 mt-4">Sin datos de pago disponibles</p>}
          <div className="flex justify-between mt-3 text-[11px]">
            <span className="text-slate-400">Promedio</span>
            <span className="font-mono text-amber-600">{buyer.stats.avgDaysToPayment} días</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Últimas Transacciones</h4>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100">
              <th className="text-left pb-2">Fecha</th><th className="text-left pb-2">Material</th>
              <th className="text-right pb-2">Peso</th><th className="text-right pb-2">Precio/lb</th>
              <th className="text-right pb-2">vs Mkt</th><th className="text-right pb-2">Total</th>
              <th className="text-right pb-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {buyerTxns.map((t) => {
              const diff = t.fastmarketsPriceAtSale ? ((t.pricePerLb - t.fastmarketsPriceAtSale) / t.fastmarketsPriceAtSale) * 100 : 0;
              return (
                <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-2 text-slate-500">{formatDate(t.date)}</td>
                  <td className="py-2 text-slate-600">{t.materialName}</td>
                  <td className="py-2 text-right font-mono text-slate-500">{formatWeight(t.weightLbs)}</td>
                  <td className="py-2 text-right font-mono text-slate-600">${t.pricePerLb.toFixed(3)}</td>
                  <td className="py-2 text-right"><span className={`font-mono ${diff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatPercent(diff)}</span></td>
                  <td className="py-2 text-right font-mono text-slate-700">{formatCurrencyFull(convert(t.totalAmount), currency)}</td>
                  <td className="py-2 text-right">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${t.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : t.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                      {t.status === 'paid' ? 'Pagado' : t.status === 'overdue' ? 'Vencido' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              );
            })}
            {buyerTxns.length === 0 && <tr><td colSpan={7} className="py-4 text-center text-slate-400">Sin transacciones</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
