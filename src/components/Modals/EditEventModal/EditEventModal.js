import React, { useState } from 'react';
import Modal from 'react-modal';

import { DropdownInput } from '../../../common/DropdownInput';
import { useEvents } from '../../../contexts/EventsContext';

import { getJsDate } from '../../../utils/getJsDate';
import { getSeason } from '../../../utils/seasonUtils';

const normalizeString = (str) => {
    return str?.replace(/[^a-zA-Z0-9]/g, '')?.toLowerCase();
};

export const EditEventModal = ({
    isOpen,
    onClose,
    event,
    onEdit,
    isEditModalOpen,
    setIsEditModalOpen,
}) => {
    const { allEvents } = useEvents();
    const [editedEvent, setEditedEvent] = useState(event);
    const [time, setTime] = useState({
        hour: event?.eventDate?.hour || '',
        minute: event?.eventDate?.minute || '',
        amPm: event?.eventDate?.amPm || '',
    });
    const [isDateValid, setIsDateValid] = useState(true);
    const [showSportDropdown, setShowSportDropdown] = useState(false);
    const [showDayOfWeekDropdown, setShowDayOfWeekDropdown] = useState(false);
    const [showWtnbOrCoedDropdown, setShowWtnbOrCoedDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [highlightedSportIndex, setHighlightedSportIndex] = useState(-1);
    const [highlightedDayIndex, setHighlightedDayIndex] = useState(-1);
    const [highlightedWtnbOrCoedIndex, setHighlightedWtnbOrCoedIndex] =
        useState(-1);
    const [highlightedLocationIndex, setHighlightedLocationIndex] =
        useState(-1);

    const uniqueSports = ['Bowling', 'Dodgeball', 'Kickball', 'Pickleball'];
    const uniqueDaysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const uniqueWtnbOrCoed = ['WTNB', 'Coed'];
    const uniqueLocations = [
        ...new Set(allEvents.map((event) => event.location)),
    ];

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '4em',
            maxWidth: '500px',
            width: 'auto',
            height: 'auto',
            maxHeight: '100vh',
            overflowY: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
    };

    const filteredSports = uniqueSports.filter((sport) =>
        normalizeString(sport).includes(normalizeString(editedEvent.sport))
    );
    const filteredDaysOfWeek = uniqueDaysOfWeek.filter((day) =>
        normalizeString(day).includes(
            normalizeString(editedEvent.sportDayOfWeek)
        )
    );
    const filteredLocations = uniqueLocations.filter((location) =>
        normalizeString(location).includes(
            normalizeString(editedEvent.location)
        )
    );
    const filteredWtnbOrCoed = uniqueWtnbOrCoed.filter((option) =>
        normalizeString(option).includes(
            normalizeString(editedEvent.wtnbOrCoed)
        )
    );

    const formatDateForInput = (date) =>
        date instanceof Date ? date?.toISOString().split('T')[0] : '';

    const handleDateChange = (e) => {
        const [year, month, date] = e.target.value.split('-').map(Number);

        const isValid =
            !Number.isNaN(Date.parse(`${year}-${month}-${date}`)) &&
            e.target.value.length === 10;

        if (isValid) {
            const eventDate = new Date(year, month - 1, date);

            setEditedEvent((prev) => ({
                ...prev,
                eventDate: eventDate,
                sportYear: year,
                sportSeason: getSeason(
                    `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`
                ).season,
            }));
        }

        setIsDateValid(isValid);
    };

    const handleInputChange = (field, value) => {
        setEditedEvent((prevEvent) => ({
            ...prevEvent,
            [field]: value,
        }));
    };

    const handleSaveChanges = () => {
        if (
            !editedEvent?.eventDate ||
            !time.hour ||
            !time.minute ||
            !time.amPm
        ) {
            alert('Please provide both date and time');
            return;
        }
        const transformedDate = getJsDate(editedEvent?.eventDate);

        const updatedEvent = {
            ...editedEvent,
            eventDate: {
                year: transformedDate.getFullYear(),
                month: transformedDate.getMonth() + 1,
                date: transformedDate.getDate(),
                hour: time.hour,
                minute: time.minute,
                amPm: time.amPm,
            },
        };

        onEdit(updatedEvent); //update this
        setIsEditModalOpen(false); // Close the modal after saving
    };

    const handleDiscardChanges = () => {
        if (window.confirm('Are you sure you want to discard changes?')) {
            setEditedEvent(event); // Reset the edited event back to the original state
            setIsEditModalOpen(false);
        }
    };

    return (
        // todo: align these attributes with the ones on the AddEventModal
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
            <h3>Edit Event</h3>

            <div className="form-container">
                <div className="form-row">
                    <label htmlFor="eventDate">Post Play / Event Date</label>
                    <input
                        id="eventDate"
                        type="date"
                        value={formatDateForInput(editedEvent?.eventDate)} // YYYY-MM-DD
                        onChange={handleDateChange}
                        style={{ borderColor: isDateValid ? '' : 'red' }}
                    />
                    <br />
                    {!isDateValid && (
                        <span className="error-message">
                            <font color="red">
                                Invalid date. Please enter a valid date.
                            </font>
                        </span>
                    )}
                </div>

                <div className="form-row">
                    <label htmlFor="eventTime">Time</label>
                    <div>
                        <input
                            type="number"
                            placeholder="HH"
                            value={time.hour}
                            onChange={(e) =>
                                setTime({ ...time, hour: e.target.value })
                            }
                            min="01"
                            max="12"
                        />
                        <span>:</span>
                        <input
                            type="number"
                            placeholder="MM"
                            value={time.minute}
                            onChange={(e) =>
                                setTime({ ...time, minute: e.target.value })
                            }
                            min="00"
                            max="59"
                        />
                        <select
                            value={time.amPm}
                            onChange={(e) =>
                                setTime({ ...time, amPm: e.target.value })
                            }
                        >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <label htmlFor="weekNumber">Week Number</label>
                    <br />
                    <input
                        id="weekNumber"
                        type="text"
                        placeholder="Week number"
                        value={editedEvent?.weekNumber}
                        onChange={(e) =>
                            handleInputChange('weekNumber', e.target.value)
                        }
                    />
                </div>

                <DropdownInput
                    id="sport"
                    label="Sport"
                    placeholder="Search or select sport"
                    value={editedEvent.sport}
                    options={filteredSports}
                    onChange={(value) => handleInputChange('sport', value)}
                    showDropdown={showSportDropdown}
                    setShowDropdown={setShowSportDropdown}
                    highlightedIndex={highlightedSportIndex}
                    setHighlightedIndex={setHighlightedSportIndex}
                />

                <DropdownInput
                    id="dayOfWeek"
                    label={`What day of ${editedEvent.sport || 'sport'} is this for?`}
                    placeholder="Search or select day of week"
                    value={editedEvent.sportDayOfWeek}
                    options={filteredDaysOfWeek}
                    onChange={(value) =>
                        handleInputChange('sportDayOfWeek', value)
                    }
                    showDropdown={showDayOfWeekDropdown}
                    setShowDropdown={setShowDayOfWeekDropdown}
                    highlightedIndex={highlightedDayIndex}
                    setHighlightedIndex={setHighlightedDayIndex}
                />

                <DropdownInput
                    id="wtnbOrCoed"
                    label="WTNB or Coed"
                    placeholder="Select WTNB or Coed"
                    value={editedEvent.wtnbOrCoed}
                    options={filteredWtnbOrCoed}
                    onChange={(value) => handleInputChange('wtnbOrCoed', value)}
                    showDropdown={showWtnbOrCoedDropdown}
                    setShowDropdown={setShowWtnbOrCoedDropdown}
                    highlightedIndex={highlightedWtnbOrCoedIndex}
                    setHighlightedIndex={setHighlightedWtnbOrCoedIndex}
                />

                <DropdownInput
                    id="location"
                    label="Location"
                    placeholder="Search or select location"
                    value={editedEvent.location}
                    options={filteredLocations}
                    onChange={(value) => handleInputChange('location', value)}
                    showDropdown={showLocationDropdown}
                    setShowDropdown={setShowLocationDropdown}
                    highlightedIndex={highlightedLocationIndex}
                    setHighlightedIndex={setHighlightedLocationIndex}
                />

                <div className="form-row">
                    <label htmlFor="numAttendees">Est # of Attendees</label>
                    <div>
                        <input
                            id="numAttendees"
                            type="text"
                            placeholder="# of Attendees"
                            value={editedEvent?.numAttendees || ''}
                            onChange={(e) =>
                                handleInputChange(
                                    'numAttendees',
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>

                <div className="form-row">
                    <label htmlFor="isContacted">Contacted?</label>
                    <div>
                        <input
                            id="isContacted"
                            type="checkbox"
                            checked={editedEvent.isContacted || false}
                            onChange={(e) =>
                                handleInputChange(
                                    'isContacted',
                                    e.target.checked
                                )
                            }
                        />
                    </div>
                </div>

                <div className="form-row">
                    <label htmlFor="isConfirmed">Confirmed?</label>
                    <div>
                        <input
                            id="isConfirmed"
                            type="checkbox"
                            checked={editedEvent.isConfirmed || false}
                            onChange={(e) =>
                                handleInputChange(
                                    'isConfirmed',
                                    e.target.checked
                                )
                            }
                        />
                    </div>
                </div>

                <div className="form-row">
                    <label htmlFor="isPizzaNight">Pizza Night?</label>
                    <div>
                        <input
                            id="isPizzaNight"
                            type="checkbox"
                            checked={editedEvent.isPizzaNight || false}
                            onChange={(e) =>
                                handleInputChange(
                                    'isPizzaNight',
                                    e.target.checked
                                )
                            }
                        />
                    </div>
                </div>

                <div className="form-row">
                    <label htmlFor="isPizzaOrdered">Pizza Ordered?</label>
                    <div>
                        <input
                            id="isPizzaOrdered"
                            type="checkbox"
                            checked={editedEvent.isPizzaOrdered || false}
                            onChange={(e) =>
                                handleInputChange(
                                    'isPizzaOrdered',
                                    e.target.checked
                                )
                            }
                        />
                    </div>
                </div>
            </div>

            <div
                className="button-group"
                style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={!isDateValid}
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleDiscardChanges}
                >
                    Discard Changes
                </button>
            </div>
        </Modal>
    );
};
