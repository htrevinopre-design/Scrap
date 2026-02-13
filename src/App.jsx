import { useState, useCallback } from 'react';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import InventoryOverview from './components/dashboard/InventoryOverview';
import MarginAnalysis from './components/dashboard/MarginAnalysis';
import PriceTrends from './components/dashboard/PriceTrends';
import AlertsPanel from './components/dashboard/AlertsPanel';
import QuickEntry from './components/registration/QuickEntry';
import EntryHistory from './components/registration/EntryHistory';

import initialInventory, { inventoryNextId } from './data/mockInventory';
import mockTransactions from './data/mockTransactions';
import {
  calcularValorInventario,
  calcularValorInventarioAnterior,
  calcularMargenPromedio,
  calcularDiasPromedioInventario,
  generateAlerts,
} from './utils/calculations';
import { formatCurrency, formatPercent } from './utils/formatters';

function KpiCard({ title, value, subtitle, accent }) {
  const accentColors = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    slate: 'text-slate-800',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <p className={`text-3xl font-bold font-mono tracking-tight ${accentColors[accent] || accentColors.slate}`}>
        {value}
      </p>
      {subtitle && <p className="text-[11px] text-slate-400 mt-1.5">{subtitle}</p>}
    </div>
  );
}

function DashboardPage({ inventory }) {
  const { currency, convert } = useCurrency();

  const totalValue = convert(calcularValorInventario(inventory));
  const prevValue = convert(calcularValorInventarioAnterior(inventory));
  const valueChange = prevValue > 0 ? ((totalValue - prevValue) / prevValue) * 100 : 0;
  const avgMargin = calcularMargenPromedio(inventory);
  const avgDays = calcularDiasPromedioInventario(inventory);
  const alerts = generateAlerts(inventory);
  const urgentAlerts = alerts.filter((a) => a.type === 'VENDER' || a.type === 'ROTAR').length;

  return (
    <>
      <Header title="Dashboard" subtitle="Vista general de tu inventario y mercado" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Valor Inventario"
          value={formatCurrency(totalValue, currency)}
          subtitle={`${formatPercent(valueChange)} vs semana pasada`}
          accent="emerald"
        />
        <KpiCard
          title="Margen Promedio"
          value={formatPercent(avgMargin)}
          subtitle="Sobre inventario actual"
          accent={avgMargin > 10 ? 'emerald' : 'amber'}
        />
        <KpiCard
          title="Días Prom. Inventario"
          value={`${avgDays}d`}
          subtitle="Antigüedad promedio"
          accent={avgDays > 20 ? 'amber' : 'blue'}
        />
        <KpiCard
          title="Alertas Activas"
          value={urgentAlerts}
          subtitle={`${alerts.length} recomendaciones totales`}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <PriceTrends />
        <InventoryOverview inventory={inventory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MarginAnalysis inventory={inventory} />
        <AlertsPanel inventory={inventory} />
      </div>
    </>
  );
}

function RegisterPage({ onRegister }) {
  return (
    <>
      <Header title="Registrar Material" subtitle="Ingresa nuevas entradas de material" />
      <QuickEntry onRegister={onRegister} />
    </>
  );
}

function HistoryPage() {
  return (
    <>
      <Header title="Historial" subtitle="Consulta todas las transacciones" />
      <EntryHistory transactions={mockTransactions} />
    </>
  );
}

function AppContent() {
  const [page, setPage] = useState('dashboard');
  const [inventory, setInventory] = useState(initialInventory);
  const [nextId, setNextId] = useState(inventoryNextId);

  const handleRegister = useCallback(
    (entry) => {
      setInventory((prev) => [...prev, { id: nextId, ...entry }]);
      setNextId((prev) => prev + 1);
    },
    [nextId]
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <main className="flex-1 ml-60 p-8 max-w-[1400px]">
        {page === 'dashboard' && <DashboardPage inventory={inventory} />}
        {page === 'register' && <RegisterPage onRegister={handleRegister} />}
        {page === 'history' && <HistoryPage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <AppContent />
    </CurrencyProvider>
  );
}
