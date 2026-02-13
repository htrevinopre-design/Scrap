function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

let nextId = 1;

const mockInventory = [
  // Cobre (~40% del peso total)
  { id: nextId++, categoryCode: 'CANDY', weightLbs: 12500, entryDate: daysAgo(5), costPerLb: 3.60 },
  { id: nextId++, categoryCode: 'BERRY', weightLbs: 18000, entryDate: daysAgo(12), costPerLb: 3.40 },
  { id: nextId++, categoryCode: 'BIRCH', weightLbs: 22000, entryDate: daysAgo(8), costPerLb: 3.10 },
  { id: nextId++, categoryCode: 'ICW', weightLbs: 15000, entryDate: daysAgo(18), costPerLb: 2.35 },
  { id: nextId++, categoryCode: 'DRUID', weightLbs: 25000, entryDate: daysAgo(25), costPerLb: 1.20 },
  { id: nextId++, categoryCode: 'CANDY', weightLbs: 8000, entryDate: daysAgo(3), costPerLb: 3.65 },
  { id: nextId++, categoryCode: 'BERRY', weightLbs: 14000, entryDate: daysAgo(22), costPerLb: 3.35 },
  // Aluminio (~30%)
  { id: nextId++, categoryCode: 'TABOR', weightLbs: 20000, entryDate: daysAgo(10), costPerLb: 0.62 },
  { id: nextId++, categoryCode: 'TENSE', weightLbs: 18000, entryDate: daysAgo(15), costPerLb: 0.52 },
  { id: nextId++, categoryCode: 'TALDON', weightLbs: 12000, entryDate: daysAgo(7), costPerLb: 0.70 },
  { id: nextId++, categoryCode: 'TOTO', weightLbs: 15000, entryDate: daysAgo(20), costPerLb: 0.78 },
  { id: nextId++, categoryCode: 'TABOR', weightLbs: 10000, entryDate: daysAgo(32), costPerLb: 0.60 },
  // Acero (~20%)
  { id: nextId++, categoryCode: 'HMS1', weightLbs: 35000, entryDate: daysAgo(14), costPerLb: 0.065 },
  { id: nextId++, categoryCode: 'HMS2', weightLbs: 28000, entryDate: daysAgo(28), costPerLb: 0.055 },
  { id: nextId++, categoryCode: 'SHRED', weightLbs: 20000, entryDate: daysAgo(6), costPerLb: 0.075 },
  // Bronce / Inox (~10%)
  { id: nextId++, categoryCode: 'HONEY', weightLbs: 5000, entryDate: daysAgo(9), costPerLb: 1.55 },
  { id: nextId++, categoryCode: 'PALES', weightLbs: 3500, entryDate: daysAgo(16), costPerLb: 1.70 },
  { id: nextId++, categoryCode: '304SS', weightLbs: 8000, entryDate: daysAgo(11), costPerLb: 0.68 },
  { id: nextId++, categoryCode: '316SS', weightLbs: 4000, entryDate: daysAgo(19), costPerLb: 0.75 },
];

export let inventoryNextId = nextId;

export default mockInventory;
