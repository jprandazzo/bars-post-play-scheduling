import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; 
import { generateSeasonEvents } from './generateSeasonEvents';
import { fetchData } from '../fetchData';

// Function to handle adding a new season
export const handleAddNewSeason = async (newSeason, setAllEvents, setSeasonModalOpen, setIsEventModalOpen) => {
  try {
    const eventsCollectionRef = collection(db, 'post play events');
    const seasonEvents = generateSeasonEvents(newSeason);
  
    for (const event of seasonEvents) {
      await addDoc(eventsCollectionRef, {
        weekNumber: event.weekNumber,
        eventDate: Timestamp.fromDate(event.date),
        sport: newSeason.sport,
        wtnbOrCoed: newSeason.wtnbOrCoed,
        numRegistered: event.numRegistered || 0,
        percentAttendance: event.percentAttendance || 100,
        numAttendees: event.numAttendees || 0,
        location: event.location || '',
        isContacted: event.isContacted || false,
        isConfirmed: event.isConfirmed || false,
        isPizzaNight: event.isPizzaNight || false,
        isPizzaOrdered: event.isPizzaOrdered || false,
        year: newSeason.year,
        season: newSeason.season,
      });
    }
  
    fetchData({setAllEvents})
    
    // Close both modals when done
    setSeasonModalOpen(false);
    setIsEventModalOpen(false); 
  } catch (error) {
    console.error("Error adding season:", error);
  }
};
