import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export const fetchData = async ({setAllEvents}) => {
    try {
      const eventsCollectionRef = collection(db, 'post play events');
      const events = await getDocs(eventsCollectionRef);
  
      const formattedEvents = events.docs.map((doc) => {
        const eventData = doc.data();

        return {
          ...eventData,
          id: doc.id,
        };
      });
  
      setAllEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };