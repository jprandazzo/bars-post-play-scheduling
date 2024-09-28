import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../../firebaseConfig';  
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { parse } from 'date-fns';

import { filterEvents } from '../../utils/filterEvents';
import { handleAddNewEvent, handleAddNewSeason } from '../../utils/handleAddNewUtils';
import { AddNewEventModal, AddNewSeasonModal } from '../Modals';
import { sortRecords } from '../../utils/sortUtils';
import { EventRow } from './EventRow/EventRow';  // Import the new child component

export const MainTable = ({ currentSchedule }) => {
    const [allRecords, setAllRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [isEventModalOpen, setEventModalOpen] = useState(false);
    const [isSeasonModalOpen, setSeasonModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
      eventDate: new Date(),
      weekNumber: '',
      sport: '',
      wtnbOrCoed: '',
      dayOfWeek: '',
      location: '',
      isContacted: false,
      isConfirmed: false,
      isPizzaNight: false,
      isPizzaOrdered: false,
      numAttendees: 0,
      numRegistered: 0,
      percentAttendance: 100,
  });
  

  const fetchData = async () => {
    try {
      const eventsCollectionRef = collection(db, 'post play events');
      const records = await getDocs(eventsCollectionRef);
  
      const formattedRecords = records.docs.map((doc) => {
        const eventData = doc.data();
  
        // Parse without "at"
        const eventDate = parse(eventData.eventDate, "MMMM d, yyyy hh:mm:ss a", new Date());
  
        return {
          ...eventData,
          id: doc.id,
          eventDate,  // Store as Date object
        };
      });
  
      setAllRecords(formattedRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };
  
  

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = filterEvents(allRecords, currentSchedule);
        const sortedRecords = sortRecords(filtered);
        setFilteredRecords(sortedRecords);
    }, [allRecords, currentSchedule]);

    const handleDeleteEvent = async (id) => {
        try {
            await deleteDoc(doc(db, 'post play events', id));
            fetchData();  // Refresh records after deletion
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const handleEditEvent = async (updatedEvent) => {
        try {
            const eventRef = doc(db, 'post play events', updatedEvent.id);
            await updateDoc(eventRef, updatedEvent);
            fetchData();  // Refresh records after update
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    return (
        <div>
            <div className='add-event-season-buttons'>
                <button onClick={() => setEventModalOpen(true)}>Add New Event</button>
                <button onClick={() => setSeasonModalOpen(true)}>Add New Season</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Week</th>
                        <th>Date</th>
                        <th>Sport</th>
                        <th>Est. # of Attendees</th>
                        <th>Location</th>
                        <th>Contacted?</th>
                        <th>Confirmed?</th>
                        <th>Need pizza?</th>
                        <th>Pizza Ordered?</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredRecords.map((record) => (
                        <EventRow
                            key={record.id}
                            record={record}
                            onDelete={handleDeleteEvent}
                            onEdit={handleEditEvent}
                        />
                    ))}
                </tbody>
            </table>

            {/* Add New Event Modal */}
            <AddNewEventModal {...{ isEventModalOpen, setEventModalOpen, handleAddNewEvent, setAllRecords, setNewEvent, newEvent }} />

            <AddNewSeasonModal {...{ isSeasonModalOpen, setSeasonModalOpen, handleAddNewSeason, setAllRecords, setEventModalOpen }} />
        </div>
    );
};
