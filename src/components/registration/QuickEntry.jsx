import { useState } from 'react';
import isriCategories from '../../data/isriCategories';
import { useData } from '../../context/DataContext';

export default function QuickEntry() {
  const { addInventoryItem } = useData();
  const [categoryCode, setCategoryCode] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [pricePerLb, setPricePerLb] = useState('');
  const [supplier, setSupplier] = useState('');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = isriCategories.filter((c) =>
    c.commonName.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()) || c.metalBase.toLowerCase().includes(search.toLowerCase())
  );
  const selectedCat = isriCategories.find((c) => c.code === categoryCode);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryCode || !weight || !pricePerLb) return;
    const weightLbs = unit === 'kg' ? parseFloat(weight) * 2.20462 : parseFloat(weight);
    addInventoryItem({ material: categoryCode, weightLbs: Math.round(weightLbs), avgCostPerLb: parseFloat(pricePerLb), dateAcquired: new Date().toISOString().split('T')[0] });
    setToast(`${Math.round(weightLbs).toLocaleString()} lbs de ${selectedCat.commonName} registradas`);
    setCategoryCode(''); setWeight(''); setPricePerLb(''); setSupplier(''); setSearch('');
    setTimeout(() => setToast(null), 3000);
  };

  const inputCls = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all placeholder:text-slate-300';

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 mb-1">Registro de Compra</h3>
        <p className="text-xs text-slate-400 mb-5">Entrada de material al inventario</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Categoría ISRI</label>
            <div className="relative">
              <input type="text" placeholder="Buscar categoría..."
                value={selectedCat ? `${selectedCat.isriCode} — ${selectedCat.commonName}` : search}
                onChange={(e) => { setSearch(e.target.value); setCategoryCode(''); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)} className={inputCls} />
              {showDropdown && !categoryCode && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl max-h-48 overflow-y-auto shadow-xl">
                  {filtered.map((cat) => (
                    <button key={cat.code} type="button" onClick={() => { setCategoryCode(cat.code); setShowDropdown(false); setSearch(''); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                      <span className="text-xs font-mono text-emerald-600 font-bold">{cat.isriCode}</span>
                      <span className="text-sm text-slate-600 ml-2">{cat.commonName}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({cat.metalBase})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Peso</label>
            <div className="flex gap-2">
              <input type="number" placeholder="0" value={weight} onChange={(e) => setWeight(e.target.value)} min="0" className={`flex-1 font-mono ${inputCls}`} />
              <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                {['lbs', 'kg'].map((u) => (
                  <button key={u} type="button" onClick={() => setUnit(u)}
                    className={`px-4 py-2.5 text-xs font-bold cursor-pointer transition-all ${unit === u ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>{u}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Precio pagado (USD/lb)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input type="number" placeholder="0.000" value={pricePerLb} onChange={(e) => setPricePerLb(e.target.value)} min="0" step="0.001" className={`pl-7 font-mono ${inputCls}`} />
            </div>
            {selectedCat && <p className="text-[10px] text-slate-400 mt-1">Mercado: <span className="text-emerald-600 font-mono font-medium">${selectedCat.basePriceUSD.toFixed(3)}/lb</span></p>}
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5">Proveedor</label>
            <input type="text" placeholder="Nombre del proveedor" value={supplier} onChange={(e) => setSupplier(e.target.value)} className={inputCls} />
          </div>

          {categoryCode && weight && pricePerLb && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-[10px] text-emerald-600 font-semibold uppercase mb-0.5">Total</p>
              <p className="text-xl font-mono font-bold text-emerald-700">
                ${((unit === 'kg' ? parseFloat(weight) * 2.20462 : parseFloat(weight)) * parseFloat(pricePerLb)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <button type="submit" disabled={!categoryCode || !weight || !pricePerLb}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-bold transition-all cursor-pointer shadow-sm hover:shadow-md disabled:shadow-none">
            REGISTRAR ENTRADA
          </button>
        </form>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2 z-50">
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          {toast}
        </div>
      )}
    </div>
  );
}
