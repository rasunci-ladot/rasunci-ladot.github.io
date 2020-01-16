'use strict';

const e = React.createElement;

class ScootersReportButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        // Store handle to map layers as state
        this.state = {layer: null};
    }

    handleClick() {
        // Toggle visible
        let visible = this.state.layer.visible;
        this.state.layer.visible = !visible;
        // console.log('Changed visible='+this.state.layer.visible);
    }

    addLayer(newLayer) {
        this.setState({layer: newLayer});
        // console.log('Added layer='+newLayer);
    }

    render() {
        return e(
            'button',
            { className: this.props.className, id: this.props.id, layer: this.props.layer, onClick: this.handleClick },
            this.props.name
        );
    }
}

//
// Page ops, logic, etc
//

function PageInit() {
    ReactDOM.render(e(MakeNavButtons, null), document.getElementById('div-navbar'));

    // Get refs to React components in order to pass layer handles
    let refToday = ReactDOM.render(e(ScootersReportButton, {className: 'plain', id: 'scooters-report-button-today', name: 'TODAY'}), document.getElementById('scooters-report-div-today'));
    let ref1Week = ReactDOM.render(e(ScootersReportButton, {className: 'plain', id: 'scooters-report-button-1week', name: '1 WEEK'}), document.getElementById('scooters-report-div-1week'));
    let refPast = ReactDOM.render(e(ScootersReportButton, {className: 'plain', id: 'scooters-report-button-past', name: 'PAST 1 WEEK'}), document.getElementById('scooters-report-div-past'));

    mapScootersReportLADOT();

    let layerToday = mapScootersReportToday();
    refToday.addLayer(layerToday);

    let layer1Week = mapScootersReport1Week();
    ref1Week.addLayer(layer1Week);

    let layerPast = mapScootersReportPast();
    refPast.addLayer(layerPast);

    // Move LADOT layer on top
    reorderLADOT();
}

