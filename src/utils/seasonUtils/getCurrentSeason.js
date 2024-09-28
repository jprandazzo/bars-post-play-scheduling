/**
 * Returns the current season based on today's date.
 * 
 * Season Date Ranges:
 * - Winter: January 1st to March 10th
 * - Spring: March 11th to May 31st
 * - Summer: June 1st to September 19th
 * - Fall: September 20th to December 31st
 * 
 * @returns {Object} An object containing the current year and season.
 */
export const getCurrentSeason = () => {
  const today = new Date();
  const year = today.getFullYear();

  const seasons = {
    Winter: new Date(year, 0, 1),     // January 1st
    Spring: new Date(year, 2, 11),    // March 11th
    Summer: new Date(year, 5, 1),     // June 1st
    Fall: new Date(year, 8, 20),      // September 20th
    NextWinter: new Date(year + 1, 0, 1) // Next year's Winter
  };

  let season = 'winter';

  if (today >= seasons.Fall && today < seasons.NextWinter) {
    season = 'fall';
  } else if (today >= seasons.Summer && today < seasons.Fall) {
    season = 'summer';
  } else if (today >= seasons.Spring && today < seasons.Summer) {
    season = 'spring';
  }

  return { year, season };
};

/**
 * Returns the season for a given date string.
 * 
 * Season Date Ranges:
 * - Winter: January 1st to March 10th
 * - Spring: March 11th to May 31st
 * - Summer: June 1st to September 19th
 * - Fall: September 20th to December 31st
 * 
 * @param {string} dateAsString - Date in "yyyy-MM-dd" format.
 * @returns {Object} An object containing the year and season.
 */