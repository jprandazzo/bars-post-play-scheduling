import React, { useState, useEffect } from 'react';
import { Dropdown, Table, Button } from 'react-bootstrap';
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
        selectedSports: ["Dodgeball", "Pickleball", "Bowling", "Kickball"],
        selectedWtnbOrCoed: ["WTNB", "Coed"],
    });

    useEffect(() => {
        fetchData({ setAllRecords });
    }, []);

    useEffect(() => {
        const filtered = filterEventsToCurrentSeason(allRecords, currentSchedule);
        const filteredAndSorted = applyUserFilters(sortRecords(filtered), userFilters);
        setFilteredAndSortedRecords(filteredAndSorted);

        // Deduplicate locations from filtered records
        const uniqueLocationsSet = new Set(filteredAndSorted.map(record => record.location));
        setUniqueLocations(Array.from(uniqueLocationsSet));  // Convert Set to array

    }, [allRecords, currentSchedule, userFilters]);

    const [uniqueLocations, setUniqueLocations] = useState([]);  // Initialize uniqueLocations

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
                <Button variant="primary" onClick={() => setIsEventModalOpen(true)}>Add New Event</Button>
                <Button variant="secondary" onClick={() => setSeasonModalOpen(true)}>Add New Season</Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Week</th>

                        <th>
                            Date
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary" id="dropdown-date">
                                    Date
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <input
                                        type="date"
                                        value={userFilters.selectedDate}
                                        onChange={(e) => handleFilterChange('selectedDate', e.target.value)}
                                        style={{ display: 'inline-block' }}
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </th>

                        <th>
                            Sport
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary" id="dropdown-sport">
                                    Sport
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {['Dodgeball', 'Pickleball', 'Kickball', 'Bowling'].map((sport) => (
                                        <Dropdown.Item key={sport} as="label">
                                            <input
                                                type="checkbox"
                                                checked={userFilters.selectedSports.includes(sport)}
                                                onChange={() => handleCheckboxChange('selectedSports', sport)}
                                            />
                                            {sport}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </th>

                        <th>
                            WTNB or Coed
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary" id="dropdown-wtnbOrCoed">
                                    WTNB or Coed
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {['WTNB', 'Coed'].map((option) => (
                                        <Dropdown.Item key={option} as="label">
                                            <input
                                                type="checkbox"
                                                checked={userFilters.selectedWtnbOrCoed.includes(option)}
                                                onChange={() => handleCheckboxChange('selectedWtnbOrCoed', option)}
                                            />
                                            {option}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </th>

                        <th>Est. # of Attendees</th>

                        <th>
                            Location
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary" id="dropdown-location">
                                    Location
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <select
                                        value={userFilters.selectedLocation}
                                        onChange={(e) => handleFilterChange('selectedLocation', e.target.value)}
                                    >
                                        <option value="">All</option>
                                        {uniqueLocations.map((location) => (
                                            <option key={location} value={location}>
                                                {location}
                                            </option>
                                        ))}
                                    </select>
                                </Dropdown.Menu>
                            </Dropdown>
                        </th>

                        <th>Contacted?</th>
                        <th>Confirmed?</th>
                        <th>
                            Need pizza?
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-primary" id="dropdown-pizza">
                                    Pizza
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <select
                                        value={userFilters.selectedIsPizzaNight}
                                        onChange={(e) => handleFilterChange('selectedIsPizzaNight', e.target.value === 'true')}
                                    >
                                        <option value="">All</option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </Dropdown.Menu>
                            </Dropdown>
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
            </Table>

            <AddNewEventModal {...{ isEventModalOpen, setIsEventModalOpen, handleAddNewEvent, setAllRecords, setNewEvent, newEvent }} />

            <AddNewSeasonModal {...{ isSeasonModalOpen, setSeasonModalOpen, handleAddNewSeason, setAllRecords, setIsEventModalOpen }} />
        </div>
    );
};
