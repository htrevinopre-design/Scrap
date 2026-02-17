function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

let nextId = 1;

const mockInventory = [
  // Cobre (~40%)
  { id: nextId++, material: 'copper-candy', weightLbs: 8500, avgCostPerLb: 3.62, dateAcquired: daysAgo(4) },
  { id: nextId++, material: 'copper-berry', weightLbs: 18000, avgCostPerLb: 3.42, dateAcquired: daysAgo(11) },
  { id: nextId++, material: 'copper-birch', weightLbs: 28500, avgCostPerLb: 3.15, dateAcquired: daysAgo(7) },
  { id: nextId++, material: 'copper-insulated1', weightLbs: 15000, avgCostPerLb: 2.35, dateAcquired: daysAgo(18) },
  { id: nextId++, material: 'copper-insulated2', weightLbs: 22000, avgCostPerLb: 1.18, dateAcquired: daysAgo(26) },
  { id: nextId++, material: 'copper-berry', weightLbs: 12000, avgCostPerLb: 3.48, dateAcquired: daysAgo(3) },
  { id: nextId++, material: 'copper-candy', weightLbs: 5200, avgCostPerLb: 3.70, dateAcquired: daysAgo(2) },
  // Aluminio (~25%)
  { id: nextId++, material: 'aluminum-tabor', weightLbs: 22000, avgCostPerLb: 0.62, dateAcquired: daysAgo(10) },
  { id: nextId++, material: 'aluminum-tense', weightLbs: 18000, avgCostPerLb: 0.54, dateAcquired: daysAgo(15) },
  { id: nextId++, material: 'aluminum-taldon', weightLbs: 14000, avgCostPerLb: 0.50, dateAcquired: daysAgo(8) },
  { id: nextId++, material: 'aluminum-toto', weightLbs: 12000, avgCostPerLb: 0.78, dateAcquired: daysAgo(20) },
  { id: nextId++, material: 'aluminum-tabor', weightLbs: 9000, avgCostPerLb: 0.60, dateAcquired: daysAgo(35) },
  // Acero (~20%)
  { id: nextId++, material: 'steel-hms1', weightLbs: 42000, avgCostPerLb: 0.058, dateAcquired: daysAgo(14) },
  { id: nextId++, material: 'steel-hms2', weightLbs: 35000, avgCostPerLb: 0.048, dateAcquired: daysAgo(28) },
  { id: nextId++, material: 'steel-shred', weightLbs: 25000, avgCostPerLb: 0.072, dateAcquired: daysAgo(6) },
  // Bronce (~8%)
  { id: nextId++, material: 'brass-honey', weightLbs: 6500, avgCostPerLb: 1.58, dateAcquired: daysAgo(9) },
  { id: nextId++, material: 'brass-pales', weightLbs: 4200, avgCostPerLb: 1.72, dateAcquired: daysAgo(16) },
  // Inox (~7%)
  { id: nextId++, material: 'ss-304', weightLbs: 9500, avgCostPerLb: 0.68, dateAcquired: daysAgo(12) },
  { id: nextId++, material: 'ss-316', weightLbs: 5000, avgCostPerLb: 0.88, dateAcquired: daysAgo(19) },
  // Extras
  { id: nextId++, material: 'copper-birch', weightLbs: 8000, avgCostPerLb: 3.20, dateAcquired: daysAgo(32) },
  { id: nextId++, material: 'aluminum-tense', weightLbs: 11000, avgCostPerLb: 0.52, dateAcquired: daysAgo(22) },
];

export let inventoryNextId = nextId;

export default mockInventory;
