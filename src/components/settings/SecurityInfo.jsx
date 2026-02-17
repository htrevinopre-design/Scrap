const checks = [
  'Datos almacenados localmente en tu servidor',
  'Encriptación AES-256 en reposo',
  'Conexión segura TLS 1.3',
  'Sin acceso externo sin tu autorización',
  'Respaldos automáticos diarios',
  'Tus datos son 100% tuyos',
];

export default function SecurityInfo() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Seguridad de tus Datos</h3>
      <div className="space-y-3">
        {checks.map((label) => (
          <div key={label} className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-slate-600">{label}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">Operando normalmente</span>
        </div>
        <p className="text-[11px] text-slate-400">Última sincronización: hace 5 minutos</p>
        <p className="text-[11px] text-slate-400">Último respaldo: hoy 03:00 AM</p>
        <p className="text-[11px] text-slate-400">Espacio utilizado: 2.4 GB de 50 GB</p>
      </div>
    </div>
  );
}
