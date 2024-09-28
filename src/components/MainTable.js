import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../firebaseConfig';  // Ensure correct import for firebaseConfig
import { collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';

import { convertTimestampToFormattedString } from '../utils/formatDates';
import { filterEvents } from '../utils/filterEvents';
import { handleAddNewEvent, handleAddNewSeason } from '../utils/handleAddNew/index';
import { AddNewEventModal, AddNewSeasonModal } from './Modals';

import './MainTable.css';
import { sportColors } from '../themes/sportColors';

export const MainTable = ({currentSchedule}) => {
    const [allRecords, setAllRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [isEventModalOpen, setEventModalOpen] = useState(false);
    const [isSeasonModalOpen, setSeasonModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({});
    const [newSeason, setNewSeason] = useState({
    sport: '',
    dayOfWeek: '',
    wtnbOrCoed: '',
    startDate: '',
    weeks: 0,
    openingParty: false,
    closingParty: false
    });

    const fetchData = async () => {
        try {
            const eventsCollectionRef = collection(db, 'post play events');
          const records = await getDocs(eventsCollectionRef);  // Assuming Firebase Firestore
      
          const formattedRecords = records.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
      
        //   console.log('Fetched Records:', formattedRecords); // Check the fetched records
      
          // Make sure setAllRecords only gets called once
          setAllRecords(formattedRecords);
        } catch (error) {
          console.error('Error fetching records:', error);
        }
      };

    useEffect(() => {
    fetchData();
    }, []);

    useEffect(() => {
        // console.log(allRecords)
        const filtered = filterEvents(allRecords, currentSchedule);
        // console.log(filtered)
        setFilteredRecords(filtered);
      }, [allRecords, currentSchedule]);
    
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
                    </tr>
                </thead>


                <tbody>
                    {filteredRecords.map((record) => {
                        return (
                        <tr key={record.id} style={{ backgroundColor: sportColors[record.sport.toLowerCase()] }}>
                            <td>{record.weekNumber}</td>
                            <td>{convertTimestampToFormattedString(record.eventDate)}</td>
                            <td>{record.wtnbOrCoed} {record.sport} {record.dayOfWeek}</td>
                            <td>{record.numAttendees}</td>
                            <td>{record.location}</td>
                            <td>
                            <input
                                type="checkbox"
                                checked={record.isContacted}
                                onChange={() => {}} // Handle the update
                            />
                            </td>
                            <td>
                            {record.isContacted && (
                                <input
                                type="checkbox"
                                checked={record.isConfirmed}
                                onChange={() => {}} // Handle the update
                                />
                            )}
                            </td>
                            <td>
                            <input
                                type="checkbox"
                                checked={record.isPizzaNight}
                                onChange={() => {}} // Handle the update
                            />
                            </td>
                            <td>
                            {record.isPizzaNight && (
                                <input
                                type="checkbox"
                                checked={record.isPizzaOrdered}
                                onChange={() => {}} // Handle the update
                                />
                            )}
                            </td>
                        </tr>
                        )})}
                </tbody>
            </table>

            {/* Add New Event Modal */}
            <AddNewEventModal {...{ isEventModalOpen, setEventModalOpen, newEvent, setNewEvent, handleAddNewEvent, setAllRecords }} />

            <AddNewSeasonModal {...{ isSeasonModalOpen, setSeasonModalOpen, newSeason, setNewSeason, handleAddNewSeason, setAllRecords, setEventModalOpen }}></AddNewSeasonModal>

        </div>
  );
}
