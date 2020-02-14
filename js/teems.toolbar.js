'use strict';

class ToolbarButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (typeof(this.props.url) === 'string') {
            window.location.href = this.props.url;
        }
        if (this.props.id == 'div-toolbar-01') {
            document.getElementById('div-validate').style.visibility = 'visible';
            document.getElementById('input-validate').value = '';
            document.getElementById('input-validate').focus();
        }
    }

    render() {
        return e('div', {
            className: this.props.className,
            id: this.props.id,
            url: this.props.url,
            onClick: this.handleClick
            },
            this.props.img
        );
    }
}

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let img00 = e('img', {className: 'toolbar-size-large', src: '/img/la-logo.svg'});
        let img01 = e('img', {className: 'toolbar-size', src: '/img/new-work-order.svg'});
        let img02 = e('img', {className: 'toolbar-size', src: '/img/search-work-orders.svg'});

        return e(
            React.Fragment,
            null,
            e(ToolbarButton, {className: 'toolbar-button-large toolbar-size-large', id: 'div-toolbar-00', url: null, img: img00}),
            e(ToolbarButton, {className: 'toolbar-button toolbar-size', id: 'div-toolbar-01', url: null, img: img01}),
            e(ToolbarButton, {className: 'toolbar-button toolbar-size', id: 'div-toolbar-02', url: null, img: img02}),
        );
    }
}

function ToolsMain() {
    ReactDOM.render(e(Toolbar, {}), document.getElementById('div-toolbar'));
}

