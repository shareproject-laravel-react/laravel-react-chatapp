import React, { useState, useContext, createContext } from "react";

const EventBusContext = createContext();

export const EventBusProvider = ({ children }) => {
    const [events] = useState({});

    const emit = (name, data) => {
        if (events[name]) {
            for (const cb of events[name]) {
                cb(data);
            }
        }
    };

    const on = (name, cb) => {
        if (!events[name]) events[name] = [];
        events[name].push(cb);
        return () => {
            events[name] = events[name].filter((fn) => fn !== cb);
        };
    };

    return (
        <EventBusContext.Provider value={{ emit, on }}>
            {children}
        </EventBusContext.Provider>
    );
};

export const useEventBus = () => {
    return useContext(EventBusContext);
};
