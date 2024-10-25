import React, { useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';

import { LabelWithoutInputFocus } from '../../../common/LabelWithoutInputFocus';
import { getSeason } from '../../../utils/seasonUtils';
import { useEvents } from '../../../contexts/EventsContext';
import { DropdownInput } from '../../../common/DropdownInput';

import 'react-datepicker/dist/react-datepicker.css';
import './AddNewEventModal.css';

const normalizeString = (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

export const AddNewEventModal = ({
    isEventModalOpen,
    setIsEventModalOpen,
    handleAddNewEvent,
    setUniqueLocations,
    setUserFilters,
}) => {
    const { allEvents, setAllEvents } = useEvents();
    // const [time, setTime] = useState({ hour: '8', minute: '00', amPm: 'PM' });
    const [selectedDate, setSelectedDate] = useState(null);
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
    // const [isDateValid, setIsDateValid] = useState(true);
    const [newEvent, setNewEvent] = useState({
        eventDate: {
            year: '',
            month: '',
            date: '',
            dayOfWeek: '',
            hour: '',
            minute: '',
            amPm: '',
        },
        weekNumber: '',
        sport: '',
        wtnbOrCoed: '',
        sportDayOfWeek: '',
        location: '',
        isContacted: false,
        isConfirmed: false,
        isPizzaNight: false,
        isPizzaOrdered: false,
        numAttendees: 0,
        numRegistered: 0,
        percentAttendance: 100,
    });

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
            padding: '2.5em',
            maxWidth: '500px',
            width: 'auto',
            minWidth: '25em',
            height: 'auto',
            maxHeight: '100vh',
            overflowY: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
    };

    const filteredSports = uniqueSports.filter((sport) =>
        normalizeString(sport).includes(normalizeString(newEvent.sport))
    );
    const filteredDaysOfWeek = uniqueDaysOfWeek.filter((day) =>
        normalizeString(day).includes(normalizeString(newEvent.sportDayOfWeek))
    );
    const filteredLocations = uniqueLocations.filter((location) =>
        normalizeString(location).includes(normalizeString(newEvent.location))
    );
    const filteredWtnbOrCoed = uniqueWtnbOrCoed.filter((option) =>
        normalizeString(option).includes(normalizeString(newEvent.wtnbOrCoed))
    );

    // const handleDateChange = (e) => {
    //   const [year, month, date] = e.target.value.split('-').map(Number);

    //   const isValid = !Number.isNaN(Date.parse(`${year}-${month}-${date}`)) && e.target.value.length === 10;

    //   if (isValid) {
    //     const eventDate = new Date(year, month - 1, date);

    //     setNewEvent((prevEvent) => ({
    //       ...prevEvent,
    //       eventDate,
    //       sportYear: year,
    //       sportSeason: getSeason(`${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`).season
    //     }));
    //   }

    //   setIsDateValid(isValid);
    // };

    const handleInputChange = (field, value) => {
        setNewEvent((prevEvent) => ({
            ...prevEvent,
            [field]: value,
        }));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date); // Set the selected date
        if (date) {
            setNewEvent((prevEvent) => ({
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
        if (time) {
            setNewEvent((prevEvent) => ({
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

    // const handleAddEventWithTimestamp = () => {
    //   if (!newEvent.eventDate || !time.hour || !time.minute || !time.amPm) {
    //     alert("Please provide both date and time");
    //     return;
    //   }

    //   const updatedEvent = {
    //     ...newEvent,
    //     eventDate: {
    //       year: newEvent.eventDate.getFullYear(),
    //       month: newEvent.eventDate.getMonth() + 1,
    //       date: newEvent.eventDate.getDate(),
    //       dayOfWeek: newEvent.eventDate.toLocaleDateString('en-US', { weekday: 'long' }),
    //       hour: time.hour,
    //       minute: time.minute,
    //       amPm: time.amPm
    //     }
    //   };

    //   handleAddNewEvent(updatedEvent, setAllEvents, setIsEventModalOpen);
    // };

    // const handleAddEventWithTimestamp = () => {
    //   // REPLACE: You no longer need the manual date validation
    //   if (!selectedDate || !time.hour || !time.minute || !time.amPm) {
    //     alert("Please provide both date and time");
    //     return;
    //   }

    //   const updatedEvent = {
    //     ...newEvent,
    //     eventDate: {
    //       ...newEvent.eventDate,
    //       hour: time.hour,
    //       minute: time.minute,
    //       amPm: time.amPm
    //     }
    //   };

    //   handleAddNewEvent(updatedEvent, setAllEvents, setIsEventModalOpen);
    // };

    const handleAddEventWithTimestamp = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please provide both date and time');
            return;
        }

        handleAddNewEvent(
            newEvent,
            setAllEvents,
            setIsEventModalOpen,
            setUniqueLocations,
            setUserFilters
        );
    };

    return (
        <Modal
            isOpen={isEventModalOpen}
            onRequestClose={() => setIsEventModalOpen(false)}
            style={customStyles}
        >
            <h3>Add New Event</h3>

            <div className="form-container">
                {/* <div className="form-row">
            <label htmlFor="eventDate">Post Play / Event Date</label>
            <div>
              <input
                id="eventDate"
                type="date"
                value={formatDateForInput(newEvent?.eventDate)}
                onChange={handleDateChange}
                style={{ borderColor: isDateValid ? '' : 'red' }}
              />
              <br />
              {!isDateValid && (
                <span className="error-message">
                  <font color="red">Invalid date. Please enter a valid date.</font>
                </span>
              )}
            </div>
          </div> */}

                {/* ADD: Use react-datepicker instead of the manual date input */}
                <div className="form-row">
                    <LabelWithoutInputFocus>
                        Post Play / Event Date
                        {/* <FontAwesomeIcon
                icon={faCalendarAlt}
                className="calendar-icon"
                onClick={() => document.getElementById('eventDate').focus()}
              /> */}
                    </LabelWithoutInputFocus>
                    <DatePicker
                        id="eventDate"
                        placeholderText="Type/select a date"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/dd/yyyy"
                        className="form-control"
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
                        timeIntervals={15} // 15-minute intervals for time selection
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        className="form-control"
                        placeholderText="Type/select a time"
                    />
                </div>

                <div className="form-row">
                    <LabelWithoutInputFocus htmlFor="weekNumber">
                        Week Number
                    </LabelWithoutInputFocus>
                    <div>
                        <input
                            id="weekNumber"
                            type="text"
                            placeholder="Week number"
                            value={newEvent?.weekNumber || ''}
                            onChange={(e) =>
                                handleInputChange('weekNumber', e.target.value)
                            }
                        />
                    </div>
                </div>

                <DropdownInput
                    id="sport"
                    label="Sport"
                    placeholder="Search/select sport"
                    value={newEvent.sport}
                    options={filteredSports}
                    onChange={(value) => handleInputChange('sport', value)}
                    showDropdown={showSportDropdown}
                    setShowDropdown={setShowSportDropdown}
                    highlightedIndex={highlightedSportIndex}
                    setHighlightedIndex={setHighlightedSportIndex}
                />

                <DropdownInput
                    id="dayOfWeek"
                    label={`What day of ${newEvent.sport || 'sport'} is this for?`}
                    placeholder="Search/select day of week"
                    value={newEvent.sportDayOfWeek}
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
                    value={newEvent.wtnbOrCoed}
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
                    value={newEvent.location}
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
                    <div>
                        <input
                            id="numAttendees"
                            type="text"
                            placeholder="# of Attendees"
                            value={newEvent?.numAttendees || ''}
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
                    <LabelWithoutInputFocus htmlFor="isContacted">
                        Contacted?
                    </LabelWithoutInputFocus>
                    <div className="modal-checkbox-container">
                        <input
                            className="modal-checkbox"
                            id="isContacted"
                            type="checkbox"
                            checked={newEvent.isContacted || false}
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
                            checked={newEvent.isConfirmed || false}
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
                            checked={newEvent.isPizzaNight || false}
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
                            checked={newEvent.isPizzaOrdered || false}
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

            <div className="button-group">
                <button
                    type="button"
                    className="add-event-btn"
                    onClick={handleAddEventWithTimestamp}
                    // disabled={!isDateValid}
                >
                    Add Event
                </button>
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsEventModalOpen(false)}
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
};
