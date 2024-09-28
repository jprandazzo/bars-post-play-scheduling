export const generateSeasonEvents = (seasonDetails) => {
    const events = [];
    const startDate = new Date(seasonDetails.startDate);
    for (let week = 1; week <= seasonDetails.weeks; week++) {
        events.push({
        weekNumber: week.toString(),
        date: new Date(startDate),
        sport: seasonDetails.sport,
        dayOfWeek: seasonDetails.dayOfWeek,
        wtnbOrCoed: seasonDetails.wtnbOrCoed,
        numRegistered: 0,
        percentAttendance: 100,
        numAttendees: 0,
        location: '',
        isContacted: false,
        isConfirmed: false,
        isPizzaNight: false,
        isPizzaOrdered: false,
        });
        startDate.setDate(startDate.getDate() + 7); // Increment the date by a week
    }

    if (seasonDetails.openingParty) {
        events.unshift({
        weekNumber: 'Opening Party',
        date: new Date(startDate.setDate(startDate.getDate() - 14)),
        sport: seasonDetails.sport,
        dayOfWeek: seasonDetails.dayOfWeek,
        wtnbOrCoed: seasonDetails.wtnbOrCoed,
        numRegistered: 0,
        percentAttendance: 100,
        numAttendees: 0,
        location: '',
        isContacted: false,
        isConfirmed: false,
        isPizzaNight: false,
        isPizzaOrdered: false,
        });
    }

    if (seasonDetails.closingParty) {
        events.push({
        weekNumber: 'Closing Party',
        date: new Date(startDate.setDate(startDate.getDate() + 7)),
        sport: seasonDetails.sport,
        dayOfWeek: seasonDetails.dayOfWeek,
        wtnbOrCoed: seasonDetails.wtnbOrCoed,
        numRegistered: 0,
        percentAttendance: 100,
        numAttendees: 0,
        location: '',
        isContacted: false,
        isConfirmed: false,
        isPizzaNight: false,
        isPizzaOrdered: false,
        });
    }

    return events;
    };