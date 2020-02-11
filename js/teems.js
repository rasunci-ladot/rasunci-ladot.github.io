'use strict';

const e = React.createElement;

class ToolsButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.url != null) {
            window.location.href = this.props.url;
        }
    }

    render() {
        return e(
            'div', {
                className: this.props.className,
                id: this.props.id,
                url: this.props.url,
                onClick: this.handleClick
            },
            this.props.img
        );
    }
}

function mkTools() {
    let img00 = e('img', {className: 'tools-size', src: '/img/la-logo.svg'});
    let img01 = e('img', {className: 'tools-size', src: '/img/new-work-order.svg'});
    let img02 = e('img', {className: 'tools-size', src: '/img/search-work-orders.svg'});
    return e(
        React.Fragment,
        null,
        e(ToolsButton, {className: 'tools-button tools-size', id: 'div-toolbar-00', url: null, img: img00}),
        e(ToolsButton, {className: 'tools-button tools-size', id: 'div-toolbar-01', url: null, img: img01}),
        e(ToolsButton, {className: 'tools-button tools-size', id: 'div-toolbar-02', url: null, img: img02}),
    );
}

class AddressCandidate extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        window.location.href = this.props.url;
    }

    render() {
        return e(
            'div', {
                className: this.props.className,
                id: this.props.id,
                onClick: this.handleClick
            },
            this.props.text
        );
    }
}

class AddressValidator extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            loc: "",
            isDisabled: true
        };
    }

    handleChange(event) {
        let locLength = event.target.value.length;
        if (locLength > 0) {
            this.setState({isDisabled: false});
        }
        else {
            this.setState({isDisabled: true});
        }
        this.setState({loc: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        alert('msg='+this.state.loc);
        console.log('msg='+this.state.loc);

        let url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
        let query = '?SingleLine=' + this.state.loc + ', los angeles, ca&f=pjson';
        console.log('query='+query);

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url + query);
        xhr.onload = function() {
            if (xhr.status == 200) {
                console.log(xhr.responseText);
            }
            else {
                console.log(xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.log(statusText);
        };
        xhr.send();
    }

    render() {
        return e(
            'form', {onSubmit: this.handleSubmit},
            e('input', {className: this.props.inputClassName, id: this.props.inputId, onChange: this.handleChange}),
            e('button', {
                type: 'submit',
                className: this.props.buttonClassName,
                id: this.props.buttonId,
                disabled: this.state.isDisabled
            },
            this.props.buttonName)
        );
    }
}

function mkAddressValidator() {
    return e(
        React.Fragment,
        null,
        e('div', {className: 'fonts-std tools-font', id: 'div-validate-text'}, 'Enter Location'),
        e(AddressValidator, {
            inputClassName: 'fonts-std',
            inputId: 'input-validate',
            buttonClassName: 'fonts-std tools-font',
            buttonId: 'button-validate',
            buttonName: 'VALIDATE'
        })
    );
}

function PageInit() {
    ReactDOM.render(e(mkTools, null), document.getElementById('div-toolbar'));
    ReactDOM.render(e(mkAddressValidator, null), document.getElementById('div-validate'));
}

