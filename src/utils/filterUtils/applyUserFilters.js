export const applyUserFilters = (events, userFilters) => {
    return events.filter(event => {

        const dateMatch = userFilters.selectedDate === '' || (
            event.eventDate.year === userFilters.selectedDate.split('-')[0] &&
            event.eventDate.month === userFilters.selectedDate.split('-')[1] &&
            event.eventDate.date === userFilters.selectedDate.split('-')[2]
        );
        
        const sportDayOfWeekMatch = userFilters.selectedSportDaysOfWeek.length === 0 || userFilters.selectedSportDaysOfWeek.includes(event.sportDayOfWeek);
        const sportMatch = userFilters.selectedSports.length === 0 || userFilters.selectedSports.includes(event.sport);
        const wtnbOrCoedMatch = userFilters.selectedWtnbOrCoed.length === 0 || userFilters.selectedWtnbOrCoed.includes(event.wtnbOrCoed);
        const isContactedMatch = userFilters.selectedIsContacted.length === 0 || userFilters.selectedIsContacted.includes(event.isContacted);
        const isConfirmedMatch = userFilters.selectedIsConfirmed.length === 0 || userFilters.selectedIsConfirmed.includes(event.isConfirmed);
        const isPizzaNightMatch = userFilters.selectedIsPizzaNight.length === 0 || userFilters.selectedIsPizzaNight.includes(event.isPizzaNight);
        const isPizzaOrderedMatch = userFilters.selectedIsPizzaOrdered.length === 0 || userFilters.selectedIsPizzaOrdered.includes(event.isPizzaOrdered);
        const locationMatch = userFilters.selectedLocations.length === 0 || userFilters.selectedLocations.includes(event.location);
        return dateMatch && sportDayOfWeekMatch && isContactedMatch && isConfirmedMatch && isPizzaNightMatch && isPizzaOrderedMatch && locationMatch && sportMatch && wtnbOrCoedMatch;
    });
};
