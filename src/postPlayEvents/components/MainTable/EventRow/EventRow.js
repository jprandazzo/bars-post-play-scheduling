import React, { useState } from 'react';

import { eventLocations } from '../../../themes/eventLocations';
import { EditEventModal } from '../../../components/Modals';
import { getJsDate } from '../../../utils/getJsDate';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useAuth } from '../../../../contexts/AuthContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import './EventRow.css';

export const EventRow = ({ event, onDelete, onEdit }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { currentUser } = useAuth();
    const [hoveredButton, setHoveredButton] = useState(null);

    const getFormattedHours = militaryHours => {
        if (!(!!militaryHours && militaryHours >= 0 && militaryHours <=23 )) return "error - please check data"

        const formattedHour = 
            militaryHours > 12 ? militaryHours - 12 : 
                militaryHours === 0 ? 12 : militaryHours
        
        const formattedAmPm = militaryHours < 12 ? "AM" : "PM"
        return {hour: formattedHour, amPm: formattedAmPm}
    }

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
            <td className="event-location-unknown">
                <p>
                    No Location <br />
                    Selected
                </p>
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
        setIsEditModalOpen(true);
    };

    const handleMouseOver = (button) => {
        setHoveredButton(button);
    };

    const handleMouseOut = () => {
        setHoveredButton(null);
    };

    return (
        <>
            <tr key={event.id} className={event.sport}>
                <td id="week-column-row">{event.weekNumber}</td>
                <td id="date-filter-row">
                    {/* {getJsDate(event.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                    })} */}
                    {event.eventDate?.dayOfWeek}
                    <br />
                    {event.eventDate?.month}/{event.eventDate?.date}/
                    {event.eventDate?.year}
                    <br />
                    {getFormattedHours(event.eventDate.hour).hour}:{event.eventDate.minute}{' '}
                    {getFormattedHours(event.eventDate.hour).amPm}
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
                            onMouseOver={() => handleMouseOver('isContacted')}
                            onMouseOut={handleMouseOut}
                            onClick={() =>
                                handleCheckboxChange(
                                    'isContacted',
                                    !event.isContacted
                                )
                            }
                            className={`status-btn ${event.isContacted ? 'blue' : ''} ${currentUser ? 'clickable' : 'disabled'}`}
                            disabled={!currentUser}
                            style={
                                hoveredButton === 'isContacted'
                                    ? {
                                          backgroundColor: '#7bacf5',
                                          color: 'white',
                                      }
                                    : {}
                            }
                            title={
                                !currentUser
                                    ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                    : ''
                            }
                        >
                            Contacted? {event.isContacted ? '✓' : 'X'}
                        </button>
                        <button
                            onMouseOver={() => handleMouseOver('isConfirmed')}
                            onMouseOut={handleMouseOut}
                            onClick={() =>
                                handleCheckboxChange(
                                    'isConfirmed',
                                    !event.isConfirmed
                                )
                            }
                            className={`status-btn ${event.isConfirmed ? 'blue' : ''} ${currentUser && event.isContacted ? 'clickable' : 'disabled'}`}
                            disabled={!currentUser || !event.isContacted}
                            style={
                                hoveredButton === 'isConfirmed'
                                    ? {
                                          backgroundColor: '#7bacf5',
                                          color: 'white',
                                      }
                                    : {}
                            }
                            title={
                                !currentUser
                                    ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                    : ''
                            }
                        >
                            Confirmed? {event.isConfirmed ? '✓' : 'X'}
                        </button>
                    </div>
                    <div className="button-pair">
                        <button
                            onMouseOver={() => handleMouseOver('isPizzaNight')}
                            onMouseOut={handleMouseOut}
                            onClick={() =>
                                handleCheckboxChange(
                                    'isPizzaNight',
                                    !event.isPizzaNight
                                )
                            }
                            className={`status-btn ${event.isPizzaNight ? 'blue' : ''} ${currentUser ? 'clickable' : 'disabled'}`}
                            disabled={!currentUser}
                            style={
                                hoveredButton === 'isPizzaNight'
                                    ? {
                                          backgroundColor: '#7bacf5',
                                          color: 'white',
                                      }
                                    : {}
                            }
                            title={
                                !currentUser
                                    ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                    : ''
                            }
                        >
                            Pizza? {event.isPizzaNight ? '✓' : 'X'}
                        </button>
                        <button
                            onMouseOver={() =>
                                handleMouseOver('isPizzaOrdered')
                            }
                            onMouseOut={handleMouseOut}
                            onClick={() =>
                                handleCheckboxChange(
                                    'isPizzaOrdered',
                                    !event.isPizzaOrdered
                                )
                            }
                            className={`status-btn ${event.isPizzaOrdered ? 'blue' : ''} ${currentUser && event.isPizzaNight ? 'clickable' : 'disabled'}`}
                            disabled={!currentUser || !event.isPizzaNight}
                            style={
                                hoveredButton === 'isPizzaOrdered'
                                    ? {
                                          backgroundColor: '#7bacf5',
                                          color: 'white',
                                      }
                                    : {}
                            }
                            title={
                                !currentUser
                                    ? 'Please log in using your @bigapplerecsports.com email to make changes'
                                    : ''
                            }
                        >
                            Ordered? {event.isPizzaOrdered ? '✓' : 'X'}
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
