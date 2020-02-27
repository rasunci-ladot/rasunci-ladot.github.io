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
            fontSetting += ' .hilites';
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
        //console.log('CandidateForm.render: dateRange='+dateRange);
        let startDate = this.props.startDate;
        let endDate = this.props.endDate;
        let location = this.props.location;
        let validate = this.props.validate;

        return e('form', {onSubmit: this.handleOnSubmit},
            e('label', {id: dateRange.labelId}, dateRange.labelText),
/*
            e('label', {id: startDate.labelId}, startDate.labelText),
            e('input', {
                type: 'text',
                id: startDate.inputId,
            }),
            e('button', {
                type: 'button',
                id: startDate.buttonId,
                },
                e('img', {
                    className: startDate.imgClassName,
                    src: startDate.imgSrc,
                }),
            ),
            e('label', {id: endDate.labelId}, endDate.labelText),
            e('input', {
                type: 'text',
                id: endDate.inputId,
            }),
            e('button', {
                type: 'button',
                id: endDate.buttonId,
                },
                e('img', {
                    className: endDate.imgClassName,
                    src: endDate.imgSrc,
                }),
            ),
*/
            e(DatePickerFragment, {date: startDate}),
            e(DatePickerFragment, {date: endDate}),
            e('label', {id: location.labelId}, location.labelText),
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
    //console.log('makeCandidatePanel: dateRange.labelId='+dateRange.labelId);
    //console.log('makeCandidatePanel: dateRange.labelText='+dateRange.labelText);

    let startDate = {
        labelId: 'label-start-date',
        labelText: 'Start Date',
        inputId: 'input-start-date',
        buttonId: 'button-start-date',
        imgClassName: 'cal-button',
        imgSrc: '/img/foo.png',
        calendarId: 'div-start-date-cal',
        calendarTableClassName: 'cal-table',
    };

    let endDate = {
        labelId: 'label-end-date',
        labelText: 'End Date',
        inputId: 'input-end-date',
        buttonId: 'button-end-date',
        imgClassName: 'cal-button',
        imgSrc: '/img/foo.png',
        calendarId: 'div-end-date-cal',
        calendarTableClassName: 'cal-table',
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
    let buttons = [{
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

    ReactDOM.render(e(ToolbarFragment, {buttons: buttons}), document.getElementById('div-toolbar'));
}

function pageInit() {
/*
    let date = new Date();
    console.log('date='+date);
    //let newDate = new Date('February 1, 2020');
    let newDate = new Date('2/1/2020');
    console.log('newDate='+newDate);
    console.log('newDate: day='+newDate.getDay());
    let checkDate = new Date();
    console.log('checkDate='+checkDate);

    let sysDate = new Date();
    let year = sysDate.getFullYear();
    console.log('year='+year);
    let month = sysDate.getMonth();
    month++;
    console.log('month='+month);
    let helperDate = new Date(month+'/1/'+year);
    let day = helperDate.getDay();
    console.log('day='+day);
    console.log('month/day/year='+month+'/1/'+year+', day='+day);

    if (year % 400 == 0) {console.log('400: leap year');}
    else {
        if (year % 100 == 0) {console.log('100: not leap year');}
        else {
            if (year % 4 == 0) {console.log('4: leap year');}
            else {console.log('last: not leap year');}
        }
    }
*/
    makeToolbar();
    makeCandidatePanel();

    ReactDOM.render(e(Calendar, {}), document.getElementById('div-wo'));
}

