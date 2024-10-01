import { getJsDate } from "./getJsDate";

/**
 * Sort records by date ascending, then week number ascending, then sport, then WTNB/Coed (WTNB first).
 * @param {Array} records - The records to sort.
 * @returns {Array} - The sorted array of records.
 */
export const sortRecords = (records) => {
    return records.sort((a, b) => {
      // 1. Sort by date ascending

      const dateA = getJsDate(a.eventDate);
      const dateB = getJsDate(b.eventDate);
  
      if (dateA - dateB !== 0) return dateA - dateB;
  
      // 2. If same date, sort by location alphabetically to highlight potential conflicts
      const locationA = a.location.toLowerCase()
      const locationB = b.location.toLowerCase()
      if (locationA !== locationB) return locationA.localeCompare(locationB);
  
      // 3. Sort by sport alphabetically
      const sportA = a.sport.toLowerCase();
      const sportB = b.sport.toLowerCase();
      if (sportA !== sportB) return sportA.localeCompare(sportB);
  
      // 4. Sort by WTNB/Coed, with WTNB first
      const wtnbOrCoedOrder = (value) => (value === 'WTNB' ? 0 : 1); // WTNB = 0, Coed = 1
      return wtnbOrCoedOrder(a.wtnbOrCoed) - wtnbOrCoedOrder(b.wtnbOrCoed);
    });
  };
  