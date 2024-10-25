import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchData } from '../utils/fetchData';

const EventsContext = createContext();

export const useEvents = () => useContext(EventsContext);

export const EventsProvider = ({ children }) => {
    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        fetchData({ setAllEvents });
    }, []);

    return (
        <EventsContext.Provider value={{ allEvents, setAllEvents }}>
            {children}
        </EventsContext.Provider>
    );
};
