import isriCategories from './isriCategories';

const suppliers = [
  'Recicladora del Norte', 'Metales García', 'Chatarra Express',
  'Fierros Monterrey', 'Desmanteladora López', 'Reciclaje Industrial MX',
  'Metales Rodríguez', 'Chatarrera Central', 'Demoliciones Hernández',
  'Recuperadora del Pacífico',
];

const clients = [
  'Fundidora Nacional', 'Aceros del Golfo', 'MetalMex Trading',
  'Southern Copper Corp', 'Industria Metalúrgica SA', 'Recimet Export',
  'Pacific Metal Co.', 'Gulf Scrap Dealers',
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTransactions() {
  const txns = [];
  for (let i = 0; i < 50; i++) {
    const isSale = Math.random() < 0.35;
    const cat = randomFrom(isriCategories);
    const dayOffset = Math.floor(Math.random() * 60);
    const weight = Math.round((500 + Math.random() * 15000) / 100) * 100;

    // Compras por debajo del precio base, ventas al precio base o arriba
    const priceVariation = isSale
      ? cat.basePriceUSD * (0.95 + Math.random() * 0.10)
      : cat.basePriceUSD * (0.70 + Math.random() * 0.15);

    txns.push({
      id: i + 1,
      type: isSale ? 'venta' : 'compra',
      date: daysAgo(dayOffset),
      categoryCode: cat.code,
      categoryName: cat.commonName,
      metalBase: cat.metalBase,
      weightLbs: weight,
      pricePerLb: Math.round(priceVariation * 1000) / 1000,
      total: Math.round(weight * priceVariation * 100) / 100,
      counterparty: isSale ? randomFrom(clients) : randomFrom(suppliers),
    });
  }
  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const mockTransactions = generateTransactions();

export default mockTransactions;
