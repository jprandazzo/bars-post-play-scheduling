import React, { useState } from 'react';
import Modal from 'react-modal';
import { FormControl, Dropdown } from 'react-bootstrap';
import { getSeason } from '../../utils/seasonUtils';

// Utility function to normalize strings (remove special characters and case sensitivity)
const normalizeString = (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

export const AddNewEventModal = ({ isEventModalOpen, setIsEventModalOpen, newEvent = {}, setNewEvent, handleAddNewEvent, setAllRecords, allRecords }) => {
  const [time, setTime] = useState({ hour: '8', minute: '00', amPm: 'PM' });
  const [locationInput, setLocationInput] = useState('');  // Track the location input
  const [dayOfWeekInput, setDayOfWeekInput] = useState('');  // Track the location input
  const [sportInput, setSportInput] = useState('');  // Track the sport input
  const [wtnbOrCoedInput, setWtnbOrCoedInput] = useState('');  // Track the wtnbOrCoed input
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);  // Control visibility of location dropdown
  const [showSportDropdown, setShowSportDropdown] = useState(false);  // Control visibility of sport dropdown
  const [showDayOfWeekDropdown, setShowDayOfWeekDropdown] = useState(false);  // Control visibility of sport dropdown
  const [showWtnbOrCoedDropdown, setShowWtnbOrCoedDropdown] = useState(false);  // Control visibility of wtnbOrCoed dropdown

  // Extract unique values for sports, WTNB/Coed, and locations from allRecords
  const uniqueSports = ['Bowling', 'Dodgeball', 'Kickball', 'Pickleball'];
  const uniqueDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const uniqueWtnbOrCoed = ['WTNB', 'Coed']
  const uniqueLocations = [...new Set(allRecords.map(record => record.location))];
  console.log(allRecords)
  console.log(uniqueLocations)

  // Filter values based on input
  const filteredLocations = uniqueLocations.filter(location =>
    normalizeString(location).includes(normalizeString(locationInput))
  );
  const filteredSports = uniqueSports.filter(sport =>
    normalizeString(sport).includes(normalizeString(sportInput))
  );
  const filteredDaysOfWeek = uniqueDaysOfWeek.filter(day => 
    normalizeString(day).includes(normalizeString(dayOfWeekInput))
  )
  const filteredWtnbOrCoed = uniqueWtnbOrCoed.filter(option =>
    normalizeString(option).includes(normalizeString(wtnbOrCoedInput))
  );

  const formatDateForInput = (date) => {
    return date instanceof Date ? date.toISOString().split('T')[0] : '';
  };

  const handleDateChange = (e) => {
    const [year, month, date] = e.target.value.split('-').map(Number);
    const eventDate = new Date(year, month - 1, date);
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      eventDate,
      sportYear: year,
      sportSeason: getSeason(`${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`).season
    }));
  };

  const handleInputChange = (field, value) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value
    }));
  };

  const handleAddEventWithTimestamp = () => {
    if (!newEvent.eventDate || !time.hour || !time.minute || !time.amPm) {
      alert("Please provide both date and time");
      return;
    }

    const updatedEvent = {
      ...newEvent,
      eventDate: {
        year: newEvent.eventDate.getFullYear(),
        month: newEvent.eventDate.getMonth() + 1,
        date: newEvent.eventDate.getDate(),
        dayOfWeek: newEvent.eventDate.toLocaleDateString('en-US', { weekday: 'long' }),
        hour: time.hour,
        minute: time.minute,
        amPm: time.amPm
      },
      wtnbOrCoed: wtnbOrCoedInput,
      sport: sportInput,
      sportDayOfWeek: dayOfWeekInput,
      location: locationInput
    };

    handleAddNewEvent(updatedEvent, setAllRecords, setIsEventModalOpen);
  };

  // Handle keyboard navigation (arrow keys and enter key)
  const handleKeyDown = (e, filteredOptions, input, setInput, setShowDropdown) => {
    if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
      const nextOption = filteredOptions[0];
      setInput(nextOption);
    }
    if (e.key === 'Enter' && input) {
      setShowDropdown(false);
    }
  };

  return (
      <Modal isOpen={isEventModalOpen} onRequestClose={() => setIsEventModalOpen(false)}>
        <h2>Add New Event</h2>
        <div className='modal-container'>    </div>
        <div>
          <label>Post Play / Event Date 
            <br/>
            <input
              type="date"
              value={formatDateForInput(newEvent?.eventDate)}
              onChange={handleDateChange}
            />
          </label>
        </div>

        <div>
          <label>Time
            <br/>
            <input
              type="number"
              placeholder="HH"
              value={time.hour}
              onChange={(e) => setTime({ ...time, hour: e.target.value })}
              min="01"
              max="12"
            />
            <span>:</span>
            <input
              type="number"
              placeholder="MM"
              value={time.minute}
              onChange={(e) => setTime({ ...time, minute: e.target.value })}
              min="00"
              max="59"
            />
            <select
              value={time.amPm}
              onChange={(e) => setTime({ ...time, amPm: e.target.value })}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </label>
        </div>

        <div>
          <label>Week Number
            <br/>
            <input
              type="text"
              placeholder="Week number"
              value={newEvent?.weekNumber || ''}
              onChange={(e) => handleInputChange('weekNumber', e.target.value)}
            />
          </label>
        </div>

        {/* Sport Input: Free text search with matching dropdown */}
        <div>
          Sport
          <FormControl
            type="text"
            placeholder="Search or select sport"
            value={sportInput}
            onFocus={() => setShowSportDropdown(true)}
            onBlur={() => setTimeout(() => setShowSportDropdown(false), 200)}  // Hide dropdown after blur
            onChange={(e) => setSportInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, filteredSports, sportInput, setSportInput, setShowSportDropdown)}
            style={{ maxWidth: '20em' }}  // Apply max-width to input
          />
          {showSportDropdown && filteredSports.length > 0 && (
            <Dropdown.Menu show className="dropdown-menu">
              {filteredSports.map((sport) => (
                <Dropdown.Item
                  key={sport}
                  onClick={() => {
                    handleInputChange('sport', sport);
                    setSportInput(sport);
                    setShowSportDropdown(false);
                  }}
                >
                  {sport}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </div>

        <div>
          Day
          <FormControl
            type="text"
            placeholder="Search or select day of week"
            value={dayOfWeekInput}
            onFocus={() => setShowDayOfWeekDropdown(true)}
            onBlur={() => setTimeout(() => setShowDayOfWeekDropdown(false), 200)}  // Hide dropdown after blur
            onChange={(e) => setDayOfWeekInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, filteredDaysOfWeek, dayOfWeekInput, setDayOfWeekInput, setShowDayOfWeekDropdown)}
            style={{ maxWidth: '20em' }}  // Apply max-width to input
          />
          {showDayOfWeekDropdown && filteredDaysOfWeek.length > 0 && (
            <Dropdown.Menu show className="dropdown-menu">
              {filteredDaysOfWeek.map((sport) => (
                <Dropdown.Item
                  key={sport}
                  onClick={() => {
                    handleInputChange('sport', sport);
                    setDayOfWeekInput(sport);
                    setShowDayOfWeekDropdown(false);
                  }}
                >
                  {sport}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </div>

        {/* WTNB or Coed Input: Free text search with matching dropdown */}
        <div>
          WTNB or Coed
          <FormControl
            type="text"
            placeholder="Search or select WTNB or Coed"
            value={wtnbOrCoedInput}
            onFocus={() => setShowWtnbOrCoedDropdown(true)}
            onBlur={() => setTimeout(() => setShowWtnbOrCoedDropdown(false), 200)}
            onChange={(e) => setWtnbOrCoedInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, filteredWtnbOrCoed, wtnbOrCoedInput, setWtnbOrCoedInput, setShowWtnbOrCoedDropdown)}
            style={{ maxWidth: '20em' }}
          />
          {showWtnbOrCoedDropdown && filteredWtnbOrCoed.length > 0 && (
            <Dropdown.Menu show className="dropdown-menu">
              {filteredWtnbOrCoed.map((option) => (
                <Dropdown.Item
                  key={option}
                  onClick={() => {
                    handleInputChange('wtnbOrCoed', option);
                    setWtnbOrCoedInput(option);
                    setShowWtnbOrCoedDropdown(false);
                  }}
                >
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </div>

        {/* Location Input: Free text search with matching dropdown */}
        <div>
          Location
          <FormControl
            type="text"
            placeholder="Search or select location"
            value={locationInput}
            onFocus={() => setShowLocationDropdown(true)}
            onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}  // Hide dropdown after blur
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, filteredLocations, locationInput, setLocationInput, setShowLocationDropdown)}
            style={{ maxWidth: '20em' }}  // Apply max-width to input
          />
          {showLocationDropdown && filteredLocations.length > 0 && (
            <Dropdown.Menu show className="dropdown-menu">
              {filteredLocations.map((location) => (
                <Dropdown.Item
                  key={location}
                  onClick={() => {
                    handleInputChange('location', location);
                    setLocationInput(location);
                    setShowLocationDropdown(false);
                  }}
                >
                  {location}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </div>

        <div>
          <label>Est # of Attendees
            <br/>
            <input
              type="text"
              placeholder="# of Attendees"
              value={newEvent?.numAttendees || ''}
              onChange={(e) => handleInputChange('numAttendees', e.target.value)}
            />
          </label>
        </div>

      <div>
        <label>
          Contacted?
          <input
            type="checkbox"
            checked={newEvent.isContacted || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isContacted', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          Confirmed?
          <input
            type="checkbox"
            checked={newEvent.isConfirmed || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isConfirmed', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          Pizza Night?
          <input
            type="checkbox"
            checked={newEvent.isPizzaNight || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isPizzaNight', e.target.checked)}
          />
        </label>
      </div>

      <div>
        <label>
          Pizza Ordered?
          <input
            type="checkbox"
            checked={newEvent.isPizzaOrdered || false}
            // onChange={(e) => setEditedEvent({ ...editedEvent, isConfirmed: e.target.checked })}
            onChange={(e) => handleInputChange('isPizzaOrdered', e.target.checked)}
          />
        </label>
      </div>

        <button type="button" onClick={handleAddEventWithTimestamp}>Add Event</button>
        <button type="button" onClick={() => setIsEventModalOpen(false)}>Cancel</button>
      </Modal>
  );
};
