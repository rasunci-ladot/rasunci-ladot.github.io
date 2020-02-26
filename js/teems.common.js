'use strict';

const e = React.createElement;

class ToolbarButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e('button', {
            type: 'button',
            id: this.props.id,
            className: this.props.className,
            onClick: this.props.handleOnClick,
            },
            e('img', {
                className: this.props.imgClassName,
                src: this.props.img,
            }),
        );
    }
}

class ToolbarFragment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let buttons = this.props.buttons;
        let toolbar = [];
        for (let i=0; i<buttons.length; i++) {
            toolbar.push(e(
                ToolbarButton, {
                    key: i, // Warning suppression
                    id: buttons[i].id,
                    className: buttons[i].className,
                    handleOnClick: buttons[i].handleOnClick,
                    img: buttons[i].img,
                    imgClassName: buttons[i].imgClassName,
                }),
            );
        }

        return e(React.Fragment, null, toolbar);
    }
}

class CloseButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        document.getElementById(this.props.panelId).style.visibility = 'hidden';
    }

    render() {
        return e('button', {
            type: 'button',
            className: 'close-button close-button-size',
            onClick: this.handleOnClick,
            },
            e('img', {
                className: 'close-button-img-size',
                src: '/img/window-close.png',
            })
        );
    }
}

class PanelFragment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            React.Fragment,
            null,
            e(CloseButton, {
                panelId: this.props.panelId,
            }),
            this.props.elements,
        );
    }
}

class CalendarDate extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
    }

    render() {
        return e('td', {
            id: this.props.id,
            className: this.props.className,
            },
            this.props.value
        );
    }
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.isLeapYear = this.isLeapYear.bind(this);
        this.getMonthDays = this.getMonthDays.bind(this);
        let sysDate = new Date();
        this.state = {
            month: sysDate.getMonth(), // Jan=0, Dec=11
            year: sysDate.getFullYear(),
        };
    }

    isLeapYear(year) {
        if (year % 400 == 0) {return true;}
        else if (year % 100 == 0) {return false;}
        else if (year % 4 == 0) {return true;}
        else {return false;}
    }

    getMonthDays(month, year) {
        let daysInFeb = 28;
        if (this.isLeapYear(year)) {
            daysInFeb = 29;
        }
        let months = [
            {month: 'January', days: 31},
            {month: 'February', days: daysInFeb},
            {month: 'March', days: 31},
            {month: 'April', days: 30},
            {month: 'May', days: 31},
            {month: 'June', days: 30},
            {month: 'July', days: 31},
            {month: 'August', days: 31},
            {month: 'September',days: 30},
            {month: 'Octoboer', days: 31},
            {month: 'November', days: 30},
            {month: 'December', days: 31},
        ];
        return months[month];
    }

    render() {
        // Get this month details
        let monthDays = this.getMonthDays(this.state.month, this.state.year);
        let adjustedMonth = this.state.month + 1; // Date constructor expects Jan=1, Dec=12
        let calDate = new Date(adjustedMonth+'/1/'+this.state.year);
        let calWeekDay = calDate.getDay(); // First day of month

        let calendar = [];
        // If First day of month is not Sunday, get details of last month to display
        if (calWeekDay > 0) {
            // Assume current month=Jan. So last month=Dec. So it has 31 days
            let lastMonth = 11;
            let daysInLastMonth = 31;
            // If current month is NOT Jan...
            if (monthDays.month > 0) {
                lastMonth = monthDays.month - 1;
                let lastMonthDays = getMonthDays(lastMonth, this.state.year);
                daysInLastMonth = lastMonthDays.days;
            }
            // Populate calendar array using dates from last month
            for (let i=0, j=daysInLastMonth-calWeekDay+1; i<calWeekDay; i++, j++) {
                // console.log('i,j='+i+','+j);
                calendar.push(j);
            }
        }
        // Populate calendar array using dates from this month
        for (let i=calWeekDay, j=1; j<=monthDays.days; i++, j++) {
            // console.log('i,j='+i+','+j);
            calendar.push(j);
        }
        // Populate calendar array using dates from next month
        let endLastRow = 35;
        if (monthDays.days+calWeekDay > 35) {
            endLastRow = 42;
        }
        for (let i=monthDays.days+calWeekDay, j=1; i<endLastRow; i++, j++) {
            // console.log('i,j='+i+','+j);
            calendar.push(j);
        }
        console.log('calendar='+calendar);

        let tbody = [];
        for (let i=0; i<6; i++) {
            let row = [];
            for (let j=0; j<7; j++) {
                row.push(e(CalendarDate, {
                    key: i*7+j, // Warning suppression
                    value: calendar[i*7+j]
                }));
            }
            tbody.push(e('tr', {
                key: i,
                },
                row
            ));
        }
        return e('table', {
            },
            e('tbody', {
                },
                tbody
            ),
        );
    }
}

class DatePickerFragment extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let date = this.props.date;

        let datePicker = [
            e('label', {
                key: 0, // Warning supperssion
                id: date.labelId,
                className: date.labelClassName,
                },
                date.labelText
            ),
            e('input', {
                key: 1, // Warning supperssion
                type: 'text',
                id: date.inputId,
                className: date.inputClassName,
            }),
            e('button', {
                key: 2, // Warning supperssion
                type: 'button',
                id: date.buttonId,
                className: date.buttonClassName,
                },
                e('img', {
                    className: date.imgClassName,
                    img: date.imgSrc,
                }),
            ),
            e(Calendar, {
                key: 3, // Warning supperssion
                id: date.calendarId,
                className: date.calendarClassName,
            }),
        ];

        return e(React.Fragment, null, datePicker);
    }
}

