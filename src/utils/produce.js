/* Categories that are available year-round — seasonal chips add no
   information for them (meat, dairy, baked goods, flowers, honey etc.). */
const YEAR_ROUND_CATEGORIES = ['Meat', 'Dairy', 'Baked Goods', 'Flowers', 'Other'];

/** True when a produce item has season information worth showing. */
export function hasMeaningfulSeason(produce) {
  if (!Array.isArray(produce.season) || produce.season.length === 0) return false;
  if (produce.season.length === 4) return false; // every season = year-round
  if (YEAR_ROUND_CATEGORIES.includes(produce.category)) return false;
  return true;
}

/* Category tabs shown in the produce browsing UI (matches the data). */
export const PRODUCE_CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Meat', 'Baked Goods', 'Flowers', 'Other'];
