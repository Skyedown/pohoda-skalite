/**
 * Utility functions for determining ordering status based on time
 */

export type OrderingStatus =
  | 'before_preorder'   // Before preorder time - ordering disabled
  | 'preorder'          // Preorder time - accepting preorders
  | 'open'              // During opening hours - normal ordering
  | 'closed';           // After closing - ordering disabled

export interface OrderingStatusInfo {
  status: OrderingStatus;
  canOrder: boolean;
  message: string;
}

/**
 * Parse time string (HH:mm) and return hours and minutes
 */
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Get current time in minutes since midnight
 */
function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Convert time string to minutes since midnight
 */
function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

/**
 * Get the ordering status based on current time
 */
export function getOrderingStatus(): OrderingStatusInfo {
  const preorderStartTime = import.meta.env.VITE_PREORDER_START_TIME || '10:00';
  const openingTime = import.meta.env.VITE_OPENING_TIME || '11:00';
  const closingTime = import.meta.env.VITE_CLOSING_TIME || '22:00';

  const currentMinutes = getCurrentTimeInMinutes();
  const preorderMinutes = timeToMinutes(preorderStartTime);
  const openingMinutes = timeToMinutes(openingTime);
  const closingMinutes = timeToMinutes(closingTime);

  // Before preorder time
  if (currentMinutes < preorderMinutes) {
    return {
      status: 'before_preorder',
      canOrder: false,
      message: `Objednávky sú momentálne uzavreté. Predobjednávky budú možné od ${preorderStartTime}.`,
    };
  }

  // During preorder time (before opening)
  if (currentMinutes >= preorderMinutes && currentMinutes < openingMinutes) {
    return {
      status: 'preorder',
      canOrder: true,
      message: `Aktuálne prijímame predobjednávky. Jedlo bude doručené po otvorení o ${openingTime}.`,
    };
  }

  // During opening hours
  if (currentMinutes >= openingMinutes && currentMinutes < closingMinutes) {
    return {
      status: 'open',
      canOrder: true,
      message: '',
    };
  }

  // After closing
  return {
    status: 'closed',
    canOrder: false,
    message: `Reštaurácia je momentálne zatvorená. Otvárame zajtra o ${openingTime}.`,
  };
}

/**
 * Format time for display
 */
export function formatTime(timeStr: string): string {
  const { hours, minutes } = parseTime(timeStr);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
