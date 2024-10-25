export const getSeason = (dateAsString) => {
    const date = new Date(dateAsString);
    const year = date.getFullYear();

    const seasons = {
        Winter: new Date(year, 0, 1), // January 1st
        Spring: new Date(year, 2, 11), // March 11th
        Summer: new Date(year, 5, 1), // June 1st
        Fall: new Date(year, 8, 20), // September 20th
        NextWinter: new Date(year + 1, 0, 1), // Next year's Winter
    };

    let season = 'winter';

    if (date >= seasons.Fall && date < seasons.NextWinter) {
        season = 'fall';
    } else if (date >= seasons.Summer && date < seasons.Fall) {
        season = 'summer';
    } else if (date >= seasons.Spring && date < seasons.Summer) {
        season = 'spring';
    }

    return { year, season };
};
