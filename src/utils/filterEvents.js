// import { convertTimestampToFormattedString } from "./dateUtils";

export const filterEvents = (events, currentSchedule) => {
    // events.forEach(event=> console.log(event.sportYear + event.sportSeason + convertTimestampToFormattedString(event.eventDate)))
    // console.log(currentSchedule.year)
    return events.filter(
      (event) => event.sportYear === currentSchedule.year && event.sportSeason === currentSchedule.season.toLowerCase()
    );
  };