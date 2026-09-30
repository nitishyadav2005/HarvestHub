/**
 * Reusable Indian Currency & Agronomic Unit Formatting Utilities
 * Standardized for HarvestHub
 */

/**
 * Format a numeric amount to Indian Rupee representation (en-IN)
 * Example: 1500 -> ₹1,500, 125000 -> ₹1,25,000
 * Handles null, undefined, NaN, and negative values cleanly.
 */
export function formatINR(amount: number | null | undefined, showDecimals = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Round final displayed monetary result to 2 decimals or 0 decimals
  const normalized = showDecimals 
    ? Number(absAmount.toFixed(2)) 
    : Math.round(absAmount);

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0
  }).format(normalized);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Normalize agricultural yield quantity to standard kilograms (kg)
 * 1 Quintal = 100 kg
 * 1 Tonne / Metric Ton = 1000 kg
 * 1 kg = 1 kg
 */
export function normalizeToKg(quantity: number | null | undefined, unit = 'quintal'): number {
  if (quantity === null || quantity === undefined || isNaN(quantity) || quantity <= 0) {
    return 0;
  }

  const u = (unit || '').toLowerCase().trim();
  if (u.includes('quintal') || u === 'qtl') {
    return quantity * 100;
  }
  if (u.includes('tonne') || u.includes('ton') || u === 'mt') {
    return quantity * 1000;
  }
  return quantity; // Assume kg
}

/**
 * Format yield quantity with unit
 * Example: 2000 kg -> "2,000 kg", 85 quintals -> "85 Quintals"
 */
export function formatYield(quantity: number | null | undefined, unit = 'kg'): string {
  if (quantity === null || quantity === undefined || isNaN(quantity)) {
    return `0 ${unit}`;
  }
  const formattedQty = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 1
  }).format(quantity);

  return `${formattedQty} ${unit}`;
}

/**
 * Validates non-negative financial/measurement inputs
 */
export function isValidNonNegative(val: any): boolean {
  if (val === null || val === undefined || val === '') return false;
  const num = Number(val);
  return !isNaN(num) && num >= 0 && isFinite(num);
}

/**
 * Safely parse a number, guaranteeing non-negative finite value
 */
export function cleanNumber(val: any, fallback = 0): number {
  if (val === null || val === undefined || val === '') return fallback;
  const num = Number(val);
  return !isNaN(num) && isFinite(num) && num >= 0 ? num : fallback;
}
