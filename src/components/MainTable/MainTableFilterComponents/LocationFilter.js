import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

import { handleFilterCheckboxClick } from '../../../utils/filterUtils';

import './LocationFilter.css';

export const LocationFilter = ({
    uniqueLocations,
    userFilters,
    setUserFilters,
}) => {
    return (
        <th className="location-column">
            <div className="location-filter-container">
                <a
                    href="https://docs.google.com/spreadsheets/d/15UWM_Ip4aVnZxhdEFbRYRICz-PdJoyI1MaAK3lTKqx8/edit?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                >
                    (Link to BARS Contact List)
                </a>

                <DropdownButton
                    variant="outline-primary"
                    id="dropdown-location"
                    title="Location"
                >
                    <div className="location-filter-menu">
                        <div className="location-filter-column">
                            {uniqueLocations.map((location) => (
                                <Dropdown.Item
                                    key={location}
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedLocations',
                                            location,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label={location ? location : 'None'}
                                        checked={(
                                            userFilters.selectedLocations || []
                                        ).includes(location)}
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
