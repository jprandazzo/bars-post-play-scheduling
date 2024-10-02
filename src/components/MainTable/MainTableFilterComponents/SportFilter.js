import { Dropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

export const SportFilter = ({ uniqueSportDaysOfWeek, userFilters, setUserFilters }) => {
    const sports = ['Bowling', 'Dodgeball', 'Kickball', 'Pickleball'];
    const wtnbOrCoedOptions = ['WTNB', 'Coed'];

  
    // const isAllChecked = (field, values) => {
    //     return (userFilters[field] || []).every(value => values.includes(value));
    // };

    // const handleToggleSelectAll = (field, values, isChecked) => {
    //     if (isChecked) {
    //         setUserFilters((prevFilters) => ({
    //             ...prevFilters,
    //             [field]: values  // Select all
    //         }));
    //     } else {
    //         setUserFilters((prevFilters) => ({
    //             ...prevFilters,
    //             [field]: []  // Unselect all
    //         }));
    //     }
    // };

    const handleCheckboxChange = (field, value) => {
        setUserFilters((prevFilters) => {
            const updatedValues = prevFilters[field]?.includes(value)
                ? prevFilters[field].filter((item) => item !== value)
                : [...(prevFilters[field] || []), value];
            return {
                ...prevFilters,
                [field]: updatedValues
            };
        });
    };

    return (
        <th>
            <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-sport">
                    Sport
                </Dropdown.Toggle>
                <Dropdown.Menu className="sport-filter-dropdown">
                    <div className="sport-filter-container">
                        {/* SportDayOfWeek column */}
                        <div className="sport-day-of-week-column">
                            {/* <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleToggleSelectAll('selectedSportDayOfWeek', uniqueSportDaysOfWeek, isAllChecked('selectedSportDayOfWeek', uniqueSportDaysOfWeek))}
                                    checked={isAllChecked('selectedSportDayOfWeek', uniqueSportDaysOfWeek)}
                                />
                                Toggle All/None
                            </label> */}
                            {/* {console.log(uniqueSportDaysOfWeek)} */}
                            {/* {console.log(userFilters.selectedSportDaysOfWeek)} */}
                            {/* {console.log(userFilters.selectedSportDaysOfWeek.includes(uniqueSportDaysOfWeek[1]))} */}
                            {uniqueSportDaysOfWeek.map((dayOfWeek) => (
                                <label key={dayOfWeek}>
                                    <input
                                        type="checkbox"
                                        checked={(userFilters.selectedSportDaysOfWeek || []).includes(dayOfWeek)}
                                        onChange={() => handleCheckboxChange('selectedSportDaysOfWeek', dayOfWeek)}
                                    />
                                    {dayOfWeek}
                                </label>
                            ))}
                        </div>

                        {/* Sports column */}
                        <div className="sports-column">
                            {/* <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleToggleSelectAll('selectedSports', sports, isAllChecked('selectedSports', sports))}
                                    checked={isAllChecked('selectedSports', sports)}
                                />
                                Toggle All/None
                            </label> */}
                            {sports.map((sport) => (
                                <label key={sport}>
                                    <input
                                        type="checkbox"
                                        checked={(userFilters.selectedSports || []).includes(sport)}
                                        onChange={() => handleCheckboxChange('selectedSports', sport)}
                                    />
                                    {sport}
                                </label>
                            ))}
                        </div>

                        {/* WTNB or Coed column */}
                        <div className="wtnb-or-coed-column">
                            {/* <label>
                                <input
                                    type="checkbox"
                                    onChange={() => handleToggleSelectAll('selectedWtnbOrCoed', wtnbOrCoedOptions, isAllChecked('selectedWtnbOrCoed', wtnbOrCoedOptions))}
                                    checked={isAllChecked('selectedWtnbOrCoed', wtnbOrCoedOptions)}
                                />
                                Toggle All/None
                            </label> */}
                            {wtnbOrCoedOptions.map((option) => (
                                <label key={option}>
                                    <input
                                        type="checkbox"
                                        checked={(userFilters.selectedWtnbOrCoed || []).includes(option)}
                                        onChange={() => handleCheckboxChange('selectedWtnbOrCoed', option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </th>
    );
};
