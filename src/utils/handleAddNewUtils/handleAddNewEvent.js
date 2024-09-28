import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';  // Ensure correct import for firebaseConfig

// Function to handle adding a new event
export const handleAddNewEvent = async (newEvent, setAllRecords, setEventModalOpen) => {

  try {
    const eventsCollectionRef = collection(db, 'post play events');
    console.log(Timestamp.fromDate(newEvent.eventDate))
    await addDoc(eventsCollectionRef, {
      weekNumber: newEvent.weekNumber,
      eventDate: Timestamp.fromDate(newEvent.eventDate),
      sport: newEvent.sport,
      wtnbOrCoed: newEvent.wtnbOrCoed,
      dayOfWeek: newEvent.dayOfWeek,
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

    const data = await getDocs(eventsCollectionRef);
    setAllRecords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setEventModalOpen(false);
  } catch (error) {
    console.error("Error adding event:", error);
  }
};



