import React from 'react';

export const LabelWithoutInputFocus = ({ children, ...props }) => {
    return (
        // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
        <label
            onClick={(e) => {
                e.preventDefault(); // Prevent focusing on the input when the label is clicked
            }}
            {...props} // Pass down any other props (e.g., className)
        >
            {children}
        </label>
    );
};
