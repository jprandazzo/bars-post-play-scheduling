import React, { useState } from 'react';
import { sportColors } from '../../../themes/sportColors';
import { EditEventModal } from '../../Modals';

export const EventRow = ({ record, onDelete, onEdit }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedEvent, setEditedEvent] = useState(record);  // Initialize with the current record


    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            onDelete(record.id);
        }
    };

    const handleEditClick = () => {
        setEditedEvent(record);  // Set the current event to be edited
        setIsEditModalOpen(true);  // Open the modal
    };

    const handleSaveChanges = () => {
        // Convert the date object into a string format (e.g., "YYYY-MM-DD")
        const eventDateString = editedEvent.eventDate instanceof Date ? editedEvent.eventDate.toISOString().split('T')[0] : '';  // Or your preferred format
      
        const updatedEvent = {
          ...editedEvent,
          eventDate: eventDateString,  // Send the date as a string to Firestore
        };
      
        onEdit(updatedEvent);  // Send the event to Firestore
        setIsEditModalOpen(false);  // Close the modal after saving
    };

    const handleDiscardChanges = () => {
        if (window.confirm("Are you sure you want to discard changes?")) {
            setEditedEvent(record);  // Reset the edited event back to the original state
            setIsEditModalOpen(false);
        }
    };

    return (
        <>
            <tr key={record.id} style={{ backgroundColor: sportColors[record.sport.toLowerCase()] }}>
                <td>{record.weekNumber}</td>
                <td>{record.eventDate.month}/{record.eventDate.date}/{record.eventDate.year}<br/>{record.eventDate.hour}:{record.eventDate.minute} {record.eventDate.amPm}<br/></td>
                <td>{record.wtnbOrCoed} {record.sport} {record.dayOfWeek}</td>
                <td>{record.numAttendees}</td>
                <td>{record.location}</td>
                <td>
                    <input
                        type="checkbox"
                        checked={record.isContacted}
                        onChange={() => setEditedEvent({ ...editedEvent, isContacted: !editedEvent.isContacted })}
                    />
                </td>
                <td>
                    {record.isContacted && (
                        <input
                            type="checkbox"
                            checked={record.isConfirmed}
                            onChange={() => setEditedEvent({ ...editedEvent, isConfirmed: !editedEvent.isConfirmed })}
                        />
                    )}
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={record.isPizzaNight}
                        onChange={() => setEditedEvent({ ...editedEvent, isPizzaNight: !editedEvent.isPizzaNight })}
                    />
                </td>
                <td>
                    {record.isPizzaNight && (
                        <input
                            type="checkbox"
                            checked={record.isPizzaOrdered}
                            onChange={() => setEditedEvent({ ...editedEvent, isPizzaOrdered: !editedEvent.isPizzaOrdered })}
                        />
                    )}
                </td>
                <td>
                    <button type="button" onClick={handleEditClick}>✏️</button>
                </td>
                <td>
                    <button type="button" onClick={handleDelete}>X</button>
                </td>
            </tr>

            {/* Render EditEventModal */}
            <EditEventModal
                isOpen={isEditModalOpen}
                onClose={handleDiscardChanges}
                event={record}  // Pass the current event into the modal
                editedEvent={editedEvent}
                setEditedEvent={setEditedEvent}
                handleSaveChanges={handleSaveChanges}
                handleDiscardChanges={handleDiscardChanges}
            />
        </>
    );
};
