import React, { useState } from 'react';
import Modal from 'react-modal';
import { Timestamp } from 'firebase/firestore'; // Assuming you're using Firebase
import { getCurrentSeason } from '../../utils/seasonUtils/getCurrentSeason';

export const AddNewEventModal = ({ isEventModalOpen, setEventModalOpen, newEvent, setNewEvent, handleAddNewEvent, setAllRecords }) => {
  // State to hold the time values
  const [time, setTime] = useState({
    hour: '',
    minute: '',
    amPm: 'AM'
  });

  // Function to auto-populate dayOfWeek, season, and year based on the event date
  const handleDateChange = (e) => {
    const eventDate = new Date(e.target.value);
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    const year = eventDate.getFullYear();
    
    // Determine season based on month
    const month = eventDate.getMonth() + 1; // getMonth() is zero-based
    let season = '';
    if ([12, 1, 2].includes(month)) {
      season = 'Winter';
    } else if ([3, 4, 5].includes(month)) {
      season = 'Spring';
    } else if ([6, 7, 8].includes(month)) {
      season = 'Summer';
    } else {
      season = 'Fall';
    }

    setNewEvent({
      ...newEvent,
      eventDate: e.target.value,
      dayOfWeek,
      sportYear: year,
      sportSeason: season
    });
  };

  // Function to combine date and time into a Timestamp object
  const handleAddEventWithTimestamp = () => {
    if (!newEvent.eventDate || !time.hour || !time.minute || !time.amPm) {
      alert("Please provide both date and time");
      return;
    }

    const [year, month, day] = newEvent.eventDate.split('-');
    const hour = parseInt(time.hour, 10) % 12 + (time.amPm === 'PM' ? 12 : 0); // Convert to 24-hour format
    const minute = parseInt(time.minute, 10);

    const combinedDate = new Date(year, month - 1, day, hour, minute); // Combine date and time

    // const eventTimestamp = Timestamp.fromDate(combinedDate); // Create Firebase Timestamp with seconds and nanoseconds

    // console.log(eventTimestamp)
    const updatedEvent = {
      ...newEvent,
      eventDate: combinedDate,
      year: combinedDate.getFullYear(),
      season: getCurrentSeason(combinedDate) // Save the Timestamp in the event
    };

    handleAddNewEvent(updatedEvent, setAllRecords, setEventModalOpen);
  };

  return (
    <Modal isOpen={isEventModalOpen} onRequestClose={() => setEventModalOpen(false)}>
      <h2>Add New Event</h2>

      {/* Date input */}
      <input
        type="date"
        placeholder="Event Date"
        value={newEvent.eventDate || ''}
        onChange={handleDateChange}
      />

      {/* Week number input */}
      <input
        type="text"
        placeholder="Week number"
        value={newEvent.weekNumber || ''}
        onChange={(e) => setNewEvent({ ...newEvent, weekNumber: e.target.value })}
      />

      <input
        type="text"
        placeholder="Sport"
        value={newEvent.sport || ''}
        onChange={(e) => setNewEvent({ ...newEvent, sport: e.target.value })}
      />

      {/* Display auto-populated fields */}
      <input
        type="text"
        placeholder="Day of Week"
        value={newEvent.dayOfWeek || ''}
        readOnly
      />

      <input
        type="text"
        placeholder="Sport Season"
        value={newEvent.sportSeason || ''}
        readOnly
      />

      <input
        type="number"
        placeholder="Sport Year"
        value={newEvent.sportYear || ''}
        readOnly
      />

      {/* Time Input Section */}
      <div>
        <input
          type="number"
          placeholder="HH"
          value={time.hour}
          onChange={(e) => setTime({ ...time, hour: e.target.value })}
          min="01"
          max="12"
        />
        <span>:</span>
        <input
          type="number"
          placeholder="MM"
          value={time.minute}
          onChange={(e) => setTime({ ...time, minute: e.target.value })}
          min="00"
          max="59"
        />
        <select
          value={time.amPm}
          onChange={(e) => setTime({ ...time, amPm: e.target.value })}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="WTNB or Coed"
        value={newEvent.wtnbOrCoed || ''}
        onChange={(e) => setNewEvent({ ...newEvent, wtnbOrCoed: e.target.value })}
      />

      <label>
        Is Confirmed:
        <input
          type="checkbox"
          checked={newEvent.isConfirmed || false}
          onChange={(e) => setNewEvent({ ...newEvent, isConfirmed: e.target.checked })}
        />
      </label>

      {/* Other inputs for remaining fields */}
      <input
        type="text"
        placeholder="Location"
        value={newEvent.location || ''}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
      />

      <button onClick={handleAddEventWithTimestamp}>Add Event</button>
      <button onClick={() => setEventModalOpen(false)}>Cancel</button>
    </Modal>
  );
};
