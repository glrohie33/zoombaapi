export const toFloat = function (value: number, places: number): number {
  const finalValue = Number(value).toFixed(places);
  return Number(finalValue);
};
