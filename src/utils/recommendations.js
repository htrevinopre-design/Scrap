import { getFastmarketsPrice } from '../data/mockFastmarkets';

export function obtenerRecomendacionVenta(inventoryItem, scoredBuyers) {
  const material = inventoryItem.material;
  const fm = getFastmarketsPrice(material);
  const marketPrice = fm ? fm.avg : inventoryItem.marketPrice;

  const eligible = scoredBuyers.filter((b) => b.materialsAccepted.includes(material));

  const recommendations = eligible.map((buyer) => {
    const expectedPrice = Math.round(marketPrice * (1 + buyer.stats.avgPriceVsMarket) * 1000) / 1000;
    const expectedProfit = Math.round((expectedPrice - inventoryItem.avgCostPerLb) * inventoryItem.weightLbs * 100) / 100;
    const daysToPayment = buyer.stats.avgDaysToPayment;

    const warnings = [];
    if (daysToPayment > 45) warnings.push('Pago lento');
    if (buyer.stats.avgPriceVsMarket < -0.03) warnings.push('Precio bajo mercado');
    if (buyer.stats.reliability < 0.75) warnings.push('Baja confiabilidad');
    if (buyer.score < 55) warnings.push('Score bajo');

    // Combined ranking score
    const normalizedPrice = ((expectedPrice - inventoryItem.avgCostPerLb) / inventoryItem.avgCostPerLb) * 100;
    const normalizedPayment = Math.max(0, 100 - daysToPayment);
    const rankScore = normalizedPrice * 0.4 + normalizedPayment * 0.3 + buyer.score * 0.3;

    return {
      buyer,
      expectedPrice,
      expectedProfit,
      daysToPayment,
      priceVsMarket: buyer.stats.avgPriceVsMarket,
      score: buyer.score,
      scoreBreakdown: buyer.scoreBreakdown,
      warnings,
      rankScore,
    };
  });

  return recommendations.sort((a, b) => b.rankScore - a.rankScore);
}

export function getMedalEmoji(index) {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return '';
}

export function getMedalLabel(index) {
  if (index === 0) return 'MEJOR OPCIÓN';
  if (index === 1) return 'ALTERNATIVA';
  if (index === 2) return 'ALTERNATIVA';
  return 'OPCIÓN';
}
