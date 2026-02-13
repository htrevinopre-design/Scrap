import { useState, useMemo } from 'react';
import isriCategories from '../../data/isriCategories';
import { useCurrency } from '../../context/CurrencyContext';
import { formatDate, formatCurrencyFull, formatWeight, formatPricePerLb } from '../../utils/formatters';

export default function EntryHistory({ transactions }) {
  const { currency, convert } = useCurrency();
  const [filterType, setFilterType] = useState('all');
  const [filterMetal, setFilterMetal] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const metals = [...new Set(isriCategories.map((c) => c.metalBase))];

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterMetal !== 'all' && t.metalBase !== filterMetal) return false;
      if (
        searchQuery &&
        !t.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.categoryCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [transactions, filterType, filterMetal, searchQuery]);

  const selectClass =
    'bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all appearance-none cursor-pointer';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        Historial de Transacciones
      </h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 mb-5">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectClass}>
          <option value="all">Todos los tipos</option>
          <option value="compra">Compras</option>
          <option value="venta">Ventas</option>
        </select>
        <select value={filterMetal} onChange={(e) => setFilterMetal(e.target.value)} className={selectClass}>
          <option value="all">Todos los metales</option>
          {metals.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <svg className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
              <th className="text-left pb-3 font-semibold">Fecha</th>
              <th className="text-left pb-3 font-semibold">Tipo</th>
              <th className="text-left pb-3 font-semibold">Categoría</th>
              <th className="text-left pb-3 font-semibold">Contraparte</th>
              <th className="text-right pb-3 font-semibold">Peso</th>
              <th className="text-right pb-3 font-semibold">Precio/lb</th>
              <th className="text-right pb-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr
                key={t.id}
                className={`hover:bg-slate-50/80 transition-colors ${
                  i < filtered.length - 1 ? 'border-b border-slate-50' : ''
                }`}
              >
                <td className="py-2.5 text-slate-500 text-xs">{formatDate(t.date)}</td>
                <td className="py-2.5">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      t.type === 'compra'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {t.type === 'compra' ? 'Compra' : 'Venta'}
                  </span>
                </td>
                <td className="py-2.5">
                  <span className="text-slate-700 font-medium text-xs">{t.categoryName}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({t.metalBase})</span>
                </td>
                <td className="py-2.5 text-xs text-slate-400 max-w-[140px] truncate">
                  {t.counterparty}
                </td>
                <td className="py-2.5 text-right font-mono text-xs text-slate-500">
                  {formatWeight(t.weightLbs)}
                </td>
                <td className="py-2.5 text-right font-mono text-xs text-slate-500">
                  {formatPricePerLb(convert(t.pricePerLb), currency)}
                </td>
                <td className="py-2.5 text-right font-mono text-xs font-semibold text-slate-700">
                  {formatCurrencyFull(convert(t.total), currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <p className="text-[11px] text-slate-400">
          {filtered.length} de {transactions.length} transacciones
        </p>
      </div>
    </div>
  );
}
