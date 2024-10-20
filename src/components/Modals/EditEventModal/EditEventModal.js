import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { getJsDate } from '../../../utils/getJsDate';

export const EditEventModal = ({
  isOpen,
  onClose,
  event,
  onEdit,
  isEditModalOpen,
  setIsEditModalOpen,
  // editedEvent,
  // setEditedEvent,
  // handleSaveChanges,
  // handleDiscardChanges,
}) => {
  const [editedEvent, setEditedEvent] = useState(event)
  const [time, setTime] = useState({ hour: event?.eventDate?.hour, minute: event?.eventDate?.minute, amPm: event?.eventDate?.amPm });

  const formatDateForInput = (date) => {
    return date instanceof Date ? date?.toISOString().split('T')[0] : '';  // Ensure date is valid
  };

  const handleDateChange = (e) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);  // Create a Date object
    // const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

    setEditedEvent((prev) => ({
      ...prev,
      eventDate: eventDate,
      // dayOfWeek
    }));
  };

  const handleInputChange = (field, value) => {
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!editedEvent?.eventDate || !time.hour || !time.minute || !time.amPm) {
      alert("Please provide both date and time");
      return;
    }
    const transformedDate = getJsDate(editedEvent?.eventDate)
    
    const updatedEvent = {
      ...editedEvent,
      eventDate: {
        year: transformedDate.getFullYear(),
        month: transformedDate.getMonth()+1,
        date: transformedDate.getDate(),
        hour: time.hour,
        minute: time.minute,
        amPm: time.amPm,
      },
    };
    
    onEdit(updatedEvent); //update this
    setIsEditModalOpen(false);  // Close the modal after saving
  };

//   const handleSaveChanges = () => {
//     // Convert the date object into a string format (e.g., "YYYY-MM-DD")
//     const eventDateString = event.eventDate instanceof Date ? event.eventDate.toISOString().split('T')[0] : '';  // Or your preferred format
  
//     const updatedEvent = {
//       ...event,
//       eventDate: eventDateString,  // Send the date as a string to Firestore
//     };
  
//     onEdit(updatedEvent);  // Send the event to Firestore
//     setIsEditModalOpen(false);  // Close the modal after saving
// };

const handleDiscardChanges = () => {
  if (window.confirm("Are you sure you want to discard changes?")) {
      setEditedEvent(event);  // Reset the edited event back to the original state
      setIsEditModalOpen(false);
  }
};

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Edit Event</h2>

      <div>
        <label>Date
          <input
            type="date"
            value={formatDateForInput(getJsDate(editedEvent?.eventDate))}  // YYYY-MM-DD
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
            onChange={(e) => setTime({...time, hour: e.target.value})}
            min="01"
            max="12"
          />
          <span>:</span>
          <input
            type="number"
            placeholder="MM"
            value={time.minute}
            onChange={(e) => setTime({...time, minute: e.target.value})}
            min="00"
            max="59"
          />
          <select
            value={time.amPm}
            onChange={(e) => setTime({...time, amPm: e.target.value})}
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
            value={editedEvent?.weekNumber}
            // onChange={(e) => setEditedEvent({ ...editedEvent, weekNumber: e.target.value })}
            onChange={(e) => handleInputChange('weekNumber', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>Sport
          <input
            type="text"
            value={editedEvent?.sport}
            // onChange={(e) => setEditedEvent({ ...editedEvent, sport: e.target.value })}
            onChange={(e) => handleInputChange('sport', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>WTNB or Coed
          <input
            type="text"
            value={editedEvent?.wtnbOrCoed}
            // onChange={(e) => setEditedEvent({ ...editedEvent, wtnbOrCoed: e.target.value })}
            onChange={(e) => handleInputChange('wtnbOrCoed', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>Number of Attendees
          <input
            type="number"
            value={editedEvent?.numAttendees}
            // onChange={(e) => setEditedEvent({ ...editedEvent, numAttendees: e.target.value })}
            onChange={(e) => handleInputChange('numAttendees', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>Location
          <input
            type="text"
            value={editedEvent?.location}
            // onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Contacted?
          <input
            type="checkbox"
            checked={editedEvent?.isContacted || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isContacted', e.target.checked)}
          />
        </label>
      </div>
      
      <div>
        <label>
          Confirmed?
          <input
            type="checkbox"
            checked={editedEvent?.isConfirmed || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isConfirmed', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          Pizza Night?
          <input
            type="checkbox"
            checked={editedEvent?.isPizzaNight || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isPizzaNight', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          Pizza Ordered?
          <input
            type="checkbox"
            checked={editedEvent?.isPizzaOrdered || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isPizzaOrdered', e.target.checked)}
          />
        </label>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={handleSave}>Save Changes</button>
        <button type="button" onClick={handleDiscardChanges}>Discard Changes</button>
      </div>
    </Modal>
  );
};
