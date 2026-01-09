/**
 * EU-mandated allergen list (14 major allergens)
 * Mapped according to Slovak food labeling requirements
 */

export const ALLERGEN_MAP: Record<string, string> = {
  '1': 'Obilniny obsahujúce lepok',
  '2': 'Kôrovce a výrobky z nich',
  '3': 'Vajcia a výrobky z nich',
  '4': 'Ryby a výrobky z nich',
  '5': 'Arašidy a výrobky z nich',
  '6': 'Sója a výrobky z nej',
  '7': 'Mlieko a výrobky z neho',
  '8': 'Orechy',
  '9': 'Zeler a výrobky z neho',
  '10': 'Horčica a výrobky z nej',
  '11': 'Sezamové semená a výrobky z nich',
  '12': 'Oxid siričitý a siričitany',
  '13': 'Vlčí bôb (lupina) a výrobky z neho',
  '14': 'Mäkkýše a výrobky z nich',
};

/**
 * Convert allergen numbers to human-readable names
 * @param allergenNumbers - Array of allergen numbers as strings (e.g., ['1', '7', '12'])
 * @returns Array of allergen names
 */
export function getAllergenNames(allergenNumbers: string[]): string[] {
  return allergenNumbers.map((num) => ALLERGEN_MAP[num] || `Alergén ${num}`);
}

/**
 * Get formatted allergen string for display
 * @param allergenNumbers - Array of allergen numbers as strings
 * @param useNames - Whether to use full names (true) or just numbers (false)
 * @returns Formatted string
 */
export function formatAllergens(
  allergenNumbers: string[],
  useNames: boolean = false
): string {
  if (!allergenNumbers || allergenNumbers.length === 0) {
    return '';
  }

  if (useNames) {
    return getAllergenNames(allergenNumbers).join(', ');
  }

  return allergenNumbers.join(', ');
}
