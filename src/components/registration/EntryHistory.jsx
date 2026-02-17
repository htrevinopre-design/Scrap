import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { metalBases } from '../../data/isriCategories';
import { formatDate, formatCurrencyFull, formatWeight, formatPricePerLb } from '../../utils/formatters';

export default function EntryHistory() {
  const { transactions } = useData();
  const { currency, convert } = useCurrency();
  const [filterType, setFilterType] = useState('all');
  const [filterMetal, setFilterMetal] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => transactions.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterMetal !== 'all' && t.metalBase !== filterMetal) return false;
    if (search && !t.materialName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [transactions, filterType, filterMetal, search]);

  const sel = 'bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Historial de Transacciones</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={sel}>
          <option value="all">Todos</option><option value="purchase">Compras</option><option value="sale">Ventas</option>
        </select>
        <select value={filterMetal} onChange={(e) => setFilterMetal(e.target.value)} className={sel}>
          <option value="all">Todos los metales</option>
          {metalBases.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className={`flex-1 min-w-[180px] ${sel} placeholder:text-slate-300`} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100">
              <th className="text-left pb-2">Fecha</th><th className="text-left pb-2">Tipo</th>
              <th className="text-left pb-2">Material</th><th className="text-left pb-2">Contraparte</th>
              <th className="text-right pb-2">Peso</th><th className="text-right pb-2">Precio/lb</th>
              <th className="text-right pb-2">Total</th><th className="text-right pb-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((t, i) => (
              <tr key={t.id} className={`hover:bg-slate-50/80 transition-colors ${i < Math.min(filtered.length, 50) - 1 ? 'border-b border-slate-50' : ''}`}>
                <td className="py-2 text-slate-500">{formatDate(t.date)}</td>
                <td className="py-2"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${t.type === 'purchase' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>{t.type === 'purchase' ? 'Compra' : 'Venta'}</span></td>
                <td className="py-2 text-slate-600">{t.materialName}</td>
                <td className="py-2 text-slate-400 max-w-[120px] truncate">{t.buyerName || t.supplier}</td>
                <td className="py-2 text-right font-mono text-slate-500">{formatWeight(t.weightLbs)}</td>
                <td className="py-2 text-right font-mono text-slate-500">{formatPricePerLb(convert(t.pricePerLb), currency)}</td>
                <td className="py-2 text-right font-mono text-slate-700">{formatCurrencyFull(convert(t.totalAmount), currency)}</td>
                <td className="py-2 text-right">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${t.status === 'paid' || t.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : t.status === 'overdue' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                    {t.status === 'paid' ? 'Pagado' : t.status === 'completed' ? 'OK' : t.status === 'overdue' ? 'Vencido' : 'Pend.'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-slate-400 mt-3">{filtered.length} transacciones</p>
    </div>
  );
}
