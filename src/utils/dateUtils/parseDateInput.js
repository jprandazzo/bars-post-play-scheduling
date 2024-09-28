/**
 * Parses date and time inputs and returns a combined Date object.
 * @param {string|Date} dateInput - The date string in "yyyy-MM-dd" format or a Date object.
 * @param {Object} time - The time object containing hour, minute, and amPm.
 * @param {string} time.hour - The hour value.
 * @param {string} time.minute - The minute value.
 * @param {string} time.amPm - The AM/PM value.
 * @returns {Date} - A JavaScript Date object combining the date and time.
 */
export const parseDateInput = (dateString, time) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const hour = parseInt(time.hour, 10) % 12 + (time.amPm === 'PM' ? 12 : 0);
    const minute = parseInt(time.minute, 10);
  
    return new Date(year, month - 1, day, hour, minute);
  };
  
  
  