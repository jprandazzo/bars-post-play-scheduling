// utils/sortUtils.js

/**
 * Sort records by date ascending, then week number ascending, then sport, then WTNB/Coed (WTNB first).
 * @param {Array} records - The records to sort.
 * @returns {Array} - The sorted array of records.
 */
export const sortRecords = (records) => {
    return records.sort((a, b) => {
      // 1. Sort by date (assume `eventDate` is a Firestore Timestamp)
      const dateA = new Date(a.eventDate?.seconds * 1000);  // Convert Firestore Timestamp to JS Date
      const dateB = new Date(b.eventDate?.seconds * 1000);
  
      if (dateA - dateB !== 0) return dateA - dateB; // Sort by date ascending
  
      // 2. Sort by week number ascending
      const weekA = parseInt(a.weekNumber, 10);
      const weekB = parseInt(b.weekNumber, 10);
      if (weekA - weekB !== 0) return weekA - weekB;
  
      // 3. Sort by sport alphabetically
      const sportA = a.sport.toLowerCase();
      const sportB = b.sport.toLowerCase();
      if (sportA !== sportB) return sportA.localeCompare(sportB);
  
      // 4. Sort by WTNB/Coed, with WTNB first
      const wtnbOrCoedOrder = (value) => (value === 'WTNB' ? 0 : 1); // WTNB = 0, Coed = 1
      return wtnbOrCoedOrder(a.wtnbOrCoed) - wtnbOrCoedOrder(b.wtnbOrCoed);
    });
  };
  