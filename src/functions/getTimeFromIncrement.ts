/**
 * Converts an increment to a time string
 * @param increment 
 * @returns string
 */
export const getTimefromIncrement = (increment: number) => {
  return increment == 0
    ? "4pm"
    : increment == 8
    ? "12am"
    : "8am";
};