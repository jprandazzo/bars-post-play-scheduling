import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';

import { DropdownInput } from '../../../common/DropdownInput';
import { useEvents } from '../../../contexts/EventsContext';
import { getSeason } from '../../../utils/seasonUtils';
import { LabelWithoutInputFocus } from '../../../common/LabelWithoutInputFocus';

import 'react-datepicker/dist/react-datepicker.css';
import '../AddNewEventModal/AddNewEventModal.css';

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
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        event?.eventDate
            ? new Date(
                  event.eventDate.year,
                  event.eventDate.month - 1,
                  event.eventDate.date
              )
            : null
    );
    const [selectedTime, setSelectedTime] = useState(null);
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

    useEffect(() => {
        if (event.eventDate.hour && event.eventDate.minute) {
            const hour =
                event.eventDate.amPm === 'PM' && event.eventDate.hour < 12
                    ? event.eventDate.hour + 12
                    : event.eventDate.hour; // Convert to 24-hour format if PM
            const time = new Date();
            time.setHours(hour, event.eventDate.minute, 0, 0); // Set hours and minutes
            setSelectedTime(time); // Initialize selectedTime with the event's time
        }
    }, [event]);

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

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setHasChanges(true);
        if (date) {
            setEditedEvent((prevEvent) => ({
                ...prevEvent,
                eventDate: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1, // JavaScript months are 0-based
                    date: date.getDate(),
                    dayOfWeek: date.toLocaleDateString('en-US', {
                        weekday: 'long',
                    }),
                },
                sportYear: date.getFullYear(),
                sportSeason: getSeason(
                    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                ).season,
            }));
        }
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
        setHasChanges(true);
        if (time) {
            setEditedEvent((prevEvent) => ({
                ...prevEvent,
                eventDate: {
                    ...prevEvent.eventDate,
                    hour: time.getHours(),
                    minute: time.getMinutes().toString().padStart(2, '0'),
                    amPm: time.getHours() >= 12 ? 'PM' : 'AM',
                },
            }));
        }
    };

    const handleInputChange = (field, value) => {
        setEditedEvent((prevEvent) => ({
            ...prevEvent,
            [field]: value,
        }));
        setHasChanges(true);
    };

    const handleSaveChanges = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please provide both date and time');
            return;
        }

        onEdit(editedEvent); // Pass the updated event back to the parent
        setIsEditModalOpen(false);
        setHasChanges(false);
    };

    const handleDiscardChanges = () => {
        if (hasChanges) {
            if (window.confirm('Are you sure you want to discard changes?')) {
                setEditedEvent(event); // Reset the edited event back to the original state
                setIsEditModalOpen(false);
                setHasChanges(false);
            }
        } else {
            setIsEditModalOpen(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
            <h3>Edit Event</h3>

            <div className="form-container">
                <div className="form-row">
                    <LabelWithoutInputFocus htmlFor="eventDate">
                        Post Play / Event Date
                    </LabelWithoutInputFocus>
                    <DatePicker
                        id="eventDate"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/dd/yyyy"
                        className="form-control"
                        placeholderText="Select date"
                    />
                </div>

                <div className="form-row">
                    <LabelWithoutInputFocus htmlFor="eventTime">
                        Time
                    </LabelWithoutInputFocus>
                    <DatePicker
                        id="eventTime"
                        selected={selectedTime}
                        onChange={handleTimeChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="form-control"
                        placeholderText="Select time"
                    />
                </div>

                <div className="form-row">
                    <LabelWithoutInputFocus htmlFor="weekNumber">
                        Week Number
                    </LabelWithoutInputFocus>
                    <input
                        id="weekNumber"
                        type="text"
                        placeholder="Week number"
                        value={editedEvent?.weekNumber || ''}
                        onChange={(e) =>
                            handleInputChange('weekNumber', e.target.value)
                        }
                    />
                </div>

                <DropdownInput
                    id="sport"
                    label="Sport"
                    placeholder="Search/select sport"
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
                    placeholder="Search/select day of week"
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
                    <LabelWithoutInputFocus htmlFor="numAttendees">
                        Est # of Attendees
                    </LabelWithoutInputFocus>
                    <input
                        id="numAttendees"
                        type="text"
                        placeholder="# of Attendees"
                        value={editedEvent?.numAttendees || ''}
                        onChange={(e) =>
                            handleInputChange('numAttendees', e.target.value)
                        }
                    />
                </div>

                <div className="form-row">
                    <LabelWithoutInputFocus htmlFor="isContacted">
                        Contacted?
                    </LabelWithoutInputFocus>
                    <div className="modal-checkbox-container">
                        <input
                            className="modal-checkbox"
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
                    <LabelWithoutInputFocus htmlFor="isConfirmed">
                        Confirmed?
                    </LabelWithoutInputFocus>
                    <div className="modal-checkbox-container">
                        <input
                            className="modal-checkbox"
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
                    <LabelWithoutInputFocus htmlFor="isPizzaNight">
                        Pizza Night?
                    </LabelWithoutInputFocus>
                    <div className="modal-checkbox-container">
                        <input
                            className="modal-checkbox"
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
                    <LabelWithoutInputFocus htmlFor="isPizzaOrdered">
                        Pizza Ordered?
                    </LabelWithoutInputFocus>
                    <div className="modal-checkbox-container">
                        <input
                            className="modal-checkbox"
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
                    className="save-changes-btn"
                    onClick={handleSaveChanges}
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
