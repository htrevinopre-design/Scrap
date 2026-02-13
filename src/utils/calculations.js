import isriCategories from '../data/isriCategories';
import { getCurrentPrice, getAvg7DayPrice, getAvg30DayPrice } from '../data/mockPrices';

function getCategoryByCode(code) {
  return isriCategories.find((c) => c.code === code);
}

export function calcularValorInventario(inventory) {
  return inventory.reduce((total, item) => {
    const cat = getCategoryByCode(item.categoryCode);
    if (!cat) return total;
    const marketPrice = getCurrentPrice(cat.metalBase) * (cat.purity / 100);
    return total + item.weightLbs * marketPrice;
  }, 0);
}

export function calcularValorInventarioAnterior(inventory) {
  // Simulated: use 7-day average as "last week" value
  return inventory.reduce((total, item) => {
    const cat = getCategoryByCode(item.categoryCode);
    if (!cat) return total;
    const avgPrice = getAvg7DayPrice(cat.metalBase) * (cat.purity / 100);
    return total + item.weightLbs * avgPrice;
  }, 0);
}

export function calcularMargen(costoCompra, precioMercado) {
  if (precioMercado === 0) return 0;
  return ((precioMercado - costoCompra) / precioMercado) * 100;
}

export function calcularDiasInventario(fechaEntrada) {
  const entry = new Date(fechaEntrada);
  const today = new Date();
  return Math.floor((today - entry) / (1000 * 60 * 60 * 24));
}

export function calcularMargenPromedio(inventory) {
  if (inventory.length === 0) return 0;
  let totalMargen = 0;
  let count = 0;
  inventory.forEach((item) => {
    const cat = getCategoryByCode(item.categoryCode);
    if (!cat) return;
    const marketPrice = getCurrentPrice(cat.metalBase) * (cat.purity / 100);
    totalMargen += calcularMargen(item.costPerLb, marketPrice);
    count++;
  });
  return count > 0 ? totalMargen / count : 0;
}

export function calcularDiasPromedioInventario(inventory) {
  if (inventory.length === 0) return 0;
  const totalDays = inventory.reduce(
    (sum, item) => sum + calcularDiasInventario(item.entryDate),
    0
  );
  return Math.round(totalDays / inventory.length);
}

export function convertirMoneda(valorUSD, moneda, tipoCambio = 17.5) {
  return moneda === 'MXN' ? valorUSD * tipoCambio : valorUSD;
}

export function getInventoryByMetal(inventory) {
  const grouped = {};
  inventory.forEach((item) => {
    const cat = getCategoryByCode(item.categoryCode);
    if (!cat) return;
    const metal = cat.metalBase;
    const marketPrice = getCurrentPrice(metal) * (cat.purity / 100);
    const value = item.weightLbs * marketPrice;
    if (!grouped[metal]) grouped[metal] = { weight: 0, value: 0 };
    grouped[metal].weight += item.weightLbs;
    grouped[metal].value += value;
  });
  return grouped;
}

export function getMarginByCategory(inventory) {
  return inventory
    .map((item) => {
      const cat = getCategoryByCode(item.categoryCode);
      if (!cat) return null;
      const marketPrice = getCurrentPrice(cat.metalBase) * (cat.purity / 100);
      const margin = calcularMargen(item.costPerLb, marketPrice);
      const days = calcularDiasInventario(item.entryDate);
      const potentialProfit = (marketPrice - item.costPerLb) * item.weightLbs;
      return {
        ...item,
        category: cat,
        marketPrice,
        margin,
        days,
        potentialProfit,
      };
    })
    .filter(Boolean);
}

export function generateAlerts(inventory) {
  const alerts = [];
  const enriched = getMarginByCategory(inventory);

  enriched.forEach((item) => {
    const cat = item.category;
    const avg30 = getAvg30DayPrice(cat.metalBase) * (cat.purity / 100);
    const current = item.marketPrice;

    let type, reason;

    if (item.margin > 15 && item.days > 14) {
      type = 'VENDER';
      reason = `Margen ${item.margin.toFixed(1)}% con ${item.days} días en inventario`;
    } else if (item.margin > 10 && current > avg30) {
      type = 'CONSIDERAR VENTA';
      reason = `Precio actual sobre promedio 30d, margen ${item.margin.toFixed(1)}%`;
    } else if (item.days > 30) {
      type = 'ROTAR';
      reason = `${item.days} días en inventario, rotación lenta`;
    } else if (current < avg30 && item.margin < 10) {
      type = 'MANTENER';
      reason = `Precio bajo promedio, esperar recuperación`;
    } else {
      return;
    }

    alerts.push({
      id: item.id,
      type,
      reason,
      categoryCode: cat.code,
      categoryName: cat.commonName,
      metalBase: cat.metalBase,
      weightLbs: item.weightLbs,
      margin: item.margin,
      potentialProfit: item.potentialProfit,
    });
  });

  // Sort: VENDER first, then CONSIDERAR, then ROTAR, then MANTENER
  const order = { VENDER: 0, 'CONSIDERAR VENTA': 1, ROTAR: 2, MANTENER: 3 };
  return alerts.sort((a, b) => order[a.type] - order[b.type]);
}

export function calcularTendencia(metalBase) {
  const current = getCurrentPrice(metalBase);
  const avg7 = getAvg7DayPrice(metalBase);
  if (avg7 === 0) return 0;
  return ((current - avg7) / avg7) * 100;
}
