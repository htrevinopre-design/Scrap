// Generate 30 days of realistic price history for each base metal
function generatePrices(basePrice, minPrice, maxPrice, days = 30) {
  const prices = [];
  let current = basePrice;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random walk with mean reversion
    const change = (Math.random() - 0.5) * 0.06 * current;
    const meanReversion = (basePrice - current) * 0.1;
    current = current + change + meanReversion;
    current = Math.max(minPrice, Math.min(maxPrice, current));

    prices.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(current * 1000) / 1000,
    });
  }
  return prices;
}

const mockPrices = {
  Cobre: generatePrices(4.0, 3.80, 4.20),
  Aluminio: generatePrices(1.15, 1.05, 1.25),
  Acero: generatePrices(0.10, 0.08, 0.12),
  Bronce: generatePrices(1.95, 1.80, 2.10),
  'Acero Inox': generatePrices(0.97, 0.85, 1.10),
};

export function getCurrentPrice(metalBase) {
  const prices = mockPrices[metalBase];
  return prices ? prices[prices.length - 1].price : 0;
}

export function getAvg7DayPrice(metalBase) {
  const prices = mockPrices[metalBase];
  if (!prices) return 0;
  const last7 = prices.slice(-7);
  return last7.reduce((sum, p) => sum + p.price, 0) / last7.length;
}

export function getAvg30DayPrice(metalBase) {
  const prices = mockPrices[metalBase];
  if (!prices) return 0;
  return prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
}

export default mockPrices;
