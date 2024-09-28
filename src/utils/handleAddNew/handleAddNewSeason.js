import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; 
import { generateSeasonEvents } from './generateSeasonEvents';

// Function to handle adding a new season
export const handleAddNewSeason = async (newSeason, setAllRecords, setSeasonModalOpen, setEventModalOpen) => {
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
  
    const data = await getDocs(eventsCollectionRef);
    setAllRecords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    
    // Close both modals when done
    setSeasonModalOpen(false);
    setEventModalOpen(false); 
  } catch (error) {
    console.error("Error adding season:", error);
  }
};
