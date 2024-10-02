import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

export const PizzaFilter = ({ userFilters, setUserFilters }) => {

    const handleCheckboxChange = (value) => {
        setUserFilters((prevFilters) => {
            const updatedValues = prevFilters.selectedIsPizzaNight.includes(value)
                ? prevFilters.selectedIsPizzaNight.filter((item) => item !== value)
                : [...prevFilters.selectedIsPizzaNight, value];
            return {
                ...prevFilters,
                selectedIsPizzaNight: updatedValues
            };
        });
    };

    const handleClick = (event, value) => {
        event.stopPropagation();
        handleCheckboxChange(value);
    };

    return (
        <th>
            <div className="pizza-filter-container">
                <DropdownButton variant="outline-primary" id="dropdown-pizza" title="Need Pizza?">
                    <div className="pizza-filter-menu">
                        <div className="pizza-filter-column">
                            <Dropdown.Item as="div" onClick={(e) => handleClick(e, true)}>
                                <Form.Check 
                                    type="checkbox"
                                    label="Yes"
                                    checked={(userFilters.selectedIsPizzaNight || []).includes(true)}
                                    readOnly  // Checkbox is controlled externally
                                />
                            </Dropdown.Item>

                            <Dropdown.Item as="div" onClick={(e) => handleClick(e, false)}>
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
    );
};
