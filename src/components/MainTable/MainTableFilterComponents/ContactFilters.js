import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

import { handleFilterCheckboxClick } from '../../../utils/filterUtils';

export const ContactFilters = ({ userFilters, setUserFilters }) => {

    return (
        <>
        <th>
            <div className="contacted-filter-container">
                <DropdownButton variant="outline-primary" id="dropdown-contacted" title="Contacted?">
                    <div className="contacted-filter-menu">
                        <div className="contacted-filter-column">
                            <Dropdown.Item as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedIsContacted', true, {setUserFilters})}>
                                <Form.Check 
                                    type="checkbox"
                                    label="Yes"
                                    checked={(userFilters.selectedIsContacted || []).includes(true)}
                                    readOnly  // Checkbox is controlled externally
                                />
                            </Dropdown.Item>

                            <Dropdown.Item as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedIsContacted', false, {setUserFilters})}>
                                <Form.Check 
                                    type="checkbox"
                                    label="No"
                                    checked={(userFilters.selectedIsContacted || []).includes(false)}
                                    readOnly  // Checkbox is controlled externally
                                />
                            </Dropdown.Item>
                        </div>
                    </div>
                </DropdownButton>
            </div>
        </th>

        <th>
            <div className="confirmed-filter-container">
                <DropdownButton variant="outline-primary" id="dropdown-confirmed" title="Confirmed?">
                    <div className="confirmed-filter-menu">
                        <div className="confirmed-filter-column">
                            <Dropdown.Item as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedIsConfirmed', true, {setUserFilters})}>
                                <Form.Check 
                                    type="checkbox"
                                    label="Yes"
                                    checked={(userFilters.selectedIsConfirmed || []).includes(true)}
                                    readOnly  // Checkbox is controlled externally
                                />
                            </Dropdown.Item>

                            <Dropdown.Item as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedIsConfirmed', false, {setUserFilters})}>
                                <Form.Check 
                                    type="checkbox"
                                    label="No"
                                    checked={(userFilters.selectedIsConfirmed || []).includes(false)}
                                    readOnly  // Checkbox is controlled externally
                                />
                            </Dropdown.Item>
                        </div>
                    </div>
                </DropdownButton>
            </div>
        </th>
        </>
    );
};
