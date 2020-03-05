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

function makeReportDateButtons() {
    let buttonDetails = [{
            id: 'button-report-00',
            className: 'report-button report-button-size',
            text: 'TODAY',
            handleOnClick: function() {
                layerScooters1Week.visible = false;
                layerScootersPast.visible = false;
                layerScootersToday.visible = true;
            },
        }, {
            id: 'button-report-01',
            className: 'report-button report-button-size',
            text: '1 WEEK',
            handleOnClick: function() {
                layerScootersToday.visible = false;
                layerScootersPast.visible = false;
                layerScooters1Week.visible = true;
            },
        }, {
            id: 'button-report-02',
            className: 'report-button report-button-size',
            text: 'PAST 1 WEEK',
            handleOnClick: function() {
                layerScootersPast.visible = true;
                layerScootersToday.visible = false;
                layerScooters1Week.visible = false;
            },
        },
    ];

    logDebug('makeToolbar ReactDOM.render');
    ReactDOM.render(e(ToolbarFragment, {
        buttonDetails: buttonDetails,
        }),
        document.getElementById('div-report-date')
    );
}

function pageInit() {
    makeToolbar();
    makeReportDateButtons();
}

