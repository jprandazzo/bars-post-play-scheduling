export const convertDateObjectToFormattedString = (dateObj) => {
  let date;

  // remove after debugging is done
  if (dateObj instanceof Date && !Number.isNaN(dateObj.getTime())) {
    date = dateObj;
  } else if (typeof dateObj === 'string' || dateObj instanceof String) {
    date = new Date(dateObj);  // Convert string to Date object
  } else {
    console.error("Invalid Date:", dateObj);
    return 'Invalid Date';
  }

  //remove after debugging is done
  if (Number.isNaN(date.getTime())) {
    console.error("Invalid Date after parsing:", dateObj);
    return 'Invalid Date';
  }

  // Always adjust the time to GMT-4:00 (Eastern Daylight Time)
  const offset = -240;  // Offset in minutes for GMT-4:00
  const adjustedDate = new Date(date.getTime() + offset * 60 * 1000);

  // Format components, no leading zero in hours, and no seconds
  const components = {
    d: adjustedDate.getDate(),
    MMMM: adjustedDate.toLocaleDateString('en-US', { month: 'long' }),
    yyyy: adjustedDate.getFullYear(),
    h: adjustedDate.getHours() % 12 || 12,  // No leading zero in hour
    mm: String(adjustedDate.getMinutes()).padStart(2, '0'),  // Keep minutes with leading zero
    a: adjustedDate.getHours() >= 12 ? 'PM' : 'AM',  // AM/PM
  };

  // Return the formatted string
  return `${components.MMMM} ${components.d}, ${components.yyyy} ${components.h}:${components.mm} ${components.a} GMT-4:00`;
};
