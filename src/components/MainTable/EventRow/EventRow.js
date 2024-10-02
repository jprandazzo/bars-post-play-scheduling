import React, { useState } from 'react';
import { sportColors } from '../../../themes/sportColors';
import { EditEventModal } from '../../Modals';

import { getJsDate } from '../../../utils/getJsDate';

import './EventRow.css'

export const EventRow = ({ record, onDelete, onEdit }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [editedEvent, setEditedEvent] = useState(record);  // Initialize with the current record


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
                        // onChange={() => setEditedEvent({ ...editedEvent, isContacted: !editedEvent.isContacted })}
                    />
                </td>
                <td>
                    {record.isContacted && (
                        <input
                            type="checkbox"
                            checked={record.isConfirmed}
                            // onChange={() => setEditedEvent({ ...editedEvent, isConfirmed: !editedEvent.isConfirmed })}
                        />
                    )}
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={record.isPizzaNight}
                        // onChange={() => setEditedEvent({ ...editedEvent, isPizzaNight: !editedEvent.isPizzaNight })}
                    />
                </td>
                <td>
                    {record.isPizzaNight && (
                        <input
                            type="checkbox"
                            checked={record.isPizzaOrdered}
                            // onChange={() => setEditedEvent({ ...editedEvent, isPizzaOrdered: !editedEvent.isPizzaOrdered })}
                        />
                    )}
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
