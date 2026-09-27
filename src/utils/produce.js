

const YEAR_ROUND_CATEGORIES = ['Meat', 'Dairy', 'Baked Goods', 'Flowers', 'Other'];


export function hasMeaningfulSeason(produce) {
  if (!Array.isArray(produce.season) || produce.season.length === 0) return false;
  if (produce.season.length === 4) return false;
  if (YEAR_ROUND_CATEGORIES.includes(produce.category)) return false;
  return true;
}
