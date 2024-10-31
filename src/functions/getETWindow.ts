/**
 * Convert a passed in time to the nearest 4 Hour ET chunk
 * @param date 
 * @returns Date
 */
export const getETWindow = (date: Date): Date => {
  const oneHour = 175 * 1000;
  const msec = date.getTime();
  // % 24 for an entire day, % 8 for a single window
  const bell = (msec / oneHour) % 8;
  const startMsec = msec - Math.round(oneHour * bell);
  return new Date(startMsec);
};