import React, { useState } from 'react';
import Modal from 'react-modal';


import { getSeason } from '../../utils/seasonUtils';
import { parseDateInput } from '../../utils/dateUtils';
import { convertTimestampToFormattedString } from '../../utils/dateUtils';

export const AddNewEventModal = ({ isEventModalOpen, setEventModalOpen, newEvent = {}, setNewEvent, handleAddNewEvent, setAllRecords }) => {
  const [time, setTime] = useState({ hour: '', minute: '', amPm: 'AM' });

  // Function to format Date object to 'YYYY-MM-DD'
  const formatDateForInput = (date) => {
    return date instanceof Date ? date.toISOString().split('T')[0] : '';  // Ensure date is a valid Date object
  };

  const handleDateChange = (e) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);  // Create a Date object
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
    console.log("AddNewEventModal updated eventDate:", eventDate);  // Log updated eventDate


    // Update the event state with the date change
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      eventDate,  // Store as a Date object
      dayOfWeek,
      sportYear: year,
      sportSeason: getSeason(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`).season
    }));

    console.log("Updated event after date change:", eventDate);  // Debugging log
  };

  const handleInputChange = (field, value) => {
    setNewEvent((prevEvent) => {
      // Ensure state immutability and update correctly
      const updatedEvent = {
        ...prevEvent,
        [field]: value
      };

      console.log(`Updated event for field ${field}:`, updatedEvent);  // Debugging log for each field change
      return updatedEvent;
    });
  };

  const handleAddEventWithTimestamp = () => {
    if (!newEvent.eventDate || !time.hour || !time.minute || !time.amPm) {
      alert("Please provide both date and time");
      return;
    }
  
    const combinedDate = parseDateInput(newEvent.eventDate, time);  // Combine date and time
  
    // Convert the Date object back to the required string format
    const eventDateString = convertTimestampToFormattedString(combinedDate, "MMMM d, yyyy 'at' hh:mm:ss a z");
  
    const updatedEvent = {
      ...newEvent,
      eventDate: eventDateString,  // Save as string in Firestore
    };
  
    handleAddNewEvent(updatedEvent, setAllRecords, setEventModalOpen);
  };
  
  
  

  return (
    <Modal isOpen={isEventModalOpen} onRequestClose={() => setEventModalOpen(false)}>
      <h2>Add New Event</h2>

      {/* Date input */}
      <label>Date</label>
      <input
        type="date"
        value={formatDateForInput(newEvent?.eventDate)}  // Format the Date object to 'YYYY-MM-DD'
        onChange={handleDateChange}
      />

      {/* Week number input */}
      <label>Week Number</label>
      <input
        type="text"
        placeholder="Week number"
        value={newEvent?.weekNumber || ''}  // Display the current state
        onChange={(e) => handleInputChange('weekNumber', e.target.value)}  // Update the state
      />

      {/* Sport input */}
      <label>Sport</label>
      <input
        type="text"
        placeholder="Sport"
        value={newEvent?.sport || ''}  // Display the current state
        onChange={(e) => handleInputChange('sport', e.target.value)}  // Update the state
      />

      {/* WTNB or Coed input */}
      <label>WTNB or Coed</label>
      <input
        type="text"
        value={newEvent?.wtnbOrCoed || ''}  // Display the current state
        onChange={(e) => handleInputChange('wtnbOrCoed', e.target.value)}  // Update the state
      />

      {/* Confirmed checkbox */}
      <label>
        Is Confirmed:
        <input
          type="checkbox"
          checked={newEvent?.isConfirmed || false}  // Display the current state
          onChange={(e) => handleInputChange('isConfirmed', e.target.checked)}  // Update the state
        />
      </label>

      {/* Location */}
      <label>Location</label>
      <input
        type="text"
        placeholder="Location"
        value={newEvent?.location || ''}  // Display the current state
        onChange={(e) => handleInputChange('location', e.target.value)}  // Update the state
      />

      {/* Time Input Section */}
      <label>Time</label>
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

      {/* Buttons */}
      <button onClick={handleAddEventWithTimestamp}>Add Event</button>
      <button onClick={() => setEventModalOpen(false)}>Cancel</button>
    </Modal>
  );
};
