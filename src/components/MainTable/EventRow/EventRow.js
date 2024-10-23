import React, { useState } from 'react';
import { eventLocations } from '../../../themes/eventLocations';
import { EditEventModal } from '../../Modals';
import { getJsDate } from '../../../utils/getJsDate';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../contexts/AuthContext';  // Import AuthContext for user authentication
import './EventRow.css'

export const EventRow = ({ event, onDelete, onEdit }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [editedEvent, setEditedEvent] = useState(event);  // Initialize with the current event
    const { currentUser } = useAuth();  // Get currentUser from AuthContext


    const getEventLocationWithNeighborhood = (location) => {
        if (eventLocations.hkLocations.includes(location)) return (
            <td className='event-location-hk'>
                <p><b>{location}</b></p>
                <br/>
                <span><small><u>Neighbordhood:</u>
                <br/>
                Hell's Kitchen</small></span>
            </td>
        )
        if (eventLocations.wvLocations.includes(location)) return (
            <td className='event-location-wv'>
                <p><b>{location}</b></p>
                <br/>
                <span><small><u>Neighbordhood:</u>
                <br/>
                West Village</small></span>
            </td>
        )
        if (eventLocations.chelseaLocations.includes(location)) return (
            <td className='event-location-chelsea'>
                <p><b>{location}</b></p>
                <br/>
                <span><small><u>Neighbordhood:</u>
                <br/>
                Chelsea</small></span>
            </td>
        )
        return location
    }

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
            {/* <tr key={event.id} style={{ backgroundColor: sportColors[event.sport.toLowerCase()] }}> */}
            <tr key={event.id} className={event.sport}>
                <td>{event.weekNumber}</td>
                <td>{getJsDate(event.eventDate).toLocaleDateString('en-US', { weekday: 'long' })}<br/>{event.eventDate.month}/{event.eventDate.date}/{event.eventDate.year}<br/>{event.eventDate.hour}:{event.eventDate.minute} {event.eventDate.amPm}<br/></td>
                <td className='event-row-sport'>
                    <span className='event-row-sportName'>{event.sport}</span>
                    <br/>
                    <span className='event-row-sportDayOfWeek'>{event.sportDayOfWeek}</span>
                    <br/>
                    <span className='event-row-wtnbOrCoed'>{event.wtnbOrCoed}</span>
                </td>
                <td>{event.numAttendees}</td>

                {getEventLocationWithNeighborhood(event.location)}
                <td>
                    <input
                        type="checkbox"
                        className={currentUser ? "clickable" : "disabled"}
                        checked={event.isContacted}
                        onChange={() => handleCheckboxChange('isContacted', !event.isContacted)}
                        disabled={!currentUser}
                        title={!currentUser ? "Please log in using your @bigapplerecsports.com email to make changes" : ""}
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        className={currentUser ? "clickable" : "disabled"}
                        checked={event.isConfirmed}
                        onChange={() => handleCheckboxChange('isConfirmed', !event.isConfirmed)}
                        disabled={!currentUser}
                        title={!currentUser ? "Please log in using your @bigapplerecsports.com email to make changes" : ""}
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        className={currentUser ? "clickable" : "disabled"}
                        checked={event.isPizzaNight}
                        onChange={() => handleCheckboxChange('isPizzaNight', !event.isPizzaNight)}
                        disabled={!currentUser}
                        title={!currentUser ? "Please log in using your @bigapplerecsports.com email to make changes" : ""}
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        className={currentUser ? "clickable" : "disabled"}
                        checked={event.isPizzaOrdered}
                        onChange={() => handleCheckboxChange('isPizzaOrdered', !event.isPizzaOrdered)}
                        disabled={!currentUser}
                        title={!currentUser ? "Please log in using your @bigapplerecsports.com email to make changes" : ""}
                    />
                </td>
                <td>
                    <button
                        className={`edit-delete-event-button ${currentUser ? "clickable" : "disabled"}`}
                        type="button"
                        onClick={handleEditClick}
                        disabled={!currentUser}
                        title={!currentUser ? "Please log in using your @bigapplerecsports.com email to make changes" : ""}
                    >
                        ✏️
                    </button>
                    <button
                        className={`edit-delete-event-button ${currentUser ? "clickable" : "disabled"}`}
                        type="button"
                        onClick={handleDelete}
                        disabled={!currentUser}
                        title={!currentUser ? "Please log in using your @bigapplerecsports.com email to make changes" : ""}
                    >
                        X
                    </button>
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
