export const getJsDate = (dateObject) => {
    if (!dateObject) return '';

    // Ensure month and date are zero-padded
    const month = String(dateObject.month).padStart(2, '0');
    const date = String(dateObject.date).padStart(2, '0');

    // Convert hour to 24-hour format based on AM/PM
    let hour = Number.parseInt(dateObject.hour, 10);
    if (dateObject.amPm === 'PM' && hour !== 12) {
        hour += 12; // Convert PM to 24-hour format
    } else if (dateObject.amPm === 'AM' && hour === 12) {
        hour = 0; // Handle 12 AM as 00:00 in 24-hour format
    }

    const minute = Number.parseInt(dateObject.minute, 10);

    // Safari-safe way to create a Date object using individual components
    const jsDate = new Date(dateObject.year, month - 1, date, hour, minute);

    return jsDate instanceof Date && !Number.isNaN(jsDate) ? jsDate : null;
};
