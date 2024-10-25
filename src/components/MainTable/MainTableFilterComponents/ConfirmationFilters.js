import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import React from 'react';

import { handleFilterCheckboxClick } from '../../../utils/filterUtils';

import './ConfirmationFilters.css';

export const ConfirmationFilters = ({ userFilters, setUserFilters }) => {
    return (
        <>
            <th className="confirmation-filters-container">
                <div className="contact-confirm-filter-container">
                    <DropdownButton
                        variant="outline-primary"
                        id="dropdown-contact-confirm"
                        title="Confirmed / Pizza?"
                    >
                        <div className="contact-confirm-filter-menu">
                            <div className="contact-confirm-filter-column">
                                {/* Contacted */}
                                <Dropdown.Item
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedIsContacted',
                                            true,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="Contacted? Yes"
                                        checked={(
                                            userFilters.selectedIsContacted ||
                                            []
                                        ).includes(true)}
                                        readOnly
                                    />
                                </Dropdown.Item>

                                <Dropdown.Item
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedIsContacted',
                                            false,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="Contacted? No"
                                        checked={(
                                            userFilters.selectedIsContacted ||
                                            []
                                        ).includes(false)}
                                        readOnly
                                    />
                                </Dropdown.Item>

                                {/* Confirmed */}
                                <Dropdown.Item
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedIsConfirmed',
                                            true,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="Confirmed? Yes"
                                        checked={(
                                            userFilters.selectedIsConfirmed ||
                                            []
                                        ).includes(true)}
                                        readOnly
                                    />
                                </Dropdown.Item>

                                <Dropdown.Item
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedIsConfirmed',
                                            false,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="Confirmed? No"
                                        checked={(
                                            userFilters.selectedIsConfirmed ||
                                            []
                                        ).includes(false)}
                                        readOnly
                                    />
                                </Dropdown.Item>

                                {/* Pizza Night */}
                                <Dropdown.Item
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedIsPizzaNight',
                                            true,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="Pizza Night? Yes"
                                        checked={(
                                            userFilters.selectedIsPizzaNight ||
                                            []
                                        ).includes(true)}
                                        readOnly
                                    />
                                </Dropdown.Item>

                                <Dropdown.Item
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedIsPizzaNight',
                                            false,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="Pizza Night? No"
                                        checked={(
                                            userFilters.selectedIsPizzaNight ||
                                            []
                                        ).includes(false)}
                                        readOnly
                                    />
                                </Dropdown.Item>

                                {/* Pizza Ordered */}
                                <Dropdown.Item
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedIsPizzaOrdered',
                                            true,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="Pizza Ordered? Yes"
                                        checked={(
                                            userFilters.selectedIsPizzaOrdered ||
                                            []
                                        ).includes(true)}
                                        readOnly
                                    />
                                </Dropdown.Item>

                                <Dropdown.Item
                                    as="div"
                                    onClick={(e) =>
                                        handleFilterCheckboxClick(
                                            e,
                                            'selectedIsPizzaOrdered',
                                            false,
                                            { setUserFilters }
                                        )
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label="Pizza Ordered? No"
                                        checked={(
                                            userFilters.selectedIsPizzaOrdered ||
                                            []
                                        ).includes(false)}
                                        readOnly
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
