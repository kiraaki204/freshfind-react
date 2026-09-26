/** True when a produce item has season information worth showing.
    Items available in all four seasons are year-round — there is no
    meaningful seasonal restriction to display (e.g. Pastured Meat). */
export function hasMeaningfulSeason(produce) {
  return Array.isArray(produce.season) && produce.season.length > 0 && produce.season.length < 4;
}
