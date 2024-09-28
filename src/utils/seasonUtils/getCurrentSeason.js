export const getCurrentSeason = () => {
    const today = new Date();
    const year = today.getFullYear();
    
    const seasons = {
      Winter: new Date(year, 0, 1),    // January 1st
      Spring: new Date(year, 2, 11),   // March 11th
      Summer: new Date(year, 5, 1),    // June 1st
      Fall: new Date(year, 8, 20),     // September 20th
      NextWinter: new Date(year + 1, 0, 1) // Next year's Winter
    };
  
    let season = 'Winter';
  
    if (today >= seasons.Fall && today < seasons.NextWinter) {
      season = 'Fall';
    } else if (today >= seasons.Summer && today < seasons.Fall) {
      season = 'Summer';
    } else if (today >= seasons.Spring && today < seasons.Summer) {
      season = 'Spring';
    }
  
    return { year, season };
  };
  