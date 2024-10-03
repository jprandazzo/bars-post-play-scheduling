import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

import { handleFilterCheckboxClick } from '../../../utils/filterUtils';

export const LocationFilter = ({ uniqueLocations, userFilters, setUserFilters }) => {

    return (
        <th>
            <div className="location-filter-container">
                <DropdownButton variant="outline-primary" id="dropdown-location" title="Location">
                    <div className="location-filter-menu">
                        <div className="location-filter-column">
                            {uniqueLocations.map((location) => (
                                <Dropdown.Item key={location} as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedLocations', location, {setUserFilters})} >
                                    <Form.Check 
                                        type="checkbox"
                                        label={location}
                                        checked={(userFilters.selectedLocations || []).includes(location)}
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
