'use strict';

class FormatDate {
    static formatDatePost(dateObject) {
        let formattedDateString = '';
        if (dateObject.year !== '') {
            formattedDateString += dateObject.year;
        }

        if (dateObject.month !== '') {
            formattedDateString = dateObject.month + '/' + formattedDateString;
        }

        if (dateObject.day !== '') {
            formattedDateString = dateObject.day + '/' + formattedDateString;
        }
        return formattedDateString;
    }

    static formatDateGet(dateString) {
        const dateArray = dateString.split('/');
        for (let i = 0; i < 3; i++) {
            if (dateArray.length < 3) {
                dateArray.unshift('');
            }
        }
        return dateArray;
    }

    static addWeeksToDate(dateString, weeksToAdd) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + (weeksToAdd * 7));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}

module.exports = FormatDate;
