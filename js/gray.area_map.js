'use strict';

function makeToolbar() {
    let buttonDetails = [{
            id: 'button-toolbar-00',
            className: 'toolbar-button-large toolbar-button-size-large',
            img: '/img/la-logo.svg',
            imgClassName: 'toolbar-button-size-large',
        }, {
            id: 'button-toolbar-01',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/micro-scooter.svg',
            imgClassName: 'toolbar-button-size',
            handleOnClick: function() {
                window.location.href = '/gray/scooters_report.html';
            },
        }, {
            id: 'button-toolbar-02',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/list.svg',
            imgClassName: 'toolbar-button-size',
            handleOnClick: function() {
                window.location.href = '/gray/vehicle_list.html';
            },
        }, {
            id: 'button-toolbar-03',
            className: 'toolbar-button toolbar-button-size',
            img: '/img/locator-pointing-on-map.svg',
            imgClassName: 'toolbar-button-size',
            handleOnClick: function() {
                window.location.href = '/gray/area_map.html';
            },
        },
    ];

    logDebug('makeToolbar ReactDOM.render');
    ReactDOM.render(e(ToolbarFragment, {
        buttonDetails: buttonDetails,
        }),
        document.getElementById('div-toolbar')
    );
}

function pageInit() {
    makeToolbar();
}

