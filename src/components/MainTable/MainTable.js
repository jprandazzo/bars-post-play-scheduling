import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../../firebaseConfig';  
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { fetchData } from '../../utils/fetchData';
import { filterEventsToCurrentSeason } from '../../utils/filterUtils/filterEventsToCurrentSeason';
import { handleAddNewEvent, handleAddNewSeason } from '../../utils/handleAddNewUtils';
import { AddNewEventModal, AddNewSeasonModal } from '../Modals';
import { sortRecords } from '../../utils/sortUtils';
import { EventRow } from './EventRow/EventRow';
import { applyUserFilters } from '../../utils/filterUtils/applyUserFilters';

export const MainTable = ({ currentSchedule }) => {
    const [allRecords, setAllRecords] = useState([]);
    const [filteredAndSortedRecords, setFilteredAndSortedRecords] = useState([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isSeasonModalOpen, setSeasonModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        eventDate: {
            year: "",
            month: "",
            date: "",
            hour: "",
            minute: "",
            amPm: ""
        },
        weekNumber: '',
        sport: '',
        wtnbOrCoed: '',
        dayOfWeek: '',
        location: '',
        isContacted: false,
        isConfirmed: false,
        isPizzaNight: false,
        isPizzaOrdered: false,
        numAttendees: 0,
        numRegistered: 0,
        percentAttendance: 100,
    });

    const [userFilters, setUserFilters] = useState({
        selectedDate: '',
        selectedDayOfWeek: '',
        selectedIsPizzaNight: '',
        selectedLocation: '',
        selectedSports: ["Dodgeball", "Pickleball", "Bowling", "Kickball"],  // Store multiple selected sports with correct capitalization
        selectedWtnbOrCoed: ["WTNB", "Coed"],  // Store multiple WTNB/Coed selections with correct capitalization
    });

    const [isFilterDropdownVisible, setFilterDropdownVisible] = useState({
        dayOfWeek: false,
        isPizzaNight: false,
        location: false,
        sport: false,
        wtnbOrCoed: false,
    });

    // Fetch records from Firestore
    useEffect(() => {
        fetchData({ setAllRecords });
    }, []);

    // Log fetched records and filters to debug
    useEffect(() => {
        console.log('Fetched all records:', allRecords);
        console.log('User filters:', userFilters);
    }, [allRecords, userFilters]);

    useEffect(() => {
        const filtered = filterEventsToCurrentSeason(allRecords, currentSchedule);
        const filteredAndSorted = applyUserFilters(sortRecords(filtered), userFilters);
        setFilteredAndSortedRecords(filteredAndSorted);

        console.log('Filtered and sorted records:', filteredAndSorted);
    }, [allRecords, currentSchedule, userFilters]);

    const handleDeleteEvent = async (id) => {
        try {
            await deleteDoc(doc(db, 'post play events', id));
            fetchData({ setAllRecords });
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const handleEditEvent = async (updatedEvent) => {
        try {
            const eventRef = doc(db, 'post play events', updatedEvent.id);
            await updateDoc(eventRef, updatedEvent);
            fetchData({ setAllRecords });
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const toggleFilterDropdown = (filterName) => {
        setFilterDropdownVisible((prev) => ({
            ...prev,
            [filterName]: !prev[filterName],
        }));
    };

    const handleFilterChange = (field, value) => {
        setUserFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value
        }));
    };

    const handleCheckboxChange = (field, value) => {
        setUserFilters((prevFilters) => {
            const updatedValues = prevFilters[field].includes(value)
                ? prevFilters[field].filter((item) => item !== value)
                : [...prevFilters[field], value];
            return {
                ...prevFilters,
                [field]: updatedValues
            };
        });
    };

    return (
        <div>
            <div className='add-event-season-buttons'>
                <button type="button" onClick={() => setIsEventModalOpen(true)}>Add New Event</button>
                <button type="button" onClick={() => setSeasonModalOpen(true)}>Add New Season</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Week</th>

                        <th>
                            Date
                            <span style={{ cursor: 'pointer' }}>
                                <input
                                    type="date"
                                    value={userFilters.selectedDate}  // Single date selection
                                    onChange={(e) => handleFilterChange('selectedDate', e.target.value)}  // Handle date change
                                    style={{ display: 'inline-block' }}  // Show calendar on click
                                />
                            </span>
                        </th>

                        <th>
                            Sport
                            <span onClick={() => toggleFilterDropdown('sport')} style={{ cursor: 'pointer' }}>🔽</span>
                            {isFilterDropdownVisible.sport && (
                                <div className="dropdown">
                                    {/* Multiple sports selection */}
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={userFilters.selectedSports.includes("Dodgeball")}
                                            onChange={() => handleCheckboxChange('selectedSports', "Dodgeball")}
                                        />
                                        Dodgeball
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={userFilters.selectedSports.includes("Pickleball")}
                                            onChange={() => handleCheckboxChange('selectedSports', "Pickleball")}
                                        />
                                        Pickleball
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={userFilters.selectedSports.includes("Kickball")}
                                            onChange={() => handleCheckboxChange('selectedSports', "Kickball")}
                                        />
                                        Kickball
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={userFilters.selectedSports.includes("Bowling")}
                                            onChange={() => handleCheckboxChange('selectedSports', "Bowling")}
                                        />
                                        Bowling
                                    </label>
                                </div>
                            )}
                        </th>

                        <th>
                            WTNB or Coed
                            <span onClick={() => toggleFilterDropdown('wtnbOrCoed')} style={{ cursor: 'pointer' }}>🔽</span>
                            {isFilterDropdownVisible.wtnbOrCoed && (
                                <div className="dropdown">
                                    {/* WTNB or Coed selection */}
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={userFilters.selectedWtnbOrCoed.includes("WTNB")}
                                            onChange={() => handleCheckboxChange('selectedWtnbOrCoed', "WTNB")}
                                        />
                                        WTNB
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={userFilters.selectedWtnbOrCoed.includes("Coed")}
                                            onChange={() => handleCheckboxChange('selectedWtnbOrCoed', "Coed")}
                                        />
                                        Coed
                                    </label>
                                </div>
                            )}
                        </th>

                        <th>
                            Est. # of Attendees
                        </th>

                        <th>
                            Location
                            <span onClick={() => toggleFilterDropdown('location')} style={{ cursor: 'pointer' }}>🔽</span>
                            {isFilterDropdownVisible.location && (
                                <div className="dropdown">
                                    <input
                                        type="text"
                                        value={userFilters.selectedLocation}
                                        onChange={(e) => handleFilterChange('selectedLocation', e.target.value)}
                                    />
                                </div>
                            )}
                        </th>

                        <th>Contacted?</th>
                        <th>Confirmed?</th>
                        <th>Need pizza?
                            <span onClick={() => toggleFilterDropdown('isPizzaNight')} style={{ cursor: 'pointer' }}>🔽</span>
                            {isFilterDropdownVisible.isPizzaNight && (
                                <div className="dropdown">
                                    <select
                                        value={userFilters.selectedIsPizzaNight}
                                        onChange={(e) => handleFilterChange('selectedIsPizzaNight', e.target.value === 'true')}
                                    >
                                        <option value="">All</option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                            )}
                        </th>
                        <th>Pizza Ordered?</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredAndSortedRecords.map((record) => (
                        <EventRow
                            key={record.id}
                            record={record}
                            onDelete={handleDeleteEvent}
                            onEdit={handleEditEvent}
                        />
                    ))}
                </tbody>
            </table>

            <AddNewEventModal {...{ isEventModalOpen, setIsEventModalOpen, handleAddNewEvent, setAllRecords, setNewEvent, newEvent }} />

            <AddNewSeasonModal {...{ isSeasonModalOpen, setSeasonModalOpen, handleAddNewSeason, setAllRecords, setIsEventModalOpen }} />
        </div>
    );
};
