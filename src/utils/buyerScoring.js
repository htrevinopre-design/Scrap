export function calcularScorePrecio(avgPriceVsMarket) {
  // +3% vs market = 100, 0% = 70, -5% = 40, -10% = 10
  const pct = avgPriceVsMarket * 100;
  return Math.max(0, Math.min(100, 70 + pct * 10));
}

export function calcularScorePago(avgDays) {
  // 0-15 days = 100, 30 = 70, 45 = 50, 60+ = 30
  if (avgDays <= 15) return 100;
  if (avgDays <= 30) return 100 - ((avgDays - 15) / 15) * 30;
  if (avgDays <= 60) return 70 - ((avgDays - 30) / 30) * 40;
  return Math.max(10, 30 - ((avgDays - 60) / 30) * 20);
}

export function calcularScoreVolumen(totalVolumeLbs, avgVolume) {
  if (avgVolume === 0) return 50;
  const ratio = totalVolumeLbs / avgVolume;
  return Math.min(100, Math.round(ratio * 70));
}

export function calcularScoreFrecuencia(lastTransactionDate) {
  const days = Math.floor((new Date() - new Date(lastTransactionDate)) / (1000 * 60 * 60 * 24));
  if (days <= 7) return 100;
  if (days <= 30) return 90 - ((days - 7) / 23) * 20;
  if (days <= 90) return 70 - ((days - 30) / 60) * 40;
  return Math.max(10, 30 - ((days - 90) / 90) * 20);
}

export function calcularScoreComprador(buyer, avgVolume = 400000) {
  const weights = {
    price: 0.35,
    paymentSpeed: 0.25,
    volume: 0.15,
    reliability: 0.15,
    frequency: 0.10,
  };

  const { stats } = buyer;
  const priceScore = calcularScorePrecio(stats.avgPriceVsMarket);
  const paymentScore = calcularScorePago(stats.avgDaysToPayment);
  const volumeScore = calcularScoreVolumen(stats.totalVolumeLbs, avgVolume);
  const reliabilityScore = Math.round(stats.reliability * 100);
  const frequencyScore = calcularScoreFrecuencia(stats.lastTransactionDate);

  const total = Math.round(
    priceScore * weights.price +
    paymentScore * weights.paymentSpeed +
    volumeScore * weights.volume +
    reliabilityScore * weights.reliability +
    frequencyScore * weights.frequency
  );

  return {
    total,
    breakdown: {
      price: Math.round(priceScore),
      paymentSpeed: Math.round(paymentScore),
      volume: Math.round(volumeScore),
      reliability: reliabilityScore,
      frequency: Math.round(frequencyScore),
    },
  };
}

export function scoreBuyers(buyers) {
  const avgVolume = buyers.reduce((s, b) => s + b.stats.totalVolumeLbs, 0) / buyers.length;
  return buyers.map((buyer) => {
    const score = calcularScoreComprador(buyer, avgVolume);
    return { ...buyer, score: score.total, scoreBreakdown: score.breakdown };
  }).sort((a, b) => b.score - a.score);
}

export function getScoreColor(score) {
  if (score >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' };
  if (score >= 60) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
  return { bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-200' };
}
