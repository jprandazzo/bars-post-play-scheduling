export const convertTimestampToFormattedString = (dateObj, format = "MMMM d, yyyy 'at' hh:mm:ss a") => {
  let date;

  if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
    date = dateObj;
  } else if (typeof dateObj === 'string' || dateObj instanceof String) {
    date = new Date(dateObj);  // Convert string to Date object
  } else {
    console.error("Invalid Date:", dateObj);
    return 'Invalid Date';
  }

  if (isNaN(date.getTime())) {
    console.error("Invalid Date after parsing:", dateObj);
    return 'Invalid Date';
  }

  const components = {
    d: date.getDate(),
    dd: String(date.getDate()).padStart(2, '0'),
    MMMM: date.toLocaleDateString('en-US', { month: 'long' }),
    yyyy: date.getFullYear(),
    h: date.getHours() % 12 || 12,
    hh: String(date.getHours() % 12 || 12).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
    a: date.getHours() >= 12 ? 'PM' : 'AM',
  };

  const regex = /(MMMM|dd|d|yyyy|hh|h|mm|ss|a|'[^']*')/g;

  return format.replace(regex, (match) => {
    if (match.startsWith("'")) {
      return match.slice(1, -1);  // Keep "at" as a literal string
    }
    return components[match] || match;
  });
};
