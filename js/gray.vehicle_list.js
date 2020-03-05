'use strict';

class VehicleListTr extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        logDebug('VehicleListTr.render');
        let dataKeys = this.props.dataKeys;
        let data = this.props.data;
        let className = this.props.className;
        let tds = [];
        for (let i=0; i<dataKeys.length; i++) {
            tds.push(e('td', {
                key: i, // Warning suppression
                className: className[dataKeys[i]],
                },
                data[dataKeys[i]],
            ));
        }

        return e('tr', {
            //id: this.props.id,
            className: this.props.stripe,
            },
            tds
        );
    }
}

class VehicleListTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //logDebug('VehicleListTable.render');
        let dataKeys = this.props.dataKeys;
        let data = this.props.data;
        let className = this.props.className;
        let trs = [];
        for (let i=0; i<data.length; i++) {
            let stripe = '';
            if (i % 2) {
                stripe = 'blue';
            }
            trs.push(e(VehicleListTr, {
                key: i, // Warning suppression
                dataKeys: dataKeys,
                data: data[i],
                className: className[0],
                stripe: stripe,
            }));
        }

        return e('table', {
            id: this.props.id,
            //className: this.props.className,
            },
            e('tbody', {
                },
                trs
            )
        );
    }
}

function makeTableHeader() {
    let dataKeys = ['device_id', 'vehicle_id', 'provider_id', 'type', 'status'];

    // Make header text
    let dataValues = ['DEVICE ID', 'VEHICLE ID', 'PROVIDER ID', 'TYPE', 'STATUS'];
    let data = {};
    dataKeys.map((item, index) => data[item] = dataValues[index]);

    // Make header className
    let headerClassNameValues = [
        'header-device-id bold',
        'header-vehicle-id bold',
        'header-provider-id bold',
        'header-type bold',
        'header-status bold'
    ];
    let headerClassName = {};
    dataKeys.map((item, index) => headerClassName[item] = headerClassNameValues[index]);

    ReactDOM.render(e(VehicleListTable, {
            id: 'table-vehicles-header',
            dataKeys: dataKeys,
            data: [data],
            className: [headerClassName],
        }),
        document.getElementById('div-table-vehicles-header')
    );
}

function makeTable(responseText) {
    let json = JSON.parse(responseText);
    let dataKeys = ['device_id', 'vehicle_id', 'provider_id', 'type', 'status'];

    // Make data className
    let dataClassNameValues = [
        'header-device-id',
        'header-vehicle-id',
        'header-provider-id',
        'header-type',
        'header-status'
    ];
    let dataClassName = {};
    dataKeys.map((item, index) => dataClassName[item] = dataClassNameValues[index]);

    ReactDOM.render(e(VehicleListTable, {
            id: 'table-vehicles',
            dataKeys: dataKeys,
            data: json.data,
            className: [dataClassName],
        }),
        document.getElementById('div-table-vehicles')
    );
}

function makeList(responseText) {
    makeTableHeader();
    makeTable(responseText);
}

function getSomeData() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/res/vehicle-list-100.geojson");
        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(xhr.responseText);
                //logDebug('getSomeData: xhr.responseText='+xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = function () {
            reject('AJAX Error');
        };
        xhr.send();
    });
}

function getAllData() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/res/vehicle-list-all.geojson");
        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(xhr.responseText);
                //logDebug('getSomeData: xhr.responseText='+xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = function () {
            reject('AJAX Error');
        };
        xhr.send();
    });
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
    makeTableHeader();
    //getSomeData().then(makeList, logErr);
    getAllData().then(makeTable, logErr);
}

/*
document.getElementById('div-report').addEventListener('scroll', function (e) {
    // Switch to large table when scroll is near the bottom
    if (this.scrollHeight - this.scrollTop <= this.clientHeight * 1.25) {
        document.getElementById('div-table').style.display = 'none';
        document.getElementById('div-table-large').style.display = 'block';
    }
});
*/

