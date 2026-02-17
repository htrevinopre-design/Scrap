import isriCategories from './isriCategories';

const regions = ['US Midwest', 'US East Coast', 'Mexico'];

function generatePriceSeries(basePrice, days = 30) {
  const prices = [];
  let current = basePrice;
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.48) * 0.04 * current;
    const meanReversion = (basePrice - current) * 0.08;
    current = Math.max(basePrice * 0.88, Math.min(basePrice * 1.12, current + change + meanReversion));

    const spread = current * (0.008 + Math.random() * 0.012);
    prices.push({
      date: date.toISOString().split('T')[0],
      low: Math.round((current - spread) * 1000) / 1000,
      high: Math.round((current + spread) * 1000) / 1000,
      avg: Math.round(current * 1000) / 1000,
    });
  }
  return prices;
}

// Generate all price data
const fastmarketsData = {};

regions.forEach((region) => {
  const regionMultiplier = region === 'Mexico' ? 0.96 : region === 'US East Coast' ? 1.01 : 1.0;
  const regionData = {};

  isriCategories.forEach((cat) => {
    regionData[cat.code] = generatePriceSeries(cat.basePriceUSD * regionMultiplier);
  });

  fastmarketsData[region] = regionData;
});

export function getFastmarketsPrice(materialCode, region = 'US Midwest') {
  const data = fastmarketsData[region]?.[materialCode];
  if (!data || data.length === 0) return null;
  return data[data.length - 1];
}

export function getFastmarketsHistory(materialCode, region = 'US Midwest') {
  return fastmarketsData[region]?.[materialCode] || [];
}

export function getAllCurrentPrices(region = 'US Midwest') {
  const result = {};
  const regionData = fastmarketsData[region];
  if (!regionData) return result;
  Object.keys(regionData).forEach((code) => {
    const series = regionData[code];
    result[code] = series[series.length - 1];
  });
  return result;
}

export function getLastSyncTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 5);
  return now;
}

export default fastmarketsData;
