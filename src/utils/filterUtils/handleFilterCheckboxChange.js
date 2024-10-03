export const handleFilterCheckboxClick = (e, field, value, {setUserFilters}) => {
    e.stopPropagation();

    setUserFilters((prevFilters) => {
        const updatedValues = prevFilters[field].includes(value)
            ? prevFilters[field].filter((item) => item !== value)
            : [...prevFilters[field], value];
        return {
            ...prevFilters,
            [field]: updatedValues
        };
    });
};