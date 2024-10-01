import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export const fetchData = async ({setAllRecords}) => {
    try {
      const eventsCollectionRef = collection(db, 'post play events');
      const records = await getDocs(eventsCollectionRef);
  
      const formattedRecords = records.docs.map((doc) => {
        const eventData = doc.data();

        return {
          ...eventData,
          id: doc.id,
        };
      });
  
      setAllRecords(formattedRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };