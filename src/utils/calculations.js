import { getCategoryByCode } from '../data/isriCategories';
import { getFastmarketsPrice } from '../data/mockFastmarkets';

export function calcularDiasInventario(dateAcquired) {
  return Math.floor((new Date() - new Date(dateAcquired)) / (1000 * 60 * 60 * 24));
}

export function calcularMargen(costPerLb, marketPrice) {
  if (marketPrice === 0) return 0;
  return ((marketPrice - costPerLb) / marketPrice) * 100;
}

export function enrichInventoryItem(item) {
  const cat = getCategoryByCode(item.material);
  if (!cat) return null;
  const fm = getFastmarketsPrice(item.material);
  const marketPrice = fm ? fm.avg : cat.basePriceUSD;
  const days = calcularDiasInventario(item.dateAcquired);
  const margin = calcularMargen(item.avgCostPerLb, marketPrice);
  const currentValue = item.weightLbs * marketPrice;
  const totalCost = item.weightLbs * item.avgCostPerLb;
  const potentialProfit = currentValue - totalCost;

  let recommendation = 'HOLD';
  let recommendationReason = 'Sin señal clara';

  if (margin > 12 && days > 7) {
    recommendation = 'SELL';
    recommendationReason = `Margen ${margin.toFixed(1)}% con ${days}d en inventario`;
  } else if (margin > 8 && marketPrice > cat.basePriceUSD) {
    recommendation = 'SELL';
    recommendationReason = `Precio arriba de referencia, margen ${margin.toFixed(1)}%`;
  } else if (days > 30) {
    recommendation = 'WATCH';
    recommendationReason = `${days} días — rotación lenta, considerar liquidar`;
  } else if (margin < 5) {
    recommendation = 'HOLD';
    recommendationReason = `Margen bajo (${margin.toFixed(1)}%), esperar mejor precio`;
  }

  return {
    ...item,
    category: cat,
    marketPrice,
    currentValue,
    totalCost,
    potentialProfit,
    margin,
    days,
    recommendation,
    recommendationReason,
  };
}

export function calcularValorInventario(inventory) {
  return inventory.reduce((total, item) => {
    const enriched = enrichInventoryItem(item);
    return total + (enriched ? enriched.currentValue : 0);
  }, 0);
}

export function calcularCostoInventario(inventory) {
  return inventory.reduce((total, item) => total + item.weightLbs * item.avgCostPerLb, 0);
}

export function calcularMargenPromedio(inventory) {
  const items = inventory.map(enrichInventoryItem).filter(Boolean);
  if (items.length === 0) return 0;
  return items.reduce((s, i) => s + i.margin, 0) / items.length;
}

export function calcularDiasPromedioInventario(inventory) {
  if (inventory.length === 0) return 0;
  const total = inventory.reduce((s, i) => s + calcularDiasInventario(i.dateAcquired), 0);
  return Math.round(total / inventory.length);
}

export function getInventoryByMetal(inventory) {
  const grouped = {};
  inventory.forEach((item) => {
    const enriched = enrichInventoryItem(item);
    if (!enriched) return;
    const metal = enriched.category.metalBase;
    if (!grouped[metal]) grouped[metal] = { weight: 0, value: 0, cost: 0 };
    grouped[metal].weight += item.weightLbs;
    grouped[metal].value += enriched.currentValue;
    grouped[metal].cost += enriched.totalCost;
  });
  return grouped;
}

export function getVentasDelMes(transactions) {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  return transactions
    .filter((t) => t.type === 'sale' && t.date >= firstOfMonth)
    .reduce((s, t) => s + t.totalAmount, 0);
}
