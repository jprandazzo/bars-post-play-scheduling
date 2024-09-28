import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

export const EditEventModal = ({
  isOpen,
  onClose,
  event,
  editedEvent,
  setEditedEvent,
  handleSaveChanges,
  handleDiscardChanges,
}) => {
  const [time, setTime] = useState({ hour: '', minute: '', amPm: 'AM' });

  // Initialize the state for editedEvent when the modal opens
  useEffect(() => {
    if (event) {
      // Convert eventDate to a Date object if it's a string
      const eventDate = new Date(event.eventDate);
      const hours = eventDate.getHours() % 12 || 12;
      const minutes = eventDate.getMinutes();
      const amPm = eventDate.getHours() >= 12 ? 'PM' : 'AM';

      setEditedEvent(event);  // Set the initial state for editedEvent
      setTime({
        hour: hours.toString().padStart(2, '0'),
        minute: minutes.toString().padStart(2, '0'),
        amPm,
      });
    }
  }, [event, setEditedEvent]);

  // Function to format Date object to 'YYYY-MM-DD'
  const formatDateForInput = (date) => {
    // Check if date is valid and handle both string and Date objects
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    const parsedDate = new Date(date);  // Try to parse a string as a Date object
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split('T')[0];
    }

    console.error('Invalid or undefined date:', date);  // Log invalid dates
    return '';  // Fallback to empty string for invalid dates
  };

  const handleDateChange = (e) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);  // Create a Date object
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

    setEditedEvent((prev) => ({
      ...prev,
      eventDate,
      dayOfWeek
    }));
  };

  const handleSave = () => {
    if (!editedEvent.eventDate || !time.hour || !time.minute || !time.amPm) {
      alert("Please provide both date and time");
      return;
    }

    const combinedDate = new Date(
      editedEvent.eventDate.getFullYear(),
      editedEvent.eventDate.getMonth(),
      editedEvent.eventDate.getDate(),
      time.amPm === 'PM' ? parseInt(time.hour, 10) + 12 : parseInt(time.hour, 10),
      parseInt(time.minute, 10)
    );

    const updatedEvent = {
      ...editedEvent,
      eventDate: combinedDate,
    };

    handleSaveChanges(updatedEvent);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Edit Event</h2>

      {/* Date input */}
      <label>Date</label>
      <input
        type="date"
        value={formatDateForInput(editedEvent.eventDate)}  // Format the Date object to 'YYYY-MM-DD'
        onChange={handleDateChange}
      />

      {/* Week number input */}
      <label>Week Number</label>
      <input
        type="text"
        value={editedEvent.weekNumber}
        onChange={(e) => setEditedEvent({ ...editedEvent, weekNumber: e.target.value })}
      />

      {/* Sport input */}
      <label>Sport</label>
      <input
        type="text"
        value={editedEvent.sport}
        onChange={(e) => setEditedEvent({ ...editedEvent, sport: e.target.value })}
      />

      {/* WTNB or Coed input */}
      <label>WTNB or Coed</label>
      <input
        type="text"
        value={editedEvent.wtnbOrCoed}
        onChange={(e) => setEditedEvent({ ...editedEvent, wtnbOrCoed: e.target.value })}
      />

      {/* Day of Week */}
      <label>Day of Week</label>
      <input
        type="text"
        value={editedEvent.dayOfWeek}
        readOnly
      />

      {/* Number of Attendees */}
      <label>Number of Attendees</label>
      <input
        type="number"
        value={editedEvent.numAttendees}
        onChange={(e) => setEditedEvent({ ...editedEvent, numAttendees: e.target.value })}
      />

      {/* Location */}
      <label>Location</label>
      <input
        type="text"
        value={editedEvent.location}
        onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
      />

      {/* Confirmed checkbox */}
      <label>
        Is Confirmed:
        <input
          type="checkbox"
          checked={editedEvent.isConfirmed || false}
          onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
        />
      </label>

      {/* Buttons */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handleSave}>Save Changes</button>
        <button onClick={handleDiscardChanges}>Discard Changes</button>
      </div>
    </Modal>
  );
};
