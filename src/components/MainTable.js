import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Ensure correct import for firebaseConfig
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import Modal from 'react-modal';
import './MainTable.css';

export const MainTable = ({ year, season }) => {
  const [records, setRecords] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        const q = query(eventsCollectionRef, where('year', '==', year), where('season', '==', season));
        const data = await getDocs(q);
        setRecords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Firestore query failed. Ensure that your database rules and structure are correct.");
      }
    };
    fetchData();
  }, [year, season]);

  const handleAddNewEvent = async () => {
    try {
      const eventsCollectionRef = collection(db, 'events');
      await addDoc(eventsCollectionRef, {
        ...newEvent,
        year,
        season,
        numAttendees: calculateAttendees(newEvent.numRegistered, newEvent.percentAttendance),
      });
      setEventModalOpen(false);
      const q = query(eventsCollectionRef, where('year', '==', year), where('season', '==', season));
      const data = await getDocs(q);
      setRecords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleAddNewSeason = async () => {
    try {
      const eventsCollectionRef = collection(db, 'events');
      const seasonEvents = generateSeasonEvents(newSeason);
      for (const event of seasonEvents) {
        await addDoc(eventsCollectionRef, { ...event, year, season });
      }
      setSeasonModalOpen(false);
      const q = query(eventsCollectionRef, where('year', '==', year), where('season', '==', season));
      const data = await getDocs(q);
      setRecords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error adding season:", error);
    }
  };

  const calculateAttendees = (numRegistered, percentAttendance) => {
    return Math.round(numRegistered * (percentAttendance / 100) / 20) * 20;
  };

  const generateSeasonEvents = (seasonDetails) => {
    const events = [];
    const startDate = new Date(seasonDetails.startDate);
    for (let week = 1; week <= seasonDetails.weeks; week++) {
      events.push({
        weekNumber: week.toString(),
        date: new Date(startDate),
        sport: seasonDetails.sport,
        dayOfWeek: seasonDetails.dayOfWeek,
        wtnbOrCoed: seasonDetails.wtnbOrCoed,
        numRegistered: 0,
        percentAttendance: 100,
        numAttendees: 0,
        location: '',
        isContacted: false,
        isConfirmed: false,
        isPizzaNight: false,
        isPizzaOrdered: false,
      });
      startDate.setDate(startDate.getDate() + 7); // Increment the date by a week
    }

    if (seasonDetails.openingParty) {
      events.unshift({
        weekNumber: 'Opening Party',
        date: new Date(startDate.setDate(startDate.getDate() - 14)),
        sport: seasonDetails.sport,
        dayOfWeek: seasonDetails.dayOfWeek,
        wtnbOrCoed: seasonDetails.wtnbOrCoed,
        numRegistered: 0,
        percentAttendance: 100,
        numAttendees: 0,
        location: '',
        isContacted: false,
        isConfirmed: false,
        isPizzaNight: false,
        isPizzaOrdered: false,
      });
    }

    if (seasonDetails.closingParty) {
      events.push({
        weekNumber: 'Closing Party',
        date: new Date(startDate.setDate(startDate.getDate() + 7)),
        sport: seasonDetails.sport,
        dayOfWeek: seasonDetails.dayOfWeek,
        wtnbOrCoed: seasonDetails.wtnbOrCoed,
        numRegistered: 0,
        percentAttendance: 100,
        numAttendees: 0,
        location: '',
        isContacted: false,
        isConfirmed: false,
        isPizzaNight: false,
        isPizzaOrdered: false,
      });
    }

    return events;
  };

  return (
    <div>
      {/* <h2>{`${season} ${year}`}</h2> */}
      <div className='add-event-season-buttons'>
        <button onClick={() => setEventModalOpen(true)}>Add New Event</button>
        <button onClick={() => setSeasonModalOpen(true)}>Add New Season</button>
      </div>

      {/* Render Main Table */}
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
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.weekNumber}</td>
              <td>{new Date(record.date).toLocaleString()}</td>
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
          ))}
        </tbody>
      </table>

      {/* Add New Event Modal */}
      <Modal isOpen={isEventModalOpen} onRequestClose={() => setEventModalOpen(false)}>
        <h2>Add New Event</h2>
        <input
          type="text"
          placeholder="Week Number"
          value={newEvent.weekNumber || ''}
          onChange={(e) => setNewEvent({ ...newEvent, weekNumber: e.target.value })}
        />
        <input
          type="date"
          value={newEvent.date || ''}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Sport"
          value={newEvent.sport || ''}
          onChange={(e) => setNewEvent({ ...newEvent, sport: e.target.value })}
        />
        <input
          type="text"
          placeholder="WTNB or Coed"
          value={newEvent.wtnbOrCoed || ''}
          onChange={(e) => setNewEvent({ ...newEvent, wtnbOrCoed: e.target.value })}
        />
        <button onClick={handleAddNewEvent}>Add Event</button>
        <button onClick={() => setEventModalOpen(false)}>Cancel</button>
      </Modal>

      {/* Add New Season Modal */}
      <Modal isOpen={isSeasonModalOpen} onRequestClose={() => setSeasonModalOpen(false)}>
        <h2>Add New Season</h2>
        <input
          type="text"
          placeholder="Sport"
          value={newSeason.sport}
          onChange={(e) => setNewSeason({ ...newSeason, sport: e.target.value })}
        />
        <input
          type="text"
          placeholder="Day of Week"
          value={newSeason.dayOfWeek}
          onChange={(e) => setNewSeason({ ...newSeason, dayOfWeek: e.target.value })}
        />
        <input
          type="text"
          placeholder="WTNB or Coed"
          value={newSeason.wtnbOrCoed}
          onChange={(e) => setNewSeason({ ...newSeason, wtnbOrCoed: e.target.value })}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={newSeason.startDate}
          onChange={(e) => setNewSeason({ ...newSeason, startDate: e.target.value })}
        />
        <input
          type="number"
          placeholder="Number of Weeks"
          value={newSeason.weeks}
          onChange={(e) => setNewSeason({ ...newSeason, weeks: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={newSeason.openingParty}
            onChange={(e) => setNewSeason({ ...newSeason, openingParty: e.target.checked })}
          />
          Opening Party
        </label>
        <label>
          <input
            type="checkbox"
            checked={newSeason.closingParty}
            onChange={(e) => setNewSeason({ ...newSeason, closingParty: e.target.checked })}
          />
          Closing Party
        </label>
        <button onClick={handleAddNewSeason}>Add Season</button>
        <button onClick={() => setSeasonModalOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
}
