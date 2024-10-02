export const applyUserFilters = (records, userFilters) => {
    return records.filter(record => {

        const dateMatch = userFilters.selectedDate === '' || (
            record.eventDate.year === userFilters.selectedDate.split('-')[0] &&
            record.eventDate.month === userFilters.selectedDate.split('-')[1] &&
            record.eventDate.date === userFilters.selectedDate.split('-')[2]
        );
        
        const sportDayOfWeekMatch = userFilters.selectedSportDaysOfWeek.length === 0 || userFilters.selectedSportDaysOfWeek.includes(record.sportDayOfWeek);
        const sportMatch = userFilters.selectedSports.length === 0 || userFilters.selectedSports.includes(record.sport);
        const wtnbOrCoedMatch = userFilters.selectedWtnbOrCoed.length === 0 || userFilters.selectedWtnbOrCoed.includes(record.wtnbOrCoed);
        const pizzaNightMatch = userFilters.selectedIsPizzaNight.length === 0 || userFilters.selectedIsPizzaNight.includes(record.isPizzaNight);
        const locationMatch = userFilters.selectedLocations.length === 0 || userFilters.selectedLocations.includes(record.location);
        return dateMatch && sportDayOfWeekMatch && pizzaNightMatch && locationMatch && sportMatch && wtnbOrCoedMatch;
    });
};
