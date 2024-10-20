import React, { useState, useEffect } from 'react';
import { Dropdown, Table, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

import { db } from '../../firebaseConfig';  
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { LocationFilter, SportFilter, ContactFilters, PizzaFilters } from './MainTableFilterComponents';

import { getCurrentSeason } from '../../utils/seasonUtils';
import { fetchData } from '../../utils/fetchData';
import { filterEventsToCurrentSeason } from '../../utils/filterUtils/filterEventsToCurrentSeason';
import { handleAddNewEvent, handleAddNewSeason } from '../../utils/handleAddNewUtils';
import { AddNewEventModal, AddNewSeasonModal } from '../Modals';
import { sortEvents } from '../../utils/sortUtils';
import { EventRow } from './EventRow/EventRow';
import { applyUserFilters } from '../../utils/filterUtils/applyUserFilters';

export const MainTable = ({ currentSchedule, setCurrentSchedule }) => {
    const [allEvents, setAllEvents] = useState([]);
    const [filteredAndSortedEvents, setFilteredAndSortedEvents] = useState([]);
    const [uniqueLocations, setUniqueLocations] = useState([]);
    const [uniqueSportDaysOfWeek, setUniqueSportDaysOfWeek] = useState([]);
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

    const [userFilters, setUserFilters] = useState({
        selectedDate: '',
        selectedIsContacted: [true, false],
        selectedIsConfirmed: [true, false],
        selectedIsPizzaNight: [true, false],
        selectedIsPizzaOrdered: [true, false],
        selectedLocations: [],
        selectedSports: ['Bowling', 'Dodgeball', 'Kickball', 'Pickleball'],
        selectedWtnbOrCoed: ['WTNB', 'Coed'],
        selectedSportDaysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    });

    useEffect(() => {
        setCurrentSchedule(getCurrentSeason());
        fetchData({ setAllEvents });
    }, [handleAddNewEvent]);

    // Calculate unique locations from all events once
    useEffect(() => {
        const uniqueLocationsSet = new Set(allEvents.map(event => event.location));
        const uniqueLocationsArray = Array.from(uniqueLocationsSet);
        setUniqueLocations(uniqueLocationsArray);

        // Initialize selectedLocations with all locations by default
        if (uniqueLocationsArray.length > 0 && userFilters.selectedLocations.length === 0) {
            setUserFilters((prevFilters) => ({
                ...prevFilters,
                selectedLocations: uniqueLocationsArray,  // Set all locations as selected by default
            }));
        }

        // Deduplicate sport days of the week from all events
        const uniqueSportDaysOfWeekSet = new Set(allEvents.map(event => event.sportDayOfWeek));
        setUniqueSportDaysOfWeek(Array.from(uniqueSportDaysOfWeekSet));

    }, [allEvents]);

    useEffect(() => {
        // console.log('trigger')
        const filtered = filterEventsToCurrentSeason(allEvents, currentSchedule);
        const filteredAndSorted = applyUserFilters(sortEvents(filtered), userFilters);
        setFilteredAndSortedEvents(filteredAndSorted);
    }, [allEvents, currentSchedule, userFilters]);



    const handleDeleteEvent = async (id) => {
        try {
            await deleteDoc(doc(db, 'post play events', id));
            fetchData({ setAllEvents });
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleEditEvent = async (updatedEvent) => {
        try {
            const eventRef = doc(db, 'post play events', updatedEvent.id);
            await updateDoc(eventRef, updatedEvent);
            fetchData({ setAllEvents });
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleFilterChange = (field, value) => {
        setUserFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value
        }));
    };

    return (
        <div>
            <div className='add-event-season-buttons'>
                <Button variant="primary" onClick={() => setIsEventModalOpen(true)}>Add New Event</Button>
                <Button variant="secondary" onClick={() => setSeasonModalOpen(true)} disabled={true}>Add New Season</Button>
            </div>

            <Table striped bordered hover className="main-table">
                <thead>
                    <tr>
                        <th>Week</th>

                        <th>
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

                        <SportFilter {...{ uniqueSportDaysOfWeek, userFilters, setUserFilters }} />

                        <th>Est. # of Attendees</th>

                        <LocationFilter {...{ uniqueLocations, userFilters, setUserFilters }} />

                        <ContactFilters {...{ userFilters, setUserFilters }} />

                        <PizzaFilters {...{ userFilters, setUserFilters }} />
                        
                        
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {/* {console.log(filteredAndSortedEvents)} */}
                    {filteredAndSortedEvents.map((event) => (
                        <EventRow
                            key={event.id}
                            event={event}
                            onDelete={handleDeleteEvent}
                            onEdit={handleEditEvent}
                        />
                    ))}
                </tbody>
            </Table>

            <AddNewEventModal {...{ isEventModalOpen, setIsEventModalOpen, handleAddNewEvent, allEvents, setAllEvents, setNewEvent, newEvent }} />

            <AddNewSeasonModal {...{ isSeasonModalOpen, setSeasonModalOpen, handleAddNewSeason, allEvents, setAllEvents, setIsEventModalOpen }} />
        </div>
    );
};