import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

import { handleFilterCheckboxClick } from '../../../utils/filterUtils';

export const PizzaFilters = ({ userFilters, setUserFilters }) => {

    return (
        <>
        <th>
            <div className="pizza-filter-container">
                <DropdownButton variant="outline-primary" id="dropdown-pizza" title="Need Pizza?">
                    <div className="pizza-filter-menu">
                        <div className="pizza-filter-column">
                            <Dropdown.Item as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedIsPizzaNight', true, {setUserFilters})}>
                                <Form.Check 
                                    type="checkbox"
                                    label="Yes"
                                    checked={(userFilters.selectedIsPizzaNight || []).includes(true)}
                                    readOnly  // Checkbox is controlled externally
                                />
                            </Dropdown.Item>

                            <Dropdown.Item as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedIsPizzaNight', false, {setUserFilters})}>
                                <Form.Check 
                                    type="checkbox"
                                    label="No"
                                    checked={(userFilters.selectedIsPizzaNight || []).includes(false)}
                                    readOnly  // Checkbox is controlled externally
                                />
                            </Dropdown.Item>
                        </div>
                    </div>
                </DropdownButton>
            </div>
        </th>

        <th>
            <div>
                <DropdownButton variant="outline-primary" id="dropdown-pizza-ordered" title="Pizza Ordered?">
                    <div className="pizza-ordered-filter-menu">
                        <div className="pizza-ordered-filter-column">
                            <Dropdown.Item as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedIsPizzaOrdered', true, {setUserFilters})}>
                                <Form.Check 
                                    type="checkbox"
                                    label="Yes"
                                    checked={(userFilters.selectedIsPizzaOrdered || []).includes(true)}
                                    readOnly  // Checkbox is controlled externally
                                />
                            </Dropdown.Item>

                            <Dropdown.Item as="div" onClick={(e) => handleFilterCheckboxClick(e, 'selectedIsPizzaOrdered', false, {setUserFilters})}>
                                <Form.Check 
                                    type="checkbox"
                                    label="No"
                                    checked={(userFilters.selectedIsPizzaOrdered || []).includes(false)}
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
