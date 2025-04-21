export function getCurrencySymbol(currency: string) {
  return (0)
    .toLocaleString([], {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
}
