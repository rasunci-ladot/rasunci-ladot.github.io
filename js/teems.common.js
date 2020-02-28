'use strict';

const e = React.createElement;

class ToolbarButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(e('button', {
            type: 'button',
            id: this.props.id,
            className: this.props.className,
            onClick: this.props.handleOnClick,
            },
            e('img', {
                className: this.props.imgClassName,
                src: this.props.img,
                }
            ),
        ));
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
            toolbar.push(e(ToolbarButton, {
                key: i, // Warning suppression
                id: buttons[i].id,
                className: buttons[i].className,
                handleOnClick: buttons[i].handleOnClick,
                img: buttons[i].img,
                imgClassName: buttons[i].imgClassName,
                },
            ));
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
        return(e('button', {
            type: 'button',
            className: 'close-button close-button-size',
            onClick: this.handleOnClick,
            },
            e('img', {
                className: 'close-button-img-size',
                src: '/img/window-close.png',
                }
            ),
        ));
    }
}

class PanelFragment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(e(
            React.Fragment, {
            },
            e(CloseButton, {
                panelId: this.props.panelId,
                }
            ),
            this.props.elements,
        ));
    }
}

class CalendarTd extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
        this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.zeroPad = this.zeroPad.bind(this);
        this.state = {
            isMouseOver: false,
        };
    }

    handleOnMouseOver() {
        this.setState({isMouseOver: true});
    }

    handleOnMouseOut() {
        this.setState({isMouseOver: false});
    }

    handleOnClick(event) {
        let month = this.zeroPad(event.target.dataset.month);
        let date = this.zeroPad(event.target.dataset.date);
        let year = event.target.dataset.year;
        this.props.handleOnClick(month+'/'+date+'/'+year);
    }

    zeroPad(i) {
        let padded = ['dummy', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
        if (i > 0 && i < 10) {
            return padded[i];
        }
        return i.toString();
    }

    render() {
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
        this.monthNumber2Name = this.monthNumber2Name.bind(this);
        this.makeCalData = this.makeCalData.bind(this);
        let sysDate = new Date();
        this.state = {
            month: sysDate.getMonth(), // Jan=0, Dec=11
            year: sysDate.getFullYear(),
        };
    }

    handleOnClickLeftArrow() {
        // Assume month=Dec and year=last year
        let month = 11;
        let year = this.state.year - 1;
        if (this.state.month > 0) {
            month = this.state.month - 1;
            year = this.state.year;
        }
        this.setState({month: month});
        this.setState({year: year});
    }

    handleOnClickRightArrow() {
        // Assume month=Jan and year=next year
        let month = 0;
        let year = this.state.year + 1;
        if (this.state.month < 11) {
            month = this.state.month + 1;
            year = this.state.year;
        }
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
        //else {
        //    daysInFeb = 28;
        //}

        let daysInMonth = [31, daysInFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return daysInMonth[month];
    }

    monthNumber2Name(month) {
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
        let month = this.state.month;
        let year = this.state.year;
        let adjustedMonth = month + 1; // Jan=1, Dec=12
        let calDate = new Date(adjustedMonth+'/1/'+year); // First day of month
        let calWeekDay = calDate.getDay(); // Get corresponding day of the week
        let calDays = this.getDaysInMonth(month, year);
        let calData = [];

        // If First day of month is not Sunday, show days from last month
        if (calWeekDay > 0) {
            // Assume current month=Jan. So last month=Dec (31 days)
            let lastMonth = 11;
            let lastMonthCalDays = 31;
            // If current month is NOT Jan
            if (month > 0) {
                lastMonth = month - 1;
                lastMonthCalDays = this.getDaysInMonth(lastMonth, year);
            }
            // Populate cal array using dates from last month
            for (let i=0, date=lastMonthCalDays-calWeekDay+1; i<calWeekDay; i++, date++) {
                // console.log('i,j='+i+','+j);
                calData.push({month: adjustedMonth, date: date, year: year});
            }
        }

        // Populate cal array using dates from this month
        for (let i=calWeekDay, date=1; date<=calDays; i++, date++) {
            // console.log('i,j='+i+','+j);
            calData.push({month: adjustedMonth, date: date, year: year, className: 'cal-td-bold'});
        }

        // Populate cal array using dates from next month
        let lastTd = 35;
        if (calDays+calWeekDay > 35) {
            lastTd = 42;
        }
        for (let i=calDays+calWeekDay, date=1; i<lastTd; i++, date++) {
            // console.log('i,j='+i+','+j);
            calData.push({month: adjustedMonth, date: date, year: year});
        }

        return calData;
    }

    render() {
        let thead = e('tr',{},
            e('th', {
                className: 'cal-th',
                },
                e('img', {
                    className: '',
                    src: '/img/left-arrow.svg',
                    onClick: this.handleOnClickLeftArrow,
                    },
                ),
            ),
            e('th', {
                className: 'cal-th',
                colSpan: '5',
                },
                this.monthNumber2Name(this.state.month).toUpperCase()
            ),
            e('th', {
                className: 'cal-th',
                },
                e('img', {
                    className: '',
                    src: '/img/right-arrow.svg',
                    onClick: this.handleOnClickRightArrow,
                    },
                ),
            ),
        );

        let calData = this.makeCalData();
        let calRows = calData.length / 7;
        let tbody = [];
        for (let i=0; i<calRows; i++) {
            let tds = [];
            for (let j=0; j<7; j++) {
                let index = i * 7 + j;
                let className = 'cal-td';
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
                    },
                ));
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
        let calDivClassName = 'hide';
        if (this.state.isCalVisible) {
            calDivClassName = 'show';
        }

        let date = this.props.date;
        return(e(
            React.Fragment, {
            },
            e('label', {
                id: date.labelId,
                className: date.labelClassName,
                },
                date.labelText
            ),
            e('input', {
                type: 'text',
                id: date.inputId,
                className: date.inputClassName,
                onChange: this.handleOnChangeInput,
                value: this.state.date,
            }),
            e('button', {
                type: 'button',
                id: date.buttonId,
                className: date.buttonClassName,
                onClick: this.handleOnClickButton,
                },
                e('img', {
                    className: date.imgClassName,
                    img: date.imgSrc,
                    }
                ),
            ),
            e('div', {
                id: date.calId,
                className: calDivClassName,
                },
                e(CalendarTable, {
                    className: date.calTableClassName,
                    handleOnClick: this.handleOnClickCal,
                }),
            ),
        ));
    }
}

