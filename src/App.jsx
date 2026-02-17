import { useState } from 'react';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import { DataProvider, useData } from './context/DataContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import InventoryOverview from './components/dashboard/InventoryOverview';
import MarginAnalysis from './components/dashboard/MarginAnalysis';
import PriceTrends from './components/dashboard/PriceTrends';
import AlertsPanel from './components/dashboard/AlertsPanel';
import BuyerRanking from './components/buyers/BuyerRanking';
import BuyerProfile from './components/buyers/BuyerProfile';
import BuyerComparison from './components/buyers/BuyerComparison';
import SellRecommendation from './components/recommendations/SellRecommendation';
import PriceOptimizer from './components/recommendations/PriceOptimizer';
import QuickEntry from './components/registration/QuickEntry';
import SaleEntry from './components/registration/SaleEntry';
import EntryHistory from './components/registration/EntryHistory';
import FastmarketsConfig from './components/settings/FastmarketsConfig';
import SecurityInfo from './components/settings/SecurityInfo';
import {
  calcularValorInventario, calcularCostoInventario, calcularMargenPromedio,
  calcularDiasPromedioInventario, enrichInventoryItem, getVentasDelMes,
} from './utils/calculations';
import { formatCurrency, formatPercent } from './utils/formatters';

function KpiCard({ title, value, subtitle, accent = 'emerald' }) {
  const colors = { emerald: 'text-emerald-600', amber: 'text-amber-600', blue: 'text-blue-600', slate: 'text-slate-800' };
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">{title}</p>
      <p className={`text-2xl font-bold font-mono tracking-tight ${colors[accent]}`}>{value}</p>
      {subtitle && <p className="text-[10px] text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

function DashboardPage() {
  const { inventory, transactions } = useData();
  const { currency, convert } = useCurrency();
  const totalValue = convert(calcularValorInventario(inventory));
  const totalCost = convert(calcularCostoInventario(inventory));
  const valueChange = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
  const avgMargin = calcularMargenPromedio(inventory);
  const avgDays = calcularDiasPromedioInventario(inventory);
  const ventasMes = convert(getVentasDelMes(transactions));
  const alerts = inventory.map(enrichInventoryItem).filter((i) => i && i.recommendation !== 'HOLD');

  return (
    <>
      <Header title="Dashboard" subtitle="Vista general de inventario, precios y recomendaciones" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <KpiCard title="Valor Inventario" value={formatCurrency(totalValue, currency)} subtitle={`${formatPercent(valueChange)} vs costo`} accent="emerald" />
        <KpiCard title="Margen Promedio" value={formatPercent(avgMargin)} subtitle="Sobre inv. actual" accent={avgMargin > 10 ? 'emerald' : 'amber'} />
        <KpiCard title="Días Prom. Inv." value={`${avgDays}d`} subtitle="Antigüedad promedio" accent={avgDays > 20 ? 'amber' : 'blue'} />
        <KpiCard title="Ventas del Mes" value={formatCurrency(ventasMes, currency)} subtitle="Mes actual" accent="blue" />
        <KpiCard title="Alertas" value={alerts.length} subtitle={`${alerts.filter(a => a.recommendation === 'SELL').length} recom. venta`} accent="amber" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <PriceTrends />
        <InventoryOverview />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MarginAnalysis />
        <AlertsPanel />
      </div>
    </>
  );
}

function BuyersPage() {
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [tab, setTab] = useState('ranking');
  if (selectedBuyer) return (<><Header title="Compradores" subtitle="Perfil detallado" /><BuyerProfile buyer={selectedBuyer} onBack={() => setSelectedBuyer(null)} /></>);
  return (
    <>
      <Header title="Compradores" subtitle="Ranking, perfiles y comparación" />
      <div className="flex gap-2 mb-4">
        {[{ id: 'ranking', label: 'Ranking' }, { id: 'compare', label: 'Comparar' }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${tab === t.id ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{t.label}</button>
        ))}
      </div>
      {tab === 'ranking' && <BuyerRanking onSelectBuyer={setSelectedBuyer} />}
      {tab === 'compare' && <BuyerComparison />}
    </>
  );
}

function RecommendPage() {
  const [viewBuyer, setViewBuyer] = useState(null);
  if (viewBuyer) return (<><Header title="Recomendador" subtitle="Perfil de comprador" /><BuyerProfile buyer={viewBuyer} onBack={() => setViewBuyer(null)} /></>);
  return (<><Header title="Recomendador de Ventas" subtitle="Selecciona un material para ver a quién venderle" /><SellRecommendation onViewBuyer={setViewBuyer} /><PriceOptimizer /></>);
}

function RegisterPage() {
  const [tab, setTab] = useState('buy');
  return (
    <>
      <Header title="Registrar" subtitle="Entradas y salidas de material" />
      <div className="flex gap-2 mb-4 justify-center">
        {[{ id: 'buy', label: 'Compra (Entrada)', color: 'emerald' }, { id: 'sell', label: 'Venta (Salida)', color: 'blue' }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              tab === t.id ? (t.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'bg-blue-50 text-blue-700 shadow-sm') : 'text-slate-400 hover:text-slate-600'
            }`}>{t.label}</button>
        ))}
      </div>
      {tab === 'buy' ? <QuickEntry /> : <SaleEntry />}
    </>
  );
}

function AppContent() {
  const [page, setPage] = useState('dashboard');
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="flex-1 ml-56 p-6 max-w-[1400px]">
        {page === 'dashboard' && <DashboardPage />}
        {page === 'buyers' && <BuyersPage />}
        {page === 'recommend' && <RecommendPage />}
        {page === 'register' && <RegisterPage />}
        {page === 'history' && <><Header title="Historial" subtitle="Todas las transacciones" /><EntryHistory /></>}
        {page === 'settings' && <><Header title="Configuración" subtitle="Conexiones y seguridad" /><div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><FastmarketsConfig /><SecurityInfo /></div></>}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </CurrencyProvider>
  );
}
