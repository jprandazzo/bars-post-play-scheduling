import React, { useState, useEffect } from 'react';
import { Dropdown, Table, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';

import { db } from '../../../firebaseConfig';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { useEvents } from '../../../contexts/EventsContext';
import {
    LocationFilter,
    SportFilter,
    ConfirmationFilters,
} from './MainTableFilterComponents';

import { getCurrentSeason } from '../../utils/seasonUtils';
import { fetchData } from '../../../fetchData';
import { filterEventsToCurrentSeason } from '../../utils/filterUtils';
import { handleAddNewEvent } from '../../utils/handleAddNewUtils';
import { AddNewEventModal, AddNewSeasonModal } from '../../components/Modals';
import { sortEvents } from '../../utils/sortUtils';
import { EventRow } from './EventRow/EventRow';
import { applyUserFilters } from '../../utils/filterUtils/applyUserFilters';

export const MainTable = ({ currentSchedule, setCurrentSchedule }) => {
    const { year, season } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { allEvents, setAllEvents } = useEvents();
    const [filteredAndSortedEvents, setFilteredAndSortedEvents] = useState([]);
    const [uniqueLocations, setUniqueLocations] = useState([]);
    const [uniqueSportDaysOfWeek, setUniqueSportDaysOfWeek] = useState([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isSeasonModalOpen, setSeasonModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [userFilters, setUserFilters] = useState({
        selectedDate: '',
        selectedIsContacted: [true, false],
        selectedIsConfirmed: [true, false],
        selectedIsPizzaNight: [true, false],
        selectedIsPizzaOrdered: [true, false],
        selectedLocations: [],
        selectedSports: ['Bowling', 'Dodgeball', 'Kickball', 'Pickleball'],
        selectedWtnbOrCoed: ['WTNB', 'Coed'],
        selectedSportDaysOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ],
    });

    // Combine useEffect to handle both URL params and fetching data
    useEffect(() => {
        const fetchAndSetData = async () => {
            if (year && season) {
                setCurrentSchedule({ year: Number.parseInt(year), season });
            } else {
                setCurrentSchedule(getCurrentSeason());
            }
            await fetchData({ setAllEvents });
        };

        fetchAndSetData();
    }, [year, season, setAllEvents, setCurrentSchedule]);

    // Handle unique locations and sports
    useEffect(() => {
        const uniqueLocationsSet = new Set(
            allEvents.map((event) => event.location)
        );
        const uniqueLocationsArray = Array.from(uniqueLocationsSet);
        setUniqueLocations(uniqueLocationsArray);

        if (
            uniqueLocationsArray.length > 0 &&
            userFilters.selectedLocations.length === 0
        ) {
            setUserFilters((prevFilters) => ({
                ...prevFilters,
                selectedLocations: uniqueLocationsArray,
            }));
        }

        const uniqueSportDaysOfWeekSet = new Set(
            allEvents.map((event) => event.sportDayOfWeek)
        );
        setUniqueSportDaysOfWeek(Array.from(uniqueSportDaysOfWeekSet));
    }, [allEvents, userFilters.selectedLocations.length]);

    // Apply user filters and sort events
    useEffect(() => {
        const filtered = filterEventsToCurrentSeason(
            allEvents,
            currentSchedule
        );
        const filteredAndSorted = applyUserFilters(
            sortEvents(filtered),
            userFilters
        );
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

            setAllEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === updatedEvent.id ? { ...updatedEvent } : event
                )
            );

            setUniqueLocations((prevLocations) => {
                const newLocationSet = new Set([
                    ...prevLocations,
                    updatedEvent.location,
                ]);
                const newLocationArray = Array.from(newLocationSet);
                setUserFilters((prevFilters) => ({
                    ...prevFilters,
                    selectedLocations: prevFilters.selectedLocations.includes(
                        updatedEvent.location
                    )
                        ? prevFilters.selectedLocations
                        : [
                              ...prevFilters.selectedLocations,
                              updatedEvent.location,
                          ],
                }));
                return newLocationArray;
            });
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleFilterChange = (field, value) => {
        setUserFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    return (
        <div>
            <Button
                variant="primary"
                onClick={() => setIsEventModalOpen(true)}
                className={`add-event-button ${currentUser ? 'clickable' : 'disabled'}`}
                title={
                    !currentUser
                        ? 'Please sign in using your @bigapplerecsports.com email to make changes'
                        : ''
                }
                disabled={!currentUser}
            >
                + Add New Event
            </Button>
            <br />
            <br />

            <Table bordered hover size="sm" className="main-table">
                <thead>
                    <tr>
                        <th id="week-column-header">Week</th>
                        <th id="date-filter-container">
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-primary"
                                    id="dropdown-date"
                                >
                                    Date
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => {
                                            setSelectedDate(date);
                                            handleFilterChange(
                                                'selectedDate',
                                                date
                                            );
                                        }}
                                        open={true}
                                        isClearable
                                        dateFormat="MM/dd/yyyy"
                                        placeholderText="Select date"
                                        className="form-control"
                                    />
                                </Dropdown.Menu>
                            </Dropdown>
                        </th>
                        <SportFilter
                            {...{
                                uniqueSportDaysOfWeek,
                                userFilters,
                                setUserFilters,
                            }}
                        />
                        <th id="attendees-column">Est. # of <br/>Attendees</th>
                        <LocationFilter
                            {...{
                                uniqueLocations,
                                userFilters,
                                setUserFilters,
                            }}
                        />
                        <ConfirmationFilters
                            {...{ userFilters, setUserFilters }}
                        />
                        <th id="actions-column-header">Actions</th>
                    </tr>
                </thead>
                <tbody>
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

            <AddNewEventModal
                {...{
                    isEventModalOpen,
                    setIsEventModalOpen,
                    handleAddNewEvent,
                    allEvents,
                    setAllEvents,
                    setUniqueLocations,
                    setUserFilters,
                }}
            />
            <AddNewSeasonModal
                {...{
                    isSeasonModalOpen,
                    setSeasonModalOpen,
                    allEvents,
                    setAllEvents,
                    setIsEventModalOpen,
                }}
            />
        </div>
    );
};
