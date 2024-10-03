export const getJsDate = (dateObject) => {
    if (!dateObject) return ''
    return dateObject instanceof Date ? 
    dateObject
    : new Date(`${dateObject.year}-${dateObject.month}-${dateObject.date} ${dateObject.hour}:${dateObject.minute} ${dateObject.amPm}`)
  }