import React, { useState } from 'react';
import { sportColors } from '../../../themes/sportColors';
import { EditEventModal } from '../../Modals';
import { getJsDate } from '../../../utils/getJsDate';
import { doc, updateDoc } from 'firebase/firestore';  // Import Firestore update function
import { db } from '../../../firebaseConfig';  // Import Firebase config

import './EventRow.css'

export const EventRow = ({ event, onDelete, onEdit }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [editedEvent, setEditedEvent] = useState(event);  // Initialize with the current event

    const handleCheckboxChange = async (field, value) => {
        try {
            const eventRef = doc(db, 'post play events', event.id);  // Reference the event in Firestore
            await updateDoc(eventRef, { [field]: value });  // Update the field with the new boolean value

            // Optionally call the onEdit handler to update the state in the parent component
            onEdit({ ...event, [field]: value });
        } catch (error) {
            console.error(`Error updating ${field} for event ${event.id}:`, error);
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            onDelete(event.id);
        }
    };

    const handleEditClick = () => {
        // setEditedEvent(event);  // Set the current event to be edited
        setIsEditModalOpen(true);  // Open the modal
    };



    return (
        <>
            <tr key={event.id} style={{ backgroundColor: sportColors[event.sport.toLowerCase()] }}>
                <td>{event.weekNumber}</td>
                <td>{getJsDate(event.eventDate).toLocaleDateString('en-US', { weekday: 'long' })}<br/>{event.eventDate.month}/{event.eventDate.date}/{event.eventDate.year}<br/>{event.eventDate.hour}:{event.eventDate.minute} {event.eventDate.amPm}<br/></td>
                <td>{event.wtnbOrCoed} {event.sport} {event.sportDayOfWeek}</td>
                <td>{event.numAttendees}</td>
                <td>{event.location}</td>
                <td>
                    <input
                        type="checkbox"
                        checked={event.isContacted}
                        onChange={() => handleCheckboxChange('isContacted', !event.isContacted)}

                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={event.isConfirmed}
                        onChange={() => handleCheckboxChange('isConfirmed', !event.isConfirmed)}
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={event.isPizzaNight}
                        onChange={() => handleCheckboxChange('isPizzaNight', !event.isPizzaNight)}  
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={event.isPizzaOrdered}
                        onChange={() => handleCheckboxChange('isPizzaOrdered', !event.isPizzaOrdered)} 
                    />
                </td>
                <td>
                    <button className="edit-delete-event-button" type="button" onClick={handleEditClick}>✏️</button>
                    <button className="edit-delete-event-button" type="button" onClick={handleDelete}>X</button>
                </td>
            </tr>

            <EditEventModal
                isOpen={isEditModalOpen}
                // onClose={handleDiscardChanges}
                event={event}  // Pass the current event into the modal
                onEdit={onEdit}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                // editedEvent={editedEvent}
                // setEditedEvent={setEditedEvent}
                // handleSaveChanges={handleSaveChanges}
                // handleDiscardChanges={handleDiscardChanges}
            />
        </>
    );
};
