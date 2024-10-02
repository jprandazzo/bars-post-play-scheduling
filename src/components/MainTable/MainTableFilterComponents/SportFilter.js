import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

export const SportFilter = ({ uniqueSportDaysOfWeek, userFilters, setUserFilters }) => {
    const sports = ['Bowling', 'Dodgeball', 'Kickball', 'Pickleball'];
    const wtnbOrCoedOptions = ['WTNB', 'Coed'];

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

    const handleClick = (event) => {
        event.stopPropagation();  // Prevents the dropdown from closing
    };

    return (
        <th>
            <div className="sport-filter-container">
                <DropdownButton variant="outline-primary" id="dropdown-sport" title="Sport">
                    <div className="sport-filter-menu">
                        {/* SportDayOfWeek column */}
                        <div className="sport-filter-column"> Day Of Week
                            {uniqueSportDaysOfWeek.map((dayOfWeek) => (
                                <Dropdown.Item key={dayOfWeek} as="div" onClick={handleClick}>
                                    <Form.Check 
                                        type="checkbox"
                                        label={dayOfWeek}
                                        checked={(userFilters.selectedSportDaysOfWeek || []).includes(dayOfWeek)}
                                        onChange={() => handleCheckboxChange('selectedSportDaysOfWeek', dayOfWeek)}
                                    />
                                </Dropdown.Item>
                            ))}
                        </div>

                        {/* Sports column */}
                        <div className="sport-filter-column"> Sport
                            {sports.map((sportName) => (
                                <Dropdown.Item key={sportName} as="div" onClick={handleClick}>
                                    <Form.Check 
                                        type="checkbox"
                                        label={sportName}
                                        checked={(userFilters.selectedSports || []).includes(sportName)}
                                        onChange={() => handleCheckboxChange('selectedSports', sportName)}
                                    />
                                </Dropdown.Item>
                            ))}
                        </div>

                        {/* WTNB or Coed column */}
                        <div className="sport-filter-column"> WTNB or Coed
                            {wtnbOrCoedOptions.map((wtnbOrCoedOption) => (
                                <Dropdown.Item key={wtnbOrCoedOption} as="div" onClick={handleClick}>
                                    <Form.Check 
                                        type="checkbox"
                                        label={wtnbOrCoedOption}
                                        checked={(userFilters.selectedWtnbOrCoed || []).includes(wtnbOrCoedOption)}
                                        onChange={() => handleCheckboxChange('selectedWtnbOrCoed', wtnbOrCoedOption)}
                                    />
                                </Dropdown.Item>
                            ))}
                        </div>
                    </div>
                </DropdownButton>
            </div>
        </th>
    );
};
