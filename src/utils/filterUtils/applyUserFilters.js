export const applyUserFilters = (records, userFilters) => {
    return records.filter(record => {

        const dateMatch = userFilters.selectedDate === '' || (
            record.eventDate.year === userFilters.selectedDate.split('-')[0] &&
            record.eventDate.month === userFilters.selectedDate.split('-')[1] &&
            record.eventDate.date === userFilters.selectedDate.split('-')[2]
        );
        
        const dayOfWeekMatch = userFilters.selectedDayOfWeek === '' || record.dayOfWeek === userFilters.selectedDayOfWeek;
        const pizzaNightMatch = userFilters.selectedIsPizzaNight === '' || record.isPizzaNight === userFilters.selectedIsPizzaNight;
        const locationMatch = userFilters.selectedLocation === '' || record.location === userFilters.selectedLocation;
        const sportMatch = userFilters.selectedSport === '' || userFilters.selectedSports.includes(record.sport);
        const wtnbOrCoedMatch = userFilters.selectedWtnbOrCoed === '' || userFilters.selectedWtnbOrCoed.includes(record.wtnbOrCoed);

        return dateMatch && dayOfWeekMatch && pizzaNightMatch && locationMatch && sportMatch && wtnbOrCoedMatch;
    });
};
