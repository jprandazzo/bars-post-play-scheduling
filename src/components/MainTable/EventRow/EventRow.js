import React, { useState } from 'react';

import { eventLocations } from '../../../themes/eventLocations';
import { EditEventModal } from '../../Modals';
import { getJsDate } from '../../../utils/getJsDate';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../../contexts/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import './EventRow.css';

export const EventRow = ({ event, onDelete, onEdit }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [editedEvent, setEditedEvent] = useState(event);  // Initialize with the current event
    const { currentUser } = useAuth();

    const getEventLocationWithNeighborhood = (location) => {
        if (eventLocations.hkLocations.includes(location))
            return (
                <td className="event-location-hk">
                    <p>
                        <b>{location}</b>
                    </p>
                    <span>
                        <small>
                            <u>Neighbordhood:</u>
                            <br />
                            Hell's Kitchen
                        </small>
                    </span>
                </td>
            );
        if (eventLocations.wvLocations.includes(location))
            return (
                <td className="event-location-wv">
                    <p>
                        <b>{location}</b>
                    </p>
                    <span>
                        <small>
                            <u>Neighbordhood:</u>
                            <br />
                            West Village
                        </small>
                    </span>
                </td>
            );
        if (eventLocations.chelseaLocations.includes(location))
            return (
                <td className="event-location-chelsea">
                    <p>
                        <b>{location}</b>
                    </p>
                    <span>
                        <small>
                            <u>Neighbordhood:</u>
                            <br />
                            Chelsea
                        </small>
                    </span>
                </td>
            );
        return location ? (
            <td className="event-location-chelsea">
                <p>
                    <b>{location}</b>
                </p>
            </td>
        ) : (
            <td>
                No Location <br />
                Selected
            </td>
        );
    };

    const handleCheckboxChange = async (field, value) => {
        try {
            const eventRef = doc(db, 'post play events', event.id);
            await updateDoc(eventRef, { [field]: value });

            onEdit({ ...event, [field]: value });
        } catch (error) {
            console.error(
                `Error updating ${field} for event ${event.id}:`,
                error
            );
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            onDelete(event.id);
        }
    };

    const handleEditClick = () => {
        // setEditedEvent(event);  // Set the current event to be edited
        setIsEditModalOpen(true); // Open the modal
    };

    return (
        <>
            <tr key={event.id} className={event.sport}>
                <td id="week-column-row">{event.weekNumber}</td>
                <td id="date-filter-row">
                    {getJsDate(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                    })}
                    <br />
                    {event.eventDate.month}/{event.eventDate.date}/
                    {event.eventDate.year}
                    <br />
                    {event.eventDate.hour}:{event.eventDate.minute}{' '}
                    {event.eventDate.amPm}
                    <br />
                </td>
                <td className="event-row-sport">
                    <span className="event-row-sportName">{event.sport}</span>
                    <br />
                    <span className="event-row-sportDayOfWeek">
                        {event.sportDayOfWeek}
                    </span>
                    <br />
                    <span className="event-row-wtnbOrCoed">
                        {event.wtnbOrCoed}
                    </span>
                </td>
                <td id="attendees-column">{event.numAttendees}</td>

                {getEventLocationWithNeighborhood(event.location)}
                <td>
                    <div className="button-pair">
                        <button
                            onClick={() =>
                                handleCheckboxChange(
                                    'isContacted',
                                    !event.isContacted
                                )
                            }
                            className={`status-btn ${event.isContacted ? 'blue' : ''} ${currentUser ? 'clickable' : 'disabled'}`}
                            disabled={!currentUser}
                            title={
                                !currentUser
                                    ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                    : ''
                            }
                        >
                            Contacted? {event.isContacted ? 'Yes ✓' : 'No'}
                        </button>
                        <button
                            onClick={() =>
                                handleCheckboxChange(
                                    'isConfirmed',
                                    !event.isConfirmed
                                )
                            }
                            className={`status-btn ${event.isConfirmed ? 'blue' : ''} ${currentUser ? 'clickable' : 'disabled'}`}
                            disabled={!currentUser}
                            title={
                                !currentUser
                                    ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                    : ''
                            }
                        >
                            Confirmed? {event.isConfirmed ? 'Yes ✓' : 'No'}
                        </button>
                    </div>
                    <div className="button-pair">
                        <button
                            onClick={() =>
                                handleCheckboxChange(
                                    'isPizzaNight',
                                    !event.isPizzaNight
                                )
                            }
                            className={`status-btn ${event.isPizzaNight ? 'blue' : ''} ${currentUser ? 'clickable' : 'disabled'}`}
                            disabled={!currentUser}
                            title={
                                !currentUser
                                    ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                    : ''
                            }
                        >
                            Pizza Night? {event.isPizzaNight ? 'Yes ✓' : 'No'}
                        </button>
                        <button
                            onClick={() =>
                                handleCheckboxChange(
                                    'isPizzaOrdered',
                                    !event.isPizzaOrdered
                                )
                            }
                            className={`status-btn ${event.isPizzaOrdered ? 'blue' : ''} ${currentUser ? 'clickable' : 'disabled'}`}
                            disabled={!currentUser}
                            title={
                                !currentUser
                                    ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                    : ''
                            }
                        >
                            Pizza Ordered?{' '}
                            {event.isPizzaOrdered ? 'Yes ✓' : 'No'}
                        </button>
                    </div>
                </td>

                <td id="actions-column-row">
                    {/* <button
                        className={`edit-delete-event-button ${currentUser ? "clickable" : "disabled"}`}
                        type="button"
                        onClick={handleEditClick}
                        disabled={!currentUser}
                        title={!currentUser ? "Please log in using your @bigapplerecsports.com email to make changes" : ""}
                    > */}
                    <FontAwesomeIcon
                        onClick={currentUser ? handleEditClick : null}
                        icon={faPenToSquare}
                        className={`fa-2xl ${currentUser ? 'clickable' : 'disabled'}`}
                        title={
                            !currentUser
                                ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                : ''
                        }
                        style={{
                            cursor: currentUser ? 'pointer' : 'not-allowed',
                            opacity: currentUser ? 1 : 0.5,
                            color: '#DEB716',
                        }} // Visual feedback for disabled state
                    />
                    <br />
                    <br />
                    <br />
                    {/* </button> */}
                    <FontAwesomeIcon
                        onClick={currentUser ? handleDelete : null}
                        icon={faTrash}
                        className={`fa-2xl ${currentUser ? 'clickable' : 'disabled'}`}
                        title={
                            !currentUser
                                ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                : ''
                        }
                        style={{
                            cursor: currentUser ? 'pointer' : 'not-allowed',
                            opacity: currentUser ? 1 : 0.5,
                            color: '#DC3444',
                        }}
                    />
                </td>
            </tr>

            <EditEventModal
                isOpen={isEditModalOpen}
                // onClose={handleDiscardChanges}
                event={event}
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
