export interface SkuComponents {
  supplierId: string;
  categoryCode: string;
  designCode: string;
  costPrice: number;
  colorCode: string;
  size: string;
}

function formatPriceSegment(costPrice: number): string {
  const rounded = Math.round(costPrice * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

export function buildSku({
  supplierId,
  categoryCode,
  designCode,
  costPrice,
  colorCode,
  size,
}: SkuComponents): string {
  return [supplierId, categoryCode, designCode, formatPriceSegment(costPrice), colorCode, size]
    .map((segment) => segment.trim().toUpperCase())
    .join('-');
}
