import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure correct import for firebaseConfig

import { fetchData } from '../fetchData';

// Function to handle adding a new event
export const handleAddNewEvent = async (
    newEvent,
    setAllEvents,
    setIsEventModalOpen,
    setUniqueLocations,
    setUserFilters
) => {
    try {
        const eventsCollectionRef = collection(db, 'post play events');
        const newEventRef = await addDoc(eventsCollectionRef, {
            weekNumber: newEvent.weekNumber,
            eventDate: newEvent.eventDate,
            sport: newEvent.sport,
            wtnbOrCoed: newEvent.wtnbOrCoed,
            sportDayOfWeek: newEvent.sportDayOfWeek,
            numRegistered: newEvent.numRegistered || 0,
            percentAttendance: newEvent.percentAttendance || 100,
            numAttendees:
                newEvent.numAttendees || newEvent.numRegistered
                    ? Math.round(
                          ((newEvent.numRegistered || 0) *
                              ((newEvent.percentAttendance || 100) / 100)) /
                              20
                      ) * 20
                    : null,
            location: newEvent.location || '',
            isContacted: newEvent.isContacted || false,
            isConfirmed: newEvent.isConfirmed || false,
            isPizzaNight: newEvent.isPizzaNight || false,
            isPizzaOrdered: newEvent.isPizzaOrdered || false,
            sportYear: newEvent.sportYear,
            sportSeason: newEvent.sportSeason,
        });
        setAllEvents((prevEvents) => [
            ...prevEvents,
            { ...newEvent, id: newEventRef.id },
        ]);

        setUniqueLocations((prevLocations) => {
            const newLocationSet = new Set([
                ...prevLocations,
                newEvent.location,
            ]);
            const newLocationArray = Array.from(newLocationSet);
            setUserFilters((prevFilters) => ({
                ...prevFilters,
                selectedLocations: prevFilters.selectedLocations.includes(
                    newEvent.location
                )
                    ? prevFilters.selectedLocations
                    : [...prevFilters.selectedLocations, newEvent.location],
            }));
            return newLocationArray;
        });

        fetchData({ setAllEvents });
        setIsEventModalOpen(false);
    } catch (error) {
        console.error('Error adding event:', error);
    }
};
