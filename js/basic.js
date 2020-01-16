'use strict';

// Using React with handlers
class NavButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        window.location.href = this.props.url;
    }

    renderfoo() {
        return React.createElement(
            'button',
            { className: this.props.className, id: this.props.id, url: this.props.url, onClick: this.handleClick },
            this.props.name
        );
    }

    render() {
        let buttonDisplay = this.props.name;
        if (this.props.img != null) {
            let alt = 'alt none';
            if (this.props.alt != null) {
                alt = this.props.alt;
            }

            let width = '60px';
            if (this.props.width != null) {
                width = this.props.width;
            }

            let height = '60px';
            if (this.props.height != null) {
                height = this.props.height;
            }

            buttonDisplay = React.createElement('img', { src: this.props.img, alt: alt, width: width, height: height });
        }

        return React.createElement(
            'button',
            { className: this.props.className, id: this.props.id, onClick: this.handleClick },
            buttonDisplay
        );
    }
}

function MakeNavButtons() {
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(NavButton, { className: 'navbar', id: 'navbar-00', img: '/img/la_logo.svg', width: '80px', height: '80px', url: '/home' }),
        React.createElement(NavButton, { className: 'navbar', id: 'navbar-01', img: '/img/micro-scooter-svgrepo-com.svg', url: '/gray/scooters_report.html' }),
        React.createElement(NavButton, { className: 'navbar', id: 'navbar-02', img: '/img/list-svgrepo-com.svg', url: '/gray/vehicle_list.html' }),
        React.createElement(NavButton, { className: 'navbar', id: 'navbar-03', img: '/img/locator-pointing-on-map-svgrepo-com.svg', url: '/gray/area_map.html' }),
    );
}

