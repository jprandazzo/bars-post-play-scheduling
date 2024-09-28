export const filterEvents = (events, currentSchedule) => {
    // events.forEach(event=> console.log(event.sportYear + event.sportSeason))
    // console.log('currentSchedule: ' + currentSchedule.year + currentSchedule.season)
    // console.log(currentSchedule.year)
    events.forEach(event=> console.log(event))
    return events.filter(
      (event) => event.sportYear === currentSchedule.year && event.sportSeason === currentSchedule.season.toLowerCase()
    );
  };