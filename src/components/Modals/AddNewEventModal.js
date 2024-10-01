import React, { useState } from 'react';
import Modal from 'react-modal';

import { getSeason } from '../../utils/seasonUtils';

export const AddNewEventModal = ({ isEventModalOpen, setIsEventModalOpen, newEvent = {}, setNewEvent, handleAddNewEvent, setAllRecords }) => {
  const [time, setTime] = useState({ hour: '', minute: '', amPm: 'AM' });

  // Format the Date object to 'YYYY-MM-DD' for <input type="date">
  const formatDateForInput = (date) => {
    return date instanceof Date ? date.toISOString().split('T')[0] : '';  // Ensure date is valid
  };

  // Handle the date change from the date input
  const handleDateChange = (e) => {
    const [year, month, date] = e.target.value.split('-').map(Number);
    const eventDate = new Date(year, month, date);  // Create Date object from input
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      eventDate,
      sportYear: year,
      sportSeason: getSeason(`${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`).season
    }));
  };

  // Handle generic input changes
  const handleInputChange = (field, value) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value
    }));
  };

  // Handle submitting the event with a formatted timestamp
  const handleAddEventWithTimestamp = () => {
    if (!newEvent.eventDate || !time.hour || !time.minute || !time.amPm) {
      alert("Please provide both date and time");
      return;
    }

    const updatedEvent = {
      ...newEvent,
      eventDate: {
        year: newEvent.eventDate.getFullYear(),
        month: newEvent.eventDate.getMonth()+1,
        date: newEvent.eventDate.getDate(),
        dayOfWeek: newEvent.eventDate.toLocaleDateString('en-US', { weekday: 'long' }),
        hour: time.hour,
        minute: time.minute,
        amPm: time.amPm
      },
    };

    handleAddNewEvent(updatedEvent, setAllRecords, setIsEventModalOpen);
  };

  return (
    <Modal isOpen={isEventModalOpen} onRequestClose={() => setIsEventModalOpen(false)}>
      <h2>Add New Event</h2>

      <div>
      <label>Date
        <input
          type="date"
          value={formatDateForInput(newEvent?.eventDate)}  // Format the Date object to 'YYYY-MM-DD'
          onChange={handleDateChange}
        />
      </label>
      </div>

      <div>
        <label>Time
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
        </label>
      </div>

      <div>
        <label>Week Number
          <input
            type="text"
            placeholder="Week number"
            value={newEvent?.weekNumber || ''}
            onChange={(e) => handleInputChange('weekNumber', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>Sport
          <input
            type="text"
            placeholder="Sport"
            value={newEvent?.sport || ''}
            onChange={(e) => handleInputChange('sport', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>WTNB or Coed
          <input
            type="text"
            value={newEvent?.wtnbOrCoed || ''}
            onChange={(e) => handleInputChange('wtnbOrCoed', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Is Contacted:
          <input
            type="checkbox"
            checked={newEvent?.isContacted || false}
            onChange={(e) => handleInputChange('isContacted', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          Is Confirmed:
          <input
            type="checkbox"
            checked={newEvent.isConfirmed || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isConfirmed', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          Is Pizza Night:
          <input
            type="checkbox"
            checked={newEvent.isPizzaNight || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isPizzaNight', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          Is Pizza Confirmed:
          <input
            type="checkbox"
            checked={newEvent.isPizzaNight || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isPizzaNight', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>Location
          <input
            type="text"
            placeholder="Location"
            value={newEvent?.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </label>
      </div>

      <button type="button" onClick={handleAddEventWithTimestamp}>Add Event</button>
      <button type="button" onClick={() => setIsEventModalOpen(false)}>Cancel</button>
    </Modal>
  );
};
