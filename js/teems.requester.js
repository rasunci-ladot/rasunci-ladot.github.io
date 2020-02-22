'use strict';

class CandidateItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.state = {
            fontSetting: this.props.className,
            x: null,
            y: null,
        }
    }

    handleMouseOver() {
        this.setState({fontSetting: this.props.hilites});
        this.setState({x: this.props.x});
        this.setState({y: this.props.y});
    }

    handleMouseOut() {
        this.setState({fontSetting: this.props.className});
    }

    handleClick() {
        document.getElementById('div-validate').style.visibility = 'hidden';
        window.view.zoom = 18;
        window.view.center = [this.state.x, this.state.y];
    }

    render() {
        return e('li', {
            className: this.state.fontSetting,
            id: this.props.id,
            onClick: this.handleClick,
            onMouseOver: this.handleMouseOver,
            onMouseOut: this.handleMouseOut,
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
            candidates: [],
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
        let i;
        for (i=0; i<len; i++) {
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
        let i;
        for (i=0; i<ordered.length; i++) {
            candidateList.push(e(CandidateItem, {
                    key: i, // Suppress warnings
                    className: this.props.itemClassName,
                    hilites: this.props.itemHilites,
                    candidate: ordered[i].address,
                    x: ordered[i].x,
                    y: ordered[i].y,
                    }
                )
            );
        }

        return e('ul', {
            className: this.state.className,
            id: this.props.id,
            },
            candidateList
        );
    }
}

class CandidateForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            buttonIsDisabled: true,
            location: '',
        };
    }

    handleChange(event) {
        let locLength = event.target.value.length;
        if (locLength > 0) {
            this.setState({buttonIsDisabled: false});
        }
        else {
            this.setState({buttonIsDisabled: true});
        }
        this.setState({location: event.target.value});
    }

    handleError(statusText) {
        console.log(statusText);
    }

    handleSubmit(event) {
        event.preventDefault();

        let url = this.props.arcgisURL;
        let query = this.state.location;
        if (query.match(/los angeles/i)) {
            url += query + this.props.arcgisFormat;
        }
        else {
            url += query + this.props.arcgisCity + this.props.arcgisFormat;
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
        return e('form', {onSubmit: this.handleSubmit},
            e('input', {
                className: this.props.inputClassName,
                id: this.props.inputId,
                onChange: this.handleChange,
            }),
            e('button', {
                type: 'submit',
                className: this.props.buttonClassName,
                id: this.props.buttonId,
                disabled: this.state.buttonIsDisabled,
                },
                this.props.buttonFace
            ),
        );
    }
}

class CloseButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        document.getElementById(this.props.panel).style.visibility = 'hidden';
    }

    render() {
        return e('button', {
            type: 'button',
            id: this.props.id,
            className: 'close-button close-button-size',
            onClick: this.handleClick,
            },
            e('img', {
                className: 'close-button-size',
                src: '/img/window-close.png',
            })
        );
    }
}

class SimplePanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            React.Fragment,
            null,
            e(CloseButton, {
                id: this.props.closeButtonId,
                panel: this.props.id,
            }),
            this.props.elements,
        );
    }
}

function makeCandidatePanel() {
    // Create a pointer to CandidateList
    let listRef = React.createRef();

    let elements = [
        e('div', {
            key: 'labelAddress', // Warning suppression
            id: 'div-validate-text',
            className: 'fonts-std-c toolbar-font',
            },
            'Enter Location'
        ),
        e(CandidateForm, {
            key: 'candidateForm', // Warning suppression
            inputId: 'input-validate',
            inputClassName: 'fonts-std-c',
            buttonId: 'button-validate',
            buttonClassName: 'fonts-std-c toolbar-font',
            buttonFace: 'VALIDATE',
            listRef: listRef, // Pass listRef pointer to CandidateForm so it can update CandidateList
            arcgisURL: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=',
            arcgisCity: ',los angeles,ca',
            arcgisFormat: '&f=pjson',
        }),
        e(CandidateList, {
            key: 'candidateList', // Warning suppression
            ref: listRef,
            id: 'list-validate',
            className: 'fonts-std',
            itemClassName: 'fonts-std',
            itemHilites: 'fonts-std hilite',
        })
    ];

    ReactDOM.render(e(SimplePanel, {
            id: 'div-validate',
            elements: elements
        }),
        document.getElementById('div-validate')
    );
}

function pageInit() {
    ReactDOM.render(e(makeToolbar, {}), document.getElementById('div-toolbar'));
    makeCandidatePanel();
}

