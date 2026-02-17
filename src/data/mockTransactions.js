import isriCategories from './isriCategories';
import mockBuyers from './mockBuyers';

const suppliers = [
  'Recicladora del Norte', 'Metales García', 'Chatarra Express',
  'Fierros Monterrey', 'Desmanteladora López', 'Reciclaje Industrial MX',
  'Metales Rodríguez', 'Chatarrera Central', 'Demoliciones Hernández',
  'Recuperadora del Pacífico', 'Don Raúl - Particular', 'Taller Mecánico Juárez',
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
  let id = 1;

  for (let i = 0; i < 100; i++) {
    const isSale = Math.random() < 0.4;
    const cat = randomFrom(isriCategories);
    const dayOffset = Math.floor(Math.random() * 180);
    const weight = Math.round((1000 + Math.random() * 20000) / 100) * 100;
    const date = daysAgo(dayOffset);

    if (isSale) {
      // Find a buyer who accepts this material
      const eligibleBuyers = mockBuyers.filter((b) =>
        b.materialsAccepted.includes(cat.code)
      );
      if (eligibleBuyers.length === 0) {
        i--;
        continue;
      }
      const buyer = randomFrom(eligibleBuyers);
      const marketVar = buyer.stats.avgPriceVsMarket;
      const pricePerLb = Math.round(cat.basePriceUSD * (1 + marketVar + (Math.random() - 0.5) * 0.03) * 1000) / 1000;
      const fastmarketsAtSale = Math.round(cat.basePriceUSD * (0.97 + Math.random() * 0.06) * 1000) / 1000;
      const daysToPayRaw = Math.round(buyer.stats.avgDaysToPayment + (Math.random() - 0.5) * 20);
      const daysToPayment = Math.max(5, daysToPayRaw);
      const paymentDate = new Date(date);
      paymentDate.setDate(paymentDate.getDate() + daysToPayment);
      const isPaid = paymentDate < new Date();
      const isOverdue = !isPaid && daysToPayment > buyer.stats.avgDaysToPayment * 1.5;

      txns.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        type: 'sale',
        date,
        buyerId: buyer.id,
        buyerName: buyer.name,
        material: cat.code,
        materialName: cat.commonName,
        metalBase: cat.metalBase,
        weightLbs: weight,
        pricePerLb,
        totalAmount: Math.round(weight * pricePerLb * 100) / 100,
        fastmarketsPriceAtSale: fastmarketsAtSale,
        daysToPayment: isPaid ? daysToPayment : null,
        paymentDate: isPaid ? paymentDate.toISOString().split('T')[0] : null,
        status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'pending',
      });
    } else {
      const pricePerLb = Math.round(cat.basePriceUSD * (0.72 + Math.random() * 0.15) * 1000) / 1000;
      txns.push({
        id: `txn-${String(id++).padStart(3, '0')}`,
        type: 'purchase',
        date,
        supplier: randomFrom(suppliers),
        material: cat.code,
        materialName: cat.commonName,
        metalBase: cat.metalBase,
        weightLbs: weight,
        pricePerLb,
        totalAmount: Math.round(weight * pricePerLb * 100) / 100,
        status: 'completed',
      });
    }
  }

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const mockTransactions = generateTransactions();

export default mockTransactions;
