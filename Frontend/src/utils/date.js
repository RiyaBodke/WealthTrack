const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export function getDateInfo(date = new Date()) {

    const currentDate = new Date(date);

    const month = currentDate.getMonth();
    const day = currentDate.getDay();

    return {

        date: currentDate.getDate(),

        month: month + 1,

        monthName: months[month],

        year: currentDate.getFullYear(),

        day: day,

        dayName: days[day],

        hours: currentDate.getHours(),

        minutes: currentDate.getMinutes(),

        seconds: currentDate.getSeconds()

    };
}