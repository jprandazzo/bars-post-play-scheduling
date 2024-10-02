import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

export const LocationFilter = ({ uniqueLocations, userFilters, setUserFilters }) => {

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
        event.stopPropagation();
    };

    return (
        <th>
            <div className="location-filter-container">
                <DropdownButton variant="outline-primary" id="dropdown-location" title="Location">
                    <div className="location-filter-menu">
                        <div className="location-filter-column">
                            {uniqueLocations.map((location) => (
                                <Dropdown.Item key={location} as="div" onClick={handleClick}>
                                    <Form.Check 
                                        type="checkbox"
                                        label={location}
                                        checked={(userFilters.selectedLocations || []).includes(location)}
                                        onChange={() => handleCheckboxChange('selectedLocations', location)}
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
