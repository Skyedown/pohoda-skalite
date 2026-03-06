import { getAdminSettings, formatWaitTime } from './adminSettings';

export type OrderingStatus =
  | 'before_preorder' // Before preorder time - ordering disabled
  | 'preorder' // Preorder time - accepting preorders
  | 'open' // During opening hours - normal ordering
  | 'orders_closed' // After last order time - orders closed but still open
  | 'closed' // After closing - ordering disabled
  | 'admin_disabled' // Admin disabled ordering
  | 'admin_wait_time'; // Admin set wait time message

export interface OrderingStatusInfo {
  status: OrderingStatus;
  canOrder: boolean;
  message: string;
  disabledProductTypes?: ('pizza' | 'burger' | 'langos' | 'sides')[];
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

export async function getOrderingStatusAsync(): Promise<OrderingStatusInfo> {
  // First check admin settings
  const adminSettings = await getAdminSettings();
  const disabledProductTypes = adminSettings.disabledProductTypes || [];

  // Admin has disabled ordering
  if (adminSettings.mode === 'disabled') {
    return {
      status: 'admin_disabled',
      canOrder: false,
      message: 'Objednávky sú dočasne pozastavené. Ďakujeme za pochopenie.',
      disabledProductTypes,
    };
  }

  // Admin set wait time message
  if (adminSettings.mode === 'waitTime') {
    let message = `Aktuálna čakacia doba: ${formatWaitTime(adminSettings.waitTimeMinutes)}`;

    // Add info about disabled products if any
    if (disabledProductTypes.length > 0) {
      const disabledLabels = getDisabledProductLabels(disabledProductTypes);
      message += `. ${disabledLabels} sú na dnes vypredané.`;
    }

    return {
      status: 'admin_wait_time',
      canOrder: true,
      message,
      disabledProductTypes,
    };
  }

  // Admin set custom note
  if (adminSettings.mode === 'customNote') {
    let message = adminSettings.customNote;

    // Add info about disabled products if any
    if (disabledProductTypes.length > 0) {
      const disabledLabels = getDisabledProductLabels(disabledProductTypes);
      message += ` (${disabledLabels} sú vypredané)`;
    }

    return {
      status: 'admin_wait_time', // Reuse same status type
      canOrder: true,
      message,
      disabledProductTypes,
    };
  }

  // If admin mode is 'off', proceed with time-based logic
  const timeBasedStatus = getTimeBasedStatus();

  // Add info about disabled products if any
  let message = timeBasedStatus.message;
  if (disabledProductTypes.length > 0) {
    const disabledLabels = getDisabledProductLabels(disabledProductTypes);
    if (message) {
      message += ` ${disabledLabels} sú na dnes vypredané.`;
    } else {
      message = `${disabledLabels} sú na dnes vypredané.`;
    }
  }

  return {
    ...timeBasedStatus,
    message,
    disabledProductTypes,
  };
}

function getDisabledProductLabels(
  disabledProductTypes: ('pizza' | 'burger' | 'langos' | 'sides')[],
): string {
  const labels: Record<string, string> = {
    pizza: 'Pizze',
    burger: 'Burgre',
    langos: 'Langoše',
    sides: 'Prílohy',
  };

  const names = disabledProductTypes.map((type) => labels[type]);

  if (names.length === 1) {
    return names[0];
  } else if (names.length === 2) {
    return `${names[0]} a ${names[1]}`;
  } else {
    return names.slice(0, -1).join(', ') + ' a ' + names[names.length - 1];
  }
}

export function getOrderingStatus(): OrderingStatusInfo {
  // This is a synchronous version that doesn't check admin settings
  // Used for initial render, then replaced by async version
  return getTimeBasedStatus();
}

function getTimeBasedStatus(): OrderingStatusInfo {
  const preorderStartTime = import.meta.env.VITE_PREORDER_START_TIME || '10:00';
  const openingTime = import.meta.env.VITE_OPENING_TIME || '11:00';
  const lastOrderTime = import.meta.env.VITE_LAST_ORDER_TIME || '21:30';
  const closingTime = import.meta.env.VITE_CLOSING_TIME || '22:00';

  const currentMinutes = getCurrentTimeInMinutes();
  const preorderMinutes = timeToMinutes(preorderStartTime);
  const openingMinutes = timeToMinutes(openingTime);
  const lastOrderMinutes = timeToMinutes(lastOrderTime);
  const closingMinutes = timeToMinutes(closingTime);

  // Before preorder time
  if (currentMinutes < preorderMinutes) {
    return {
      status: 'before_preorder',
      canOrder: false,
      message: `Objednávky sú momentálne uzavreté. Predobjednávky budú možné od ${preorderStartTime}.`,
      disabledProductTypes: [],
    };
  }

  // During preorder time (before opening)
  if (currentMinutes >= preorderMinutes && currentMinutes < openingMinutes) {
    return {
      status: 'preorder',
      canOrder: true,
      message: `Aktuálne prijímame predobjednávky. Jedlo bude doručené po otvorení o ${openingTime}.`,
      disabledProductTypes: [],
    };
  }

  // During opening hours (before last order time)
  if (currentMinutes >= openingMinutes && currentMinutes < lastOrderMinutes) {
    return {
      status: 'open',
      canOrder: true,
      message: '',
      disabledProductTypes: [],
    };
  }

  // After last order time but before closing
  if (currentMinutes >= lastOrderMinutes && currentMinutes < closingMinutes) {
    return {
      status: 'orders_closed',
      canOrder: false,
      message: `Objednávky na dnes sú už uzavreté. Ďakujeme za pochopenie.`,
      disabledProductTypes: [],
    };
  }

  // After closing
  return {
    status: 'closed',
    canOrder: false,
    message: `Reštaurácia už momentálne nepríjma objednávky. Online predobjednávky sa otvárajú o ${preorderStartTime}.`,
    disabledProductTypes: [],
  };
}

/**
 * Format time for display
 */
export function formatTime(timeStr: string): string {
  const { hours, minutes } = parseTime(timeStr);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
