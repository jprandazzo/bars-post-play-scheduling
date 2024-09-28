export const convertTimestampToFormattedString = (timestamp, format = "dddd, MMM d yyyy 'at' HH:mm a") => {
  // Convert Firestore Timestamp to JavaScript Date object
  const milliseconds = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
  const date = new Date(milliseconds);

  // Build a map for all the date components
  const components = {
    d: date.getDate(),
    dd: String(date.getDate()).padStart(2, '0'),
    ddd: date.toLocaleDateString('en-US', { weekday: 'short' }),
    dddd: date.toLocaleDateString('en-US', { weekday: 'long' }),

    M: date.getMonth() + 1,
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    MMM: date.toLocaleDateString('en-US', { month: 'short' }),
    MMMM: date.toLocaleDateString('en-US', { month: 'long' }),
    MMMMM: date.toLocaleDateString('en-US', { month: 'narrow' }),

    yy: String(date.getFullYear()).slice(-2),
    yyyy: date.getFullYear(),

    h: date.getHours() % 12 || 12,
    hh: String(date.getHours() % 12 || 12).padStart(2, '0'),
    H: date.getHours(),
    HH: String(date.getHours()).padStart(2, '0'),

    m: date.getMinutes(),
    mm: String(date.getMinutes()).padStart(2, '0'),

    a: date.getHours() >= 12 ? 'PM' : 'AM'
  };

  // Process the format string, handling text inside single quotes as literal
  const regex = /(dddd|ddd|dd|d|MMMMM|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|a|'[^']*')/g;

  return format.replace(regex, (match) => {
    // If the match is a quoted string, return it without the quotes
    if (match.startsWith("'")) {
      return match.slice(1, -1);
    }

    // Otherwise, replace the match with the corresponding date component
    return components[match] || match;
  });
};