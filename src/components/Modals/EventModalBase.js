// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { getSeason } from '../../utils/seasonUtils';
// import { useEvents } from '../../contexts/EventsContext';
// import { DropdownInput } from '../../common/DropdownInput';
// import { getJsDate } from '../../utils/getJsDate';

// // Utility function to normalize strings (remove special characters and case sensitivity)
// const normalizeString = (str) => {
//   return str ? str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : str;
// };

// export const EventModalBase = ({
//   isOpen,
//   onClose,
//   handleSave,
//   event: initialEvent = {},
//   title
// }) => {
//   const { allEvents } = useEvents();

//   const [time, setTime] = useState({
//     hour: initialEvent?.eventDate?.hour || '8',
//     minute: initialEvent?.eventDate?.minute || '00',
//     amPm: initialEvent?.eventDate?.amPm || 'PM',
//   });

//   const [isDateValid, setIsDateValid] = useState(true);
//   const [newEvent, setNewEvent] = useState(initialEvent);

//   const [showSportDropdown, setShowSportDropdown] = useState(false);
//   const [showDayOfWeekDropdown, setShowDayOfWeekDropdown] = useState(false);
//   const [showWtnbOrCoedDropdown, setShowWtnbOrCoedDropdown] = useState(false);
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const [highlightedSportIndex, setHighlightedSportIndex] = useState(-1);
//   const [highlightedDayIndex, setHighlightedDayIndex] = useState(-1);
//   const [highlightedWtnbOrCoedIndex, setHighlightedWtnbOrCoedIndex] = useState(-1);
//   const [highlightedLocationIndex, setHighlightedLocationIndex] = useState(-1);

//   const uniqueSports = ['Bowling', 'Dodgeball', 'Kickball', 'Pickleball'];
//   const uniqueDaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const uniqueWtnbOrCoed = ['WTNB', 'Coed'];
//   const uniqueLocations = [...new Set(allEvents.map(event => event.location))];

//   const customStyles = {
//     content: {
//       top: '50%',
//       left: '50%',
//       right: 'auto',
//       bottom: 'auto',
//       transform: 'translate(-50%, -50%)',
//       padding: '2.5em',
//       maxWidth: '500px',
//       width: 'auto',
//       minWidth: '25em',
//       height: 'auto',
//       maxHeight: '100vh',
//       overflowY: 'auto',
//       borderRadius: '8px',
//       boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//     }
//   };

//   const filteredSports = uniqueSports.filter(sport => normalizeString(sport).includes(normalizeString(newEvent.sport)));
//   const filteredDaysOfWeek = uniqueDaysOfWeek.filter(day => normalizeString(day).includes(normalizeString(newEvent.sportDayOfWeek)));
//   const filteredLocations = uniqueLocations.filter(location => normalizeString(location).includes(normalizeString(newEvent.location)));
//   const filteredWtnbOrCoed = uniqueWtnbOrCoed.filter(option => normalizeString(option).includes(normalizeString(newEvent.wtnbOrCoed)));

//   const formatDateForInput = (date) => {
//     return date instanceof Date ? date.toISOString().split('T')[0] : '';
//   };

//   const handleDateChange = (e) => {
//     const [year, month, date] = e.target.value.split('-').map(Number);
//     const isValid = !Number.isNaN(Date.parse(`${year}-${month}-${date}`)) && e.target.value.length === 10;

//     if (isValid) {
//       const eventDate = new Date(year, month - 1, date);

//       setNewEvent((prevEvent) => ({
//         ...prevEvent,
//         eventDate,
//         sportYear: year,
//         sportSeason: getSeason(`${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`).season,
//       }));
//     }

//     setIsDateValid(isValid);
//   };

//   const handleInputChange = (field, value) => {
//     setNewEvent((prevEvent) => ({
//       ...prevEvent,
//       [field]: value
//     }));
//   };

//   const handleSaveEvent = () => {
//     if (!newEvent.eventDate || !time.hour || !time.minute || !time.amPm) {
//       alert('Please provide both date and time');
//       return;
//     }

//     const updatedEvent = {
//       ...newEvent,
//       eventDate: {
//         year: newEvent.eventDate.getFullYear(),
//         month: newEvent.eventDate.getMonth() + 1,
//         date: newEvent.eventDate.getDate(),
//         dayOfWeek: newEvent.eventDate.toLocaleDateString('en-US', { weekday: 'long' }),
//         hour: time.hour,
//         minute: time.minute,
//         amPm: time.amPm,
//       }
//     };

//     handleSave(updatedEvent);
//   };

//   return (
//     <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
//       <h3>{title}</h3>

//       <div className="form-container">
//         <div className="form-row">
//           <label htmlFor="eventDate">Post Play / Event Date</label>
//           <div>
//             <input
//               id="eventDate"
//               type="date"
//               value={formatDateForInput(newEvent?.eventDate)}
//               onChange={handleDateChange}
//               style={{ borderColor: isDateValid ? '' : 'red' }}
//             />
//             <br />
//             {!isDateValid && (
//               <span className="error-message">
//                 <font color="red">Invalid date. Please enter a valid date.</font>
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="form-row">
//           <label htmlFor="eventTime">Time</label>
//           <div>
//             <input
//               id="eventHour"
//               type="number"
//               placeholder="HH"
//               value={time.hour}
//               onChange={(e) => setTime({ ...time, hour: e.target.value })}
//               min="01"
//               max="12"
//             />
//             <span>:</span>
//             <input
//               id="eventMinute"
//               type="number"
//               placeholder="MM"
//               value={time.minute}
//               onChange={(e) => setTime({ ...time, minute: e.target.value })}
//               min="00"
//               max="59"
//             />
//             <select
//               id="eventAmPm"
//               value={time.amPm}
//               onChange={(e) => setTime({ ...time, amPm: e.target.value })}
//             >
//               <option value="AM">AM</option>
//               <option value="PM">PM</option>
//             </select>
//           </div>
//         </div>

//         <div className="form-row">
//           <label htmlFor="weekNumber">Week Number</label>
//           <div>
//             <input
//               id="weekNumber"
//               type="text"
//               placeholder="Week number"
//               value={newEvent?.weekNumber || ''}
//               onChange={(e) => handleInputChange('weekNumber', e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Dropdown Inputs */}
//         <DropdownInput
//           id="sport"
//           label="Sport"
//           placeholder="Search or select sport"
//           value={newEvent.sport}
//           options={filteredSports}
//           onChange={(value) => handleInputChange('sport', value)}
//           showDropdown={showSportDropdown}
//           setShowDropdown={setShowSportDropdown}
//           highlightedIndex={highlightedSportIndex}
//           setHighlightedIndex={setHighlightedSportIndex}
//         />

//         <DropdownInput
//           id="dayOfWeek"
//           label={`What day of ${newEvent.sport || 'sport'} is this for?`}
//           placeholder="Search or select day of week"
//           value={newEvent.sportDayOfWeek}
//           options={filteredDaysOfWeek}
//           onChange={(value) => handleInputChange('sportDayOfWeek', value)}
//           showDropdown={showDayOfWeekDropdown}
//           setShowDropdown={setShowDayOfWeekDropdown}
//           highlightedIndex={highlightedDayIndex}
//           setHighlightedIndex={setHighlightedDayIndex}
//         />

//         <DropdownInput
//           id="wtnbOrCoed"
//           label="WTNB or Coed"
//           placeholder="Select WTNB or Coed"
//           value={newEvent.wtnbOrCoed}
//           options={filteredWtnbOrCoed}
//           onChange={(value) => handleInputChange('wtnbOrCoed', value)}
//           showDropdown={showWtnbOrCoedDropdown}
//           setShowDropdown={setShowWtnbOrCoedDropdown}
//           highlightedIndex={highlightedWtnbOrCoedIndex}
//           setHighlightedIndex={setHighlightedWtnbOrCoedIndex}
//         />

//         <DropdownInput
//           id="location"
//           label="Location"
//           placeholder="Search or select location"
//           value={newEvent.location}
//           options={filteredLocations}
//           onChange={(value) => handleInputChange('location', value)}
//           showDropdown={showLocationDropdown}
//           setShowDropdown={setShowLocationDropdown}
//           highlightedIndex={highlightedLocationIndex}
//           setHighlightedIndex={setHighlightedLocationIndex}
//         />

//         <div className="form-row">
//           <label htmlFor="numAttendees">Est # of Attendees</label>
//           <div>
//             <input
//               id="numAttendees"
//               type="text"
//               placeholder="# of Attendees"
//               value={newEvent?.numAttendees || ''}
//               onChange={(e) => handleInputChange('numAttendees', e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <label htmlFor="isContacted">Contacted?</label>
//           <div>
//             <input
//               id="isContacted"
//               type="checkbox"
//               checked={newEvent.isContacted || false}
//               onChange={(e) => handleInputChange('isContacted', e.target.checked)}
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <label htmlFor="isConfirmed">Confirmed?</label>
//           <div>
//             <input
//               id="isConfirmed"
//               type="checkbox"
//               checked={newEvent.isConfirmed || false}
//               onChange={(e) => handleInputChange('isConfirmed', e.target.checked)}
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <label htmlFor="isPizzaNight">Pizza Night?</label>
//           <div>
//             <input
//               id="isPizzaNight"
//               type="checkbox"
//               checked={newEvent.isPizzaNight || false}
//               onChange={(e) => handleInputChange('isPizzaNight', e.target.checked)}
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <label htmlFor="isPizzaOrdered">Pizza Ordered?</label>
//           <div>
//             <input
//               id="isPizzaOrdered"
//               type="checkbox"
//               checked={newEvent.isPizzaOrdered || false}
//               onChange={(e) => handleInputChange('isPizzaOrdered', e.target.checked)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="button-group">
//         <button
//           type="button"
//           className="add-event-btn"
//           onClick={handleSaveEvent}
//           disabled={!isDateValid}
//         >
//           Save
//         </button>
//         <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
//       </div>
//     </Modal>
//   );
// };
