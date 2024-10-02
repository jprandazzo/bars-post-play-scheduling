import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';  // Ensure correct import for firebaseConfig

import { fetchData } from '../fetchData';

// Function to handle adding a new event
export const handleAddNewEvent = async (newEvent, setAllRecords, setIsEventModalOpen) => {

  try {
    const eventsCollectionRef = collection(db, 'post play events');
    await addDoc(eventsCollectionRef, {
      weekNumber: newEvent.weekNumber,
      eventDate: newEvent.eventDate,
      sport: newEvent.sport,
      wtnbOrCoed: newEvent.wtnbOrCoed,
      sportDayOfWeek: newEvent.sportDayOfWeek,
      numRegistered: newEvent.numRegistered || 0,
      percentAttendance: newEvent.percentAttendance || 100,
      numAttendees: newEvent.numAttendees | Math.round((newEvent.numRegistered || 0) * ((newEvent.percentAttendance || 100) / 100) / 20) * 20,
      location: newEvent.location || '',
      isContacted: newEvent.isContacted | false,
      isConfirmed: newEvent.isConfirmed  | false,
      isPizzaNight: newEvent.isPizzaNight | false,
      isPizzaOrdered: newEvent.isPizzaOrdered | false,
      sportYear: newEvent.sportYear,
      sportSeason: newEvent.sportSeason,
    });

    fetchData({setAllRecords})
    setIsEventModalOpen(false);
  } catch (error) {
    console.error("Error adding event:", error);
  }
};



