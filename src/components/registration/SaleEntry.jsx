import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useCurrency } from '../../context/CurrencyContext';
import { enrichInventoryItem } from '../../utils/calculations';
import { formatWeight, formatPricePerLb, formatCurrencyFull, formatPercent } from '../../utils/formatters';

export default function SaleEntry() {
  const { inventory, scoredBuyers, registerSale } = useData();
  const { currency, convert } = useCurrency();
  const [invId, setInvId] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [weight, setWeight] = useState('');
  const [pricePerLb, setPricePerLb] = useState('');
  const [paymentDays, setPaymentDays] = useState('30');
  const [toast, setToast] = useState(null);

  const enriched = inventory.map(enrichInventoryItem).filter(Boolean);
  const selectedItem = enriched.find((i) => i.id === parseInt(invId));
  const selectedBuyer = scoredBuyers.find((b) => b.id === buyerId);

  const selCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';
  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!invId || !buyerId || !weight || !pricePerLb) return;
    const w = parseFloat(weight), p = parseFloat(pricePerLb);
    registerSale({ type: 'sale', date: new Date().toISOString().split('T')[0], buyerId, buyerName: selectedBuyer.name, material: selectedItem.material, materialName: selectedItem.category.commonName, metalBase: selectedItem.category.metalBase, inventoryItemId: parseInt(invId), weightLbs: w, pricePerLb: p, totalAmount: Math.round(w * p * 100) / 100, fastmarketsPriceAtSale: selectedItem.marketPrice, daysToPayment: null, paymentDate: null, status: 'pending' });
    const diff = ((p - selectedItem.marketPrice) / selectedItem.marketPrice * 100).toFixed(1);
    setToast(`Venta: $${p.toFixed(3)} vs mercado $${selectedItem.marketPrice.toFixed(3)} (${diff >= 0 ? '+' : ''}${diff}%)`);
    setInvId(''); setBuyerId(''); setWeight(''); setPricePerLb('');
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-1">Registrar Venta</h3>
        <p className="text-xs text-slate-400 mb-5">Salida de material — captura datos del comprador</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Material del inventario</label>
            <select value={invId} onChange={(e) => { setInvId(e.target.value); const item = enriched.find(i => i.id === parseInt(e.target.value)); if (item) setWeight(String(item.weightLbs)); }} className={selCls}>
              <option value="">Seleccionar...</option>
              {enriched.map((item) => <option key={item.id} value={item.id}>{item.category.commonName} — {formatWeight(item.weightLbs)} — ${item.marketPrice.toFixed(3)}/lb</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Comprador</label>
            <select value={buyerId} onChange={(e) => setBuyerId(e.target.value)} className={selCls}>
              <option value="">Seleccionar...</option>
              {scoredBuyers.map((b) => <option key={b.id} value={b.id}>{b.name} (Score: {b.score})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Peso (lbs)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Precio acordado (USD/lb)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" placeholder="0.000" value={pricePerLb} onChange={(e) => setPricePerLb(e.target.value)} min="0" step="0.001" className={`pl-7 ${inputCls}`} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Términos de pago (días)</label>
            <input type="number" value={paymentDays} onChange={(e) => setPaymentDays(e.target.value)} min="0" className={inputCls} />
          </div>

          {selectedItem && pricePerLb && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex justify-between text-xs"><span className="text-slate-400">Fastmarkets hoy</span><span className="font-mono text-slate-600">{formatPricePerLb(convert(selectedItem.marketPrice), currency)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-slate-400">Tu precio</span><span className="font-mono text-slate-700">{formatPricePerLb(convert(parseFloat(pricePerLb)), currency)}</span></div>
              <div className="flex justify-between text-xs border-t border-slate-200 pt-1.5"><span className="text-slate-400">Diferencia</span>
                <span className={`font-mono font-bold ${parseFloat(pricePerLb) >= selectedItem.marketPrice ? 'text-emerald-600' : 'text-red-500'}`}>{formatPercent(((parseFloat(pricePerLb) - selectedItem.marketPrice) / selectedItem.marketPrice) * 100)}</span>
              </div>
              {weight && <div className="flex justify-between text-xs border-t border-slate-200 pt-1.5"><span className="text-slate-400">Total venta</span><span className="font-mono font-bold text-emerald-600">{formatCurrencyFull(convert(parseFloat(weight) * parseFloat(pricePerLb)), currency)}</span></div>}
            </div>
          )}

          <button type="submit" disabled={!invId || !buyerId || !weight || !pricePerLb}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-bold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:shadow-none">
            REGISTRAR VENTA
          </button>
        </form>
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
