'use strict';

const e = React.createElement;
const EMERG  = 1;   // System is unusable
const ALERT  = 3;   // Action must be taken immediately
const CRIT   = 7;   // Critical conditions
const ERR    = 15;  // Error conditions
const WARN   = 31;  // Warning conditions
const NOTICE = 63;  // Normal, but significant, condition
const INFO   = 127; // Informational message
const DEBUG  = 255; // Debug-level message
const LOGLEVEL = INFO;

function logDebug(msg) {
    if (LOGLEVEL & 128) {console.log(msg);}
}

function logInfo(msg) {
    if (LOGLEVEL & 64) {console.log(msg);}
}

function logWarn(msg) {
    if (LOGLEVEL & 16) {console.log(msg);}
}

function logErr(msg) {
    if (LOGLEVEL & 8) {console.log(msg);}
}

function logAlert(msg) {
    if (LOGLEVEL & 2) {console.log(msg); alert(msg);}
}

// printf %02d
function printf02d(i) {
    let padded = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    if (i > -1 && i < 10) {
        return padded[i];
    }
    return i.toString();
}

class ToolbarButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        this.props.handleOnClick();
    }

    render() {
        logDebug('ToolbarButton.render');
        return(e('button', {
            type: 'button',
            id: this.props.id,
            className: this.props.className,
            onClick: this.handleOnClick,
            },
            e('img', {
                className: this.props.imgClassName,
                src: this.props.img,
            }),
        ));
    }
}

class ToolbarFragment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        logDebug('ToolbarFragment.render');
        let buttonDetails = this.props.buttonDetails;
        let toolbar = [];
        for (let i=0; i<buttonDetails.length; i++) {
            toolbar.push(e(ToolbarButton, {
                key: i, // Warning suppression
                id: buttonDetails[i].id,
                className: buttonDetails[i].className,
                handleOnClick: buttonDetails[i].handleOnClick,
                img: buttonDetails[i].img,
                imgClassName: buttonDetails[i].imgClassName,
            }));
        }

        return e(
            React.Fragment, {
            },
            toolbar,
        );
    }
}

class PanelButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        this.props.handleOnClick();
    }

    render() {
        logDebug('PanelButton.render');
        return(e('button', {
            type: 'button',
            className: 'panel-button panel-button-size',
            onClick: this.handleOnClick,
            },
            e('img', {
                className: 'panel-button-img-size',
                src: '/img/window-close.png',
            }),
        ));
    }
}

class PanelFragment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        logDebug('PanelFragment.render');
        return(e(React.Fragment, {
            },
            e(PanelButton, {
                handleOnClick: this.props.handleOnClick,
            }),
            this.props.elements,
        ));
    }
}

class CalendarTd extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
        this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
        this.state = {
            isMouseOver: false,
        };
    }

    handleOnClick(event) {
        let month = printf02d(event.target.dataset.month);
        let date = printf02d(event.target.dataset.date);
        let year = event.target.dataset.year;
        this.props.handleOnClick(month+'/'+date+'/'+year);
    }

    handleOnMouseOver() {
        this.setState({isMouseOver: true});
    }

    handleOnMouseOut() {
        this.setState({isMouseOver: false});
    }

    render() {
        logDebug('CalendarTd.render');
        let className = this.props.className;
        if (this.state.isMouseOver) {
            className += ' hilite';
        }
        return(e('td', {
            id: this.props.id,
            className: className,
            onClick: this.handleOnClick,
            onMouseOver: this.handleOnMouseOver,
            onMouseOut: this.handleOnMouseOut,
            'data-month': this.props.month,
            'data-date': this.props.date,
            'data-year': this.props.year,
            },
            this.props.date
        ));
    }
}

class CalendarTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClickLeftArrow = this.handleOnClickLeftArrow.bind(this);
        this.handleOnClickRightArrow = this.handleOnClickRightArrow.bind(this);
        this.getDaysInMonth = this.getDaysInMonth.bind(this);
        this.getMonthName = this.getMonthName.bind(this);
        this.makeCalData = this.makeCalData.bind(this);
        let sysDate = new Date();
        this.state = {
            month: sysDate.getMonth(), // Jan=0, Dec=11
            year: sysDate.getFullYear(),
        };
    }

    handleOnClickLeftArrow() {
        // Assume current month=Jan, so let previous month=Dec
        let month = 11;
        let year = this.state.year - 1;
        // Change month & year if current month!=Jan
        if (this.state.month > 0) {
            month = this.state.month - 1;
            year = this.state.year;
        }
        logDebug('CalendarTable.handleOnClickLeftArrow: month='+month+', year='+year);
        this.setState({month: month});
        this.setState({year: year});
    }

    handleOnClickRightArrow() {
        // Assume current month=Dec, so let next month=Jan
        let month = 0;
        let year = this.state.year + 1;
        // Change month & year if current month!=Dec
        if (this.state.month < 11) {
            month = this.state.month + 1;
            year = this.state.year;
        }
        logDebug('CalendarTable.handleOnClickRightArrow: month='+month+', year='+year);
        this.setState({month: month});
        this.setState({year: year});
    }

    getDaysInMonth(month, year) {
        let daysInFeb = 28;
        if (year % 400 == 0) {
            daysInFeb = 29;
        }
        else if (year % 100 == 0) {
            daysInFeb = 28;
        }
        else if (year % 4 == 0) {
            daysInFeb = 29;
        }

        let daysInMonth = [31, daysInFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        logDebug('CalendarTable.getDaysInMonth: daysInMonth='+daysInMonth);
        return daysInMonth[month];
    }

    getMonthName(month) {
        let months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        return months[month];
    }

    makeCalData() {
        let month = this.state.month; // Jan=0, Dec=11
        let year = this.state.year;
        let calData = [];
        let daysInMonth;
        let displayMonth;
        let displayYear;
        let normalMonth; // Jan=1, Dec=12

        // If first day of month is not Sunday, show days from last month
        let calDate = new Date((month+1).toString()+'/1/'+year);
        let calWeekDay = calDate.getDay(); // 0=Sun, 6=Sat
        if (calWeekDay > 0) {
            displayMonth = month - 1;
            displayYear = year;
            daysInMonth = this.getDaysInMonth(displayMonth, year);
            // If current month=Jan, last month=Dec (31 days)
            if (month == 0) {
                displayMonth = 11;
                displayYear = year - 1;
                daysInMonth = 31;
            }
            // Populate calData using dates from last month
            normalMonth = displayMonth + 1;
            for (let i=0, date=daysInMonth-calWeekDay+1; i<calWeekDay; i++, date++) {
                logDebug('CalendarTable.makeCalData: push{month: '+normalMonth+', date: '+date+', year: '+displayYear+'}');
                calData.push({month: normalMonth, date: date, year: displayYear});
            }
        }

        // Populate calData using dates from this month
        daysInMonth = this.getDaysInMonth(month, year);
        normalMonth = month + 1;
        for (let i=calWeekDay, date=1; date<=daysInMonth; i++, date++) {
            logDebug('CalendarTable.makeCalData: push{month: '+normalMonth+', date: '+date+', year: '+year+'}');
            calData.push({month: normalMonth, date: date, year: year, className: 'cal-td-bold'});
        }

        // Show days from next month to complete the calendar
        displayMonth = month + 1;
        displayYear = year;
        // If current month=Dec, next month=Jan
        if (month == 11) {
            displayMonth = 0;
            displayYear = year + 1;
        }
        let lastDayOfCalendar = 35; // Last day of 5th row of calendar
        if (daysInMonth+calWeekDay > 35) {
            lastDayOfCalendar = 42; // Extend calendar to 6 rows
        }
        // Populate calData using dates from next month
        normalMonth = displayMonth + 1;
        for (let i=daysInMonth+calWeekDay, date=1; i<lastDayOfCalendar; i++, date++) {
            logDebug('CalendarTable.makeCalData: push{month: '+normalMonth+', date: '+date+', year: '+displayYear+'}');
            calData.push({month: normalMonth, date: date, year: displayYear});
        }

        return calData;
    }

    render() {
        logDebug('CalendarTable.render');
        let thead = e('tr',{},
            e('th', {
                className: 'cal-th',
                },
                e('img', {
                    className: '',
                    src: '/img/left-arrow.svg',
                    onClick: this.handleOnClickLeftArrow,
                }),
            ),
            e('th', {
                className: 'cal-th',
                colSpan: '5',
                },
                this.getMonthName(this.state.month).toUpperCase()
            ),
            e('th', {
                className: 'cal-th',
                },
                e('img', {
                    className: '',
                    src: '/img/right-arrow.svg',
                    onClick: this.handleOnClickRightArrow,
                }),
            ),
        );

        let calData = this.makeCalData();
        let calRows = calData.length / 7;
        let tbody = [];
        for (let i=0; i<calRows; i++) {
            let tds = [];
            for (let j=0; j<7; j++) {
                let className = 'cal-td';
                let index = i * 7 + j;
                if (typeof(calData[index].className) !== 'undefined') {
                    className = className + ' ' + calData[index].className;
                }
                tds.push(e(CalendarTd, {
                    key: index, // Warning suppression
                    className: className,
                    month: calData[index].month,
                    date: calData[index].date,
                    year: calData[index].year,
                    handleOnClick: this.props.handleOnClick,
                }));
            }
            tbody.push(e('tr', {
                key: i, // Warning suppression
                },
                tds
            ));
        }

        return(e('table', {
            className: this.props.className,
            },
            e('thead', {
                },
                thead
            ),
            e('tbody', {
                },
                tbody
            ),
        ));
    }
}

class DatePickerFragment extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnChangeInput = this.handleOnChangeInput.bind(this);
        this.handleOnClickButton = this.handleOnClickButton.bind(this);
        this.handleOnClickCal = this.handleOnClickCal.bind(this);
        this.state = {
            isCalVisible: false,
            date: '',
        };
    }

    handleOnChangeInput(event) {
        this.setState({date: event.target.value});
    }

    handleOnClickButton() {
        this.setState({isCalVisible: true});
    }

    handleOnClickCal(clickedDate) {
        this.setState({isCalVisible: false});
        this.setState({date: clickedDate});
    }

    render() {
        logDebug('DatePickerFragment.render');
        let calDivClassName = 'hide';
        if (this.state.isCalVisible) {
            calDivClassName = 'show';
        }

        let label = this.props.date.label;
        let input = this.props.date.input;
        let button = this.props.date.button;
        let cal = this.props.date.cal;
        return(e(
            React.Fragment, {
            },
            e('label', {
                id: label.id,
                className: label.className,
                },
                label.text
            ),
            e('input', {
                type: 'text',
                id: input.id,
                className: input.className,
                onChange: this.handleOnChangeInput,
                value: this.state.date,
            }),
            e('button', {
                type: 'button',
                id: button.id,
                className: button.className,
                onClick: this.handleOnClickButton,
                },
                e('img', {
                    className: button.imgClassName,
                    src: button.imgSrc,
                }),
            ),
            e('div', {
                id: cal.id,
                className: calDivClassName,
                },
                e(CalendarTable, {
                    className: cal.tableClassName,
                    handleOnClick: this.handleOnClickCal,
                }),
            ),
        ));
    }
}

