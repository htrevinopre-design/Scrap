import { useState } from 'react';
import isriCategories from '../../data/isriCategories';

export default function QuickEntry({ onRegister }) {
  const [categoryCode, setCategoryCode] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [pricePerLb, setPricePerLb] = useState('');
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = isriCategories.filter(
    (c) =>
      c.commonName.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.metalBase.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCat = isriCategories.find((c) => c.code === categoryCode);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryCode || !weight || !pricePerLb) return;

    const weightLbs = unit === 'kg' ? parseFloat(weight) * 2.20462 : parseFloat(weight);

    const entry = {
      categoryCode,
      weightLbs: Math.round(weightLbs),
      costPerLb: parseFloat(pricePerLb),
      entryDate: new Date().toISOString().split('T')[0],
    };

    onRegister(entry);

    setToast({
      message: `${Math.round(weightLbs).toLocaleString()} lbs de ${selectedCat.commonName} registradas`,
    });

    setCategoryCode('');
    setWeight('');
    setPricePerLb('');
    setSearch('');

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Registro de Material
          </h3>
          <p className="text-sm text-slate-400 mt-1">Ingresa los datos de la nueva entrada</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Categoría ISRI
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, código o metal..."
                value={selectedCat ? `${selectedCat.code} — ${selectedCat.commonName}` : search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCategoryCode('');
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all placeholder:text-slate-300"
              />
              {showDropdown && !categoryCode && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl max-h-48 overflow-y-auto shadow-xl">
                  {filtered.map((cat) => (
                    <button
                      key={cat.code}
                      type="button"
                      onClick={() => {
                        setCategoryCode(cat.code);
                        setShowDropdown(false);
                        setSearch('');
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0"
                    >
                      <span className="text-xs font-mono font-bold text-emerald-600">
                        {cat.code}
                      </span>
                      <span className="text-sm text-slate-600 ml-2">
                        {cat.commonName}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5">
                        ({cat.metalBase})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Peso
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                step="1"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all placeholder:text-slate-300"
              />
              <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setUnit('lbs')}
                  className={`px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                    unit === 'lbs'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  lbs
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('kg')}
                  className={`px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                    unit === 'kg'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  kg
                </button>
              </div>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Precio Pagado (USD/lb)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                placeholder="0.000"
                value={pricePerLb}
                onChange={(e) => setPricePerLb(e.target.value)}
                min="0"
                step="0.001"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all placeholder:text-slate-300"
              />
            </div>
            {selectedCat && (
              <p className="text-[11px] text-slate-400 mt-1.5 ml-1">
                Precio de mercado: <span className="font-mono font-medium text-slate-500">${selectedCat.basePriceUSD.toFixed(3)}/lb</span>
              </p>
            )}
          </div>

          {/* Summary */}
          {categoryCode && weight && pricePerLb && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider mb-1">Total estimado</p>
              <p className="text-2xl font-mono font-bold text-emerald-700">
                $
                {(
                  (unit === 'kg'
                    ? parseFloat(weight) * 2.20462
                    : parseFloat(weight)) * parseFloat(pricePerLb)
                ).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-emerald-600/70 mt-0.5">
                {unit === 'kg'
                  ? `${Math.round(parseFloat(weight) * 2.20462).toLocaleString()} lbs`
                  : `${parseInt(weight).toLocaleString()} lbs`}
                {' '}x ${parseFloat(pricePerLb).toFixed(3)}/lb
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={!categoryCode || !weight || !pricePerLb}
            className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-300 text-white font-bold text-base transition-all cursor-pointer shadow-sm hover:shadow-md disabled:shadow-none"
          >
            REGISTRAR ENTRADA
          </button>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}
    </div>
  );
}
