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
        this.props.handleOnClick();
        window.view.zoom = 18;
        window.view.center = [this.props.x, this.props.y];
    }

    render() {
        logDebug('CandidateItem.render');
        let className = this.props.className;
        if (this.state.isMouseOver) {
            className += ' hilite';
        }

        return e('li', {
            id: this.props.id,
            className: className,
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
        logDebug('CandidateList.render');
        let ordered = this.state.candidates;
        let candidateList = [];
        for (let i=0; i<ordered.length; i++) {
            candidateList.push(e(CandidateItem, {
                key: i, // Warning suppression
                className: this.props.itemClassName,
                handleOnClick: this.props.itemHandleOnClick,
                candidate: ordered[i].address,
                x: ordered[i].x,
                y: ordered[i].y,
            }));
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
            isButtonDisabled: true,
            location: '',
        };
    }

    handleOnChange(event) {
        let locLength = event.target.value.length;
        if (locLength > 0) {
            this.setState({isButtonDisabled: false});
        }
        else {
            this.setState({isButtonDisabled: true});
        }
        this.setState({location: event.target.value});
    }

    handleOnError(statusText) {
        logErr('CandidateForm.handleOnError: statusText='+statusText);
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
            logInfo('CandidateForm.handleOnSubmit: Inserting "los angeles, ca" to URL');
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
                logErr('CandidateForm.handleOnSubmit: AJAX error');
                reject('AJAX error');
            };
            xhr.send();
            logInfo('CandidateForm.handleOnSubmit: XHR GET, '+url);
        });

        promise.then(this.props.listRef.current.updateCandidates, this.handleError);
    }

    render() {
        logDebug('CandidateForm.render');
        let labelDateRange = this.props.labelDateRange;
        let datePickerStart = this.props.datePickerStart;
        let datePickerEnd = this.props.datePickerEnd;
        let labelLocation = this.props.labelLocation;
        let inputLocation = this.props.inputLocation;
        let buttonValidate = this.props.buttonValidate;

        return e('form', {
                onChange: this.handleOnChange,
                onSubmit: this.handleOnSubmit,
            },
            e('label', {
                id: labelDateRange.id,
                className: labelDateRange.className,
                },
                labelDateRange.text
            ),
            e(DatePickerFragment, {
                date: datePickerStart,
            }),
            e(DatePickerFragment, {
                date: datePickerEnd,
            }),
            e('label', {
                id: labelLocation.id,
                className: labelLocation.className,
                },
                labelLocation.text
            ),
            e('input', {
                type: 'text',
                id: inputLocation.id,
            }),
            e('button', {
                type: 'submit',
                id: buttonValidate.id,
                disabled: this.state.isButtonDisabled,
                },
                buttonValidate.text,
            ),
        );
    }
}


function makeCandidatePanel() {
    // Create a pointer to CandidateList
    let listRef = React.createRef();

    let labelDateRange = {
        id: 'label-date-range',
        className: 'fonts-std-c',
        text: 'Enter Date Range',
    };

    let datePickerStart = {
        label: {
            id: 'label-start-date',
            className: 'fonts-std',
            text: 'Start Date',
        },
        input: {
            id: 'input-start-date',
        },
        button: {
            id: 'button-start-date',
            className: 'cal-button cal-button-size',
            imgClassName: 'cal-button-img-size',
            imgSrc: '/img/monthly-calendar.svg',
        },
        cal: {
            id: 'div-start-date-cal',
            tableClassName: 'cal-table',
        },
    };

    let datePickerEnd = {
        label: {
            id: 'label-end-date',
            className: 'fonts-std',
            text: 'End Date',
        },
        input: {
            id: 'input-end-date',
        },
        button: {
            id: 'button-end-date',
            className: 'cal-button cal-button-size',
            imgClassName: 'cal-button-img-size',
            imgSrc: '/img/monthly-calendar.svg',
        },
        cal: {
            id: 'div-end-date-cal',
            tableClassName: 'cal-table',
        },
    };

    let labelLocation = {
        id: 'label-location',
        className: 'fonts-std-c',
        text: 'Enter Location',
    };

    let inputLocation = {
        id: 'input-location',
    };

    let buttonValidate = {
        id: 'button-validate',
        text: 'VALIDATE',
    };

    let arcgis = {
        url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=',
        city: ',los angeles,ca',
        format: '&f=pjson',
    };

    let elements = [
        e(CandidateForm, {
            key: 1, // Warning suppression
            labelDateRange: labelDateRange,
            datePickerStart: datePickerStart,
            datePickerEnd: datePickerEnd,
            labelLocation: labelLocation,
            inputLocation: inputLocation,
            buttonValidate: buttonValidate,
            arcgis: arcgis,
            listRef: listRef, // Allow CandidateForm to update CandidateList
        }),
        e(CandidateList, {
            key: 2, // Warning suppression
            ref: listRef,
            id: 'list-location',
            className: 'fonts-std',
            itemClassName: 'fonts-std',
            itemHandleOnClick: function(){document.getElementById('div-location').style.visibility = 'hidden';},
        }),
    ];

    logDebug('makeCandidatePanel ReactDOM.render');
    ReactDOM.render(e(PanelFragment, {
        handleOnClick: function(){document.getElementById('div-location').style.visibility = 'hidden';},
        elements: elements,
        }),
        document.getElementById('div-location')
    );
}

function makeToolbar() {
    let buttonDetails = [{
            id: 'button-toolbar-00',
            className: 'toolbar-button-large toolbar-button-size-large',
            img: '/img/la-logo.svg',
            imgClassName: 'toolbar-button-size-large',
        }, {
            id: 'button-toolbar-01',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/new-work-order.svg',
            imgClassName: 'toolbar-button-size',
            handleOnClick: function(){document.getElementById('div-location').style.visibility = 'visible';},
        }, {
            id: 'button-toolbar-02',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/search-work-orders.svg',
            imgClassName: 'toolbar-button-size',
        },
    ];

    logDebug('makeToolbar ReactDOM.render');
    ReactDOM.render(e(ToolbarFragment, {
        buttonDetails: buttonDetails,
        }),
        document.getElementById('div-toolbar')
    );
}

function makeArtPanel() {
    let buttonDetails = [{
            id: 'button-art-00',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/pencil.svg',
            imgClassName: 'toolbar-button-size',
        }, {
            id: 'button-art-01',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/scissors.svg',
            imgClassName: 'toolbar-button-size',
        }, {
            id: 'button-art-02',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/hdd.svg',
            imgClassName: 'toolbar-button-size',
        }, {
            id: 'button-art-03',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/cancel.svg',
            imgClassName: 'toolbar-button-size',
        },
    ];

    logDebug('makeArtPanel ReactDOM.render');
    ReactDOM.render(e(ToolbarFragment, {
        buttonDetails: buttonDetails,
        }),
        document.getElementById('div-art')
    );
}

function pageInit() {
    makeToolbar();
    makeCandidatePanel();
    makeArtPanel();
}

