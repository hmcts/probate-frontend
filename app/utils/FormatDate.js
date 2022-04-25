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

}

module.exports = FormatDate;
