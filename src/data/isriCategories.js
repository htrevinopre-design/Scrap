const isriCategories = [
  // COBRE
  { code: 'copper-candy', name: 'Bare Bright Copper', commonName: 'Bare Bright (Candy)', metalBase: 'Cobre', isriCode: 'CANDY', purity: 99.9, basePriceUSD: 4.10 },
  { code: 'copper-berry', name: '#1 Copper', commonName: '#1 Copper (Berry)', metalBase: 'Cobre', isriCode: 'BERRY', purity: 96, basePriceUSD: 3.95 },
  { code: 'copper-birch', name: '#2 Copper', commonName: '#2 Copper (Birch)', metalBase: 'Cobre', isriCode: 'BIRCH', purity: 94, basePriceUSD: 3.75 },
  { code: 'copper-insulated1', name: '#1 Insulated Copper Wire', commonName: '#1 Insulated Wire', metalBase: 'Cobre', isriCode: 'ICW-1', purity: 85, basePriceUSD: 2.80 },
  { code: 'copper-insulated2', name: '#2 Insulated Copper Wire', commonName: '#2 Insulated Wire', metalBase: 'Cobre', isriCode: 'ICW-2', purity: 50, basePriceUSD: 1.60 },
  // ALUMINIO
  { code: 'aluminum-tabor', name: 'Old Sheet Aluminum', commonName: 'Taint/Tabor', metalBase: 'Aluminio', isriCode: 'TABOR', purity: 92, basePriceUSD: 0.85 },
  { code: 'aluminum-tense', name: 'Cast Aluminum', commonName: 'Cast Aluminum (Tense)', metalBase: 'Aluminio', isriCode: 'TENSE', purity: 85, basePriceUSD: 0.75 },
  { code: 'aluminum-taldon', name: 'Aluminum Cans', commonName: 'Aluminum Cans (Taldon)', metalBase: 'Aluminio', isriCode: 'TALDON', purity: 97, basePriceUSD: 0.70 },
  { code: 'aluminum-toto', name: 'Extruded 6063 Aluminum', commonName: 'Extruded 6063 (Toto)', metalBase: 'Aluminio', isriCode: 'TOTO', purity: 98, basePriceUSD: 1.05 },
  // ACERO
  { code: 'steel-hms1', name: '#1 Heavy Melt Steel', commonName: '#1 Heavy Melt', metalBase: 'Acero', isriCode: 'HMS1', purity: 100, basePriceUSD: 0.09 },
  { code: 'steel-hms2', name: '#2 Heavy Melt Steel', commonName: '#2 Heavy Melt', metalBase: 'Acero', isriCode: 'HMS2', purity: 95, basePriceUSD: 0.07 },
  { code: 'steel-shred', name: 'Shredded Steel Scrap', commonName: 'Shredded Scrap', metalBase: 'Acero', isriCode: 'SHRED', purity: 98, basePriceUSD: 0.11 },
  // BRONCE
  { code: 'brass-pales', name: 'Red Brass Solids', commonName: 'Red Brass (Pales)', metalBase: 'Bronce', isriCode: 'PALES', purity: 85, basePriceUSD: 2.05 },
  { code: 'brass-honey', name: 'Yellow Brass Solids', commonName: 'Yellow Brass (Honey)', metalBase: 'Bronce', isriCode: 'HONEY', purity: 65, basePriceUSD: 1.90 },
  // ACERO INOXIDABLE
  { code: 'ss-304', name: '304 Stainless Steel', commonName: '304 Stainless', metalBase: 'Acero Inox', isriCode: '304SS', purity: 100, basePriceUSD: 0.95 },
  { code: 'ss-316', name: '316 Stainless Steel', commonName: '316 Stainless', metalBase: 'Acero Inox', isriCode: '316SS', purity: 100, basePriceUSD: 1.25 },
];

export function getCategoryByCode(code) {
  return isriCategories.find((c) => c.code === code);
}

export function getCategoriesByMetal(metal) {
  return isriCategories.filter((c) => c.metalBase === metal);
}

export const metalBases = [...new Set(isriCategories.map((c) => c.metalBase))];

export default isriCategories;
