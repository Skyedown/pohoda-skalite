const PREORDER_START_TIME = process.env.PREORDER_START_TIME || '10:00';
const LAST_ORDER_TIME = process.env.LAST_ORDER_TIME || '21:30';

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// The container runs in UTC; the restaurant's clock is what matters.
function restaurantMinutesNow(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bratislava',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === 'hour')?.value);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value);
  return hour * 60 + minute;
}

export function isWithinOrderingHours(): boolean {
  const now = restaurantMinutesNow();
  return (
    now >= timeToMinutes(PREORDER_START_TIME) &&
    now < timeToMinutes(LAST_ORDER_TIME)
  );
}
