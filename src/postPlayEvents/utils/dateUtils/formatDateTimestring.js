/**
 * Combines date and time inputs into a formatted string.
 * @param {string} dateString - The date string in "YYYY-MM-DD" format.
 * @param {Object} time - The time object containing hour, minute, and amPm.
 * @param {string} time.hour - The hour value (1-12).
 * @param {string} time.minute - The minute value (00-59).
 * @param {string} time.amPm - The AM/PM value.
 * @returns {string} - The formatted date and time string ("MMMM d, yyyy hh:mm a").
 */
export const formatDateAndTimeString = (dateString, time) => {
    // console.log("dateString: " + dateString)
    const [year, month, day] = dateString.split('-').map(Number);
    const hour = Number.parseInt(time.hour, 10) % 12 || 12;
    const minute = String(time.minute).padStart(2, '0');
    const amPm = time.amPm;

    const monthName = new Date(year, month - 1, day).toLocaleString('en-US', {
        month: 'long',
    });

    return `${monthName} ${day}, ${year} ${hour}:${minute} ${amPm}`;
};
