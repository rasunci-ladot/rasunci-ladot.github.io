'use strict';

class CandidateItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
        this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
        this.state = {
            isMouseOver: false,
        }
    }

    handleOnMouseOver() {
        this.setState({isMouseOver: true});
    }

    handleOnMouseOut() {
        this.setState({isMouseOver: false});
    }

    handleOnClick() {
        //document.getElementById('div-location').style.visibility = 'hidden';
        //window.view.zoom = 18;
        window.view.center = [this.props.x, this.props.y];
    }

    render() {
        let fontSetting = this.props.className;
        if (this.state.onMouseOver) {
            fontSetting += ' hilite';
        }

        return e('li', {
            id: this.props.id,
            className: fontSetting,
            onClick: this.handleOnClick,
            onMouseOver: this.handleOnMouseOver,
            onMouseOut: this.handleOnMouseOut,
            },
            this.props.candidate
        );
    }
}

class CandidateList extends React.Component {
    constructor(props) {
        super(props);
        this.updateCandidates = this.updateCandidates.bind(this);
        this.state = {
            candidates: [], // Use state to store candidates and render list (since parent is stateless)
        };
    }

    updateCandidates(responseText) {
        let json = JSON.parse(responseText);
        let len = json.candidates.length;
        if (len > 7) {
            len = 7; // Limit results to top 7
        }
        let addresses = {};
        let ordered = [];
        for (let i=0; i<len; i++) {
            let address = json.candidates[i].address;
            // Create a list of unique addresses
            if (typeof(addresses[address]) === 'undefined') {
                addresses[address] = i; // Hashtable adds only addresses NOT already defined
                let x = json.candidates[i].location.x;
                let y = json.candidates[i].location.y;
                ordered.push({address: address, x: x, y: y});  // Save in array
            }
        }
        this.setState({candidates: ordered});
    }

    render() {
        let ordered = this.state.candidates;
        let candidateList = [];
        for (let i=0; i<ordered.length; i++) {
            candidateList.push(e(CandidateItem, {
                    key: i, // Suppress warnings
                    className: this.props.itemClassName,
                    candidate: ordered[i].address,
                    x: ordered[i].x,
                    y: ordered[i].y,
                    }
                )
            );
        }

        return e('ul', {
            id: this.props.id,
            className: this.state.className,
            },
            candidateList
        );
    }
}

class CandidateForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.state = {
            buttonIsDisabled: true,
            location: '',
        };
    }

    handleOnChange(event) {
        let locLength = event.target.value.length;
        if (locLength > 0) {
            this.setState({buttonIsDisabled: false});
        }
        else {
            this.setState({buttonIsDisabled: true});
        }
        this.setState({location: event.target.value});
    }

    handleOnError(statusText) {
        console.log(statusText);
    }

    handleOnSubmit(event) {
        event.preventDefault();

        let url = this.props.arcgis.url;
        let query = this.state.location;
        if (query.match(/los angeles/i)) {
            url += query + this.props.arcgis.format;
        }
        else {
            url += query + this.props.arcgis.city + this.props.arcgis.format;
        }
    
        let promise = new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function() {
                if (xhr.status == 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = function() {
                reject('AJAX error');
            };
            xhr.send();
        });

        promise.then(this.props.listRef.current.updateCandidates, this.handleError);
    }

    render() {
        let dateRange = this.props.dateRange;
        let startDate = this.props.startDate;
        let endDate = this.props.endDate;
        let location = this.props.location;
        let validate = this.props.validate;

        return e('form', {
                onSubmit: this.handleOnSubmit
            },
            e('label', {
                id: dateRange.labelId
                },
                dateRange.labelText
            ),
            e(DatePickerFragment, {
                date: startDate
            }),
            e(DatePickerFragment, {
                date: endDate
            }),
            e('label', {
                id: location.labelId
                },
                location.labelText
            ),
            e('input', {
                type: 'text',
                id: location.inputId,
            }),
            e('button', {
                type: 'submit',
                id: validate.buttonId,
                },
                validate.buttonText,
            ),
        );
    }
}


function makeCandidatePanel() {
    // Create a pointer to CandidateList
    let listRef = React.createRef();

    let dateRange = {
        labelId: 'label-date-range',
        labelText: 'Enter Date Range',
    };

    let startDate = {
        labelId: 'label-start-date',
        labelText: 'Start Date',
        inputId: 'input-start-date',
        buttonId: 'button-start-date',
        imgClassName: 'cal-button',
        imgSrc: '/img/cal-day-one.svg',
        calId: 'div-start-date-cal',
        calTableClassName: 'cal-table',
    };

    let endDate = {
        labelId: 'label-end-date',
        labelText: 'End Date',
        inputId: 'input-end-date',
        buttonId: 'button-end-date',
        imgClassName: 'cal-button',
        imgSrc: '/img/cal-day-one.svg',
        calId: 'div-end-date-cal',
        calTableClassName: 'cal-table',
    };

    let location = {
        labelId: 'label-location',
        labelText: 'Enter Location',
        inputId: 'input-location',
    };

    let validate = {
        buttonId: 'button-validate',
        buttonDisabled: true,
        buttonText: 'VALIDATE',
    };

    let arcgis = {
        url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=',
        city: ',los angeles,ca',
        format: '&f=pjson',
    };

    let elements = [
        e(CandidateForm, {
            key: 1, // Warning suppression
            dateRange: dateRange,
            startDate: startDate,
            endDate: endDate,
            location: location,
            validate: validate,
            arcgis: arcgis,
            listRef: listRef, // Allow CandidateForm to update CandidateList
        }),
        e(CandidateList, {
            key: 2, // Warning suppression
            ref: listRef,
            id: 'list-location',
            className: 'fonts-std',
            itemClassName: 'fonts-std',
        }),
    ];

    ReactDOM.render(e(PanelFragment, {panelId: 'div-location', elements: elements}), document.getElementById('div-location'));
}

function makeToolbar() {
    let buttonProps = [{
            id: 'button-toolbar-00',
            className: 'toolbar-button-large toolbar-button-size-large',
            img: '/img/la-logo.svg',
            imgClassName: 'toolbar-button-size-large',
        }, {
            id: 'button-toolbar-01',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/new-work-order.svg',
            imgClassName: 'toolbar-button-size',
        }, {
            id: 'button-toolbar-02',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/search-work-orders.svg',
            imgClassName: 'toolbar-button-size',
        },
    ];

    ReactDOM.render(e(ToolbarFragment, {buttons: buttonProps}), document.getElementById('div-toolbar'));
}

function pageInit() {
    makeToolbar();
    makeCandidatePanel();
    ReactDOM.render(e(CalendarTable, {}), document.getElementById('div-wo'));
}

