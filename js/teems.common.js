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
                className: 'close-button-size',
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

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        let sysDate = new Date();
        this.state = {
            month: sysDate.getMonth(),
            year: sysDate.getFullYear(),
        };
    }

    render() {
        let months = [
            {name: 'January', days: 31},
            {name: 'February', days: 28},
            {name: 'March', days: 31},
            {name: 'April', days: 30},
            {name: 'May', days: 31},
            {name: 'June', days: 30},
            {name: 'July', days: 31},
            {name: 'August', days: 31},
            {name: 'September',days: 30},
            {name: 'Octoboer', days: 31},
            {name: 'November', days: 30},
            {name: 'December', days: 31},
        ];
        let calDate = new Date(months[this.state.month].name+'/1/'+this.state.year);
        let calDay = calDate.getDay(); // Day of week
        console.log('month='+months[this.state.month].name);
        console.log('calDay='+calDay);

        // Leap year check
        let year = this.state.year;
        let leapYear = false;
        if (year % 400 == 0) {leapYear = true;} // console.log('400: Leap year');}
        else {
            if (year % 100 == 0) {console.log('100: Not a leap year');}
            else {
                if (year % 4 == 0) {leapYear = true;} // console.log('4: Leap year');}
                else {console.log('Default: Not a leap year');}
            }
        }
        if (leapYear) {
            console.log('days='+months[1].days);
            months[1].days = 29;
            console.log('days='+months[1].days);
        }

        return e('div', {});
    }
}

class DatePickerFragment extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let date = this.props.date;

        let datePicker = [
            e('input', {
                type: 'text',
                id: date.inputId,
                className: date.inputClassName,
            }),
            e('button', {
                type: 'button',
                id: date.buttonId,
                className: date.buttonClassName,
                },
                e('img', {
                    className: date.imgClassName,
                    img: date.imgSrc,
                }),
            ),
            e('div', {
                id: date.calId,
                className: date.calClassName,
            }),
        ];

        return e(React.Fragment, null, datePicker);
    }
}

