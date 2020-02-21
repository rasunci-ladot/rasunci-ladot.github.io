'use strict';

class ToolbarButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e('div', {
            className: this.props.className,
            id: this.props.id,
            onClick: this.props.handler
            },
            this.props.face
        );
    }
}

function makeToolbar() {
    function handleOpenPanel() {
        document.getElementById('div-validate').style.visibility = 'visible';
        document.getElementById('input-validate').value = '';
        document.getElementById('input-validate').focus();
    }

    function handleGoTo() {
        window.location.href = '/home';
    }

    return e(
        React.Fragment,
        null,
        e(ToolbarButton, {
            className: 'toolbar-button-large toolbar-size-large',
            id: 'div-toolbar-00',
            face: e('img', {
                className: 'toolbar-size-large',
                src: '/img/la-logo.svg'
            })
        }),
        e(ToolbarButton, {
            className: 'toolbar-button toolbar-size',
            id: 'div-toolbar-01',
            handler: handleOpenPanel,
            face: e('img', {
                className: 'toolbar-size',
                src: '/img/new-work-order.svg'
            })
        }),
        e(ToolbarButton, {
            className: 'toolbar-button toolbar-size',
            id: 'div-toolbar-02',
            handler: handleGoTo,
            face: e('img', {
                className: 'toolbar-size',
                src: '/img/search-work-orders.svg'
            })
        }),
    );
}

function ToolsMain() {
    ReactDOM.render(e(makeToolbar, {}), document.getElementById('div-toolbar'));
}

