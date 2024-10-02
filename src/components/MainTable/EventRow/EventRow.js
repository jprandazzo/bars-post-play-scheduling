import React, { useState } from 'react';
import { sportColors } from '../../../themes/sportColors';
import { EditEventModal } from '../../Modals';
import { getJsDate } from '../../../utils/getJsDate';
import { doc, updateDoc } from 'firebase/firestore';  // Import Firestore update function
import { db } from '../../../firebaseConfig';  // Import Firebase config

import './EventRow.css'

export const EventRow = ({ record, onDelete, onEdit }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [editedEvent, setEditedEvent] = useState(record);  // Initialize with the current record

    const handleCheckboxChange = async (field, value) => {
        try {
            const recordRef = doc(db, 'post play events', record.id);  // Reference the record in Firestore
            await updateDoc(recordRef, { [field]: value });  // Update the field with the new boolean value

            // Optionally call the onEdit handler to update the state in the parent component
            onEdit({ ...record, [field]: value });
        } catch (error) {
            console.error(`Error updating ${field} for record ${record.id}:`, error);
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            onDelete(record.id);
        }
    };

    const handleEditClick = () => {
        // setEditedEvent(record);  // Set the current event to be edited
        setIsEditModalOpen(true);  // Open the modal
    };



    return (
        <>
            <tr key={record.id} style={{ backgroundColor: sportColors[record.sport.toLowerCase()] }}>
                <td>{record.weekNumber}</td>
                <td>{getJsDate(record.eventDate).toLocaleDateString('en-US', { weekday: 'long' })}<br/>{record.eventDate.month}/{record.eventDate.date}/{record.eventDate.year}<br/>{record.eventDate.hour}:{record.eventDate.minute} {record.eventDate.amPm}<br/></td>
                <td>{record.wtnbOrCoed} {record.sport} {record.dayOfWeek}</td>
                <td>{record.numAttendees}</td>
                <td>{record.location}</td>
                <td>
                    <input
                        type="checkbox"
                        checked={record.isContacted}
                        onChange={() => handleCheckboxChange('isContacted', !record.isContacted)}

                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={record.isConfirmed}
                        onChange={() => handleCheckboxChange('isConfirmed', !record.isConfirmed)}
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={record.isPizzaNight}
                        onChange={() => handleCheckboxChange('isPizzaNight', !record.isPizzaNight)}  
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={record.isPizzaOrdered}
                        onChange={() => handleCheckboxChange('isPizzaOrdered', !record.isPizzaOrdered)} 
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
                event={record}  // Pass the current event into the modal
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
