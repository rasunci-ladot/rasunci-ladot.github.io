'use strict';

class CandidateItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.state = {
            fontSetting: this.props.className,
        }
    }

    handleMouseOver() {
        this.setState({fontSetting: this.props.hilites});
    }

    handleMouseOut() {
        this.setState({fontSetting: this.props.className});
    }

    handleClick() {
        window.location.href = this.props.url;
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

class CandidatesList extends React.Component {
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
            // Use a hashtable to create a list of unique addresses
            if (typeof(addresses[address]) === 'undefined') {
                addresses[address] = i; // Only addresses NOT already defined get added
                ordered.push(address);
            }
        }
        this.setState({candidates: ordered});
    }

    render() {
        let candidates = [];
        let i;
        for (i=0; i<this.state.candidates.length; i++) {
            candidates.push(e(CandidateItem, {
                    key: i, // Suppress warnings
                    className: this.props.itemClassName,
                    hilites: this.props.itemHilites,
                    candidate: this.state.candidates[i],
                    }
                )
            );
        }

        return e('ul', {
            className: this.state.className,
            id: this.props.id,
            },
            candidates
        );
    }
}

class CandidatesForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            buttonIsDisabled: true,
            location: '',
        };
        this.listValidateRef = React.createRef();
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

    getCandidates() {
        let url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
        let query = '?SingleLine=' + this.state.location + ', los angeles, ca&f=pjson';
    
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url + query);
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
    }

    handleError(statusText) {
        console.log(statusText);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.getCandidates().then(this.props.listRef.current.updateCandidates, this.handleError);
    }

    render() {
        return e('form', {onSubmit: this.handleSubmit},
            e('input', {
                className: this.props.inputClassName,
                id: this.props.inputId,
                onChange: this.handleChange,
                }
            ),
            e('button', {
                type: 'submit',
                className: this.props.buttonClassName,
                id: this.props.buttonId,
                disabled: this.state.buttonIsDisabled,
                },
                'VALIDATE'
            ),
        );
    }
}

class CandidatesPanel extends React.Component {
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
    }

    render() {
        return e(
            React.Fragment,
            null,
            e('div', {
                className: 'fonts-std-c toolbar-font',
                id: 'div-validate-text'
                },
                'Enter Location'
            ),
            e(CandidatesForm, {
                inputClassName: 'fonts-std-c',
                inputId: 'input-validate',
                buttonClassName: 'fonts-std-c toolbar-font',
                buttonId: 'button-validate',
                listRef: this.listRef,
                }
            ),
            e(CandidatesList, {
                ref: this.listRef,
                className: 'fonts-std',
                id: 'list-validate',
                itemClassName: 'fonts-std',
                itemHilites: 'fonts-std hilite',
                }
            ),
        );
    }
}

function RequesterMain() {
    ReactDOM.render(e(CandidatesPanel, null), document.getElementById('div-validate'));
}

