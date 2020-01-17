'use strict';

const e = React.createElement;

class VehicleListRowTd extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let row = this.props.dataKeys.map(item => {
            return e(
                'td',
                { className: this.props.tdClasses[item] },
                this.props.data[item]
            );
        });

        return e(
            'tr',
            { className: this.props.className, id: this.props.id },
            row
        );
    }
}

class VehicleListHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return e(
            'table',
            { className: this.props.className, id: this.props.id },
            e(
                'tbody',
                null,
                e(VehicleListRowTd, {
                    className: this.props.trStripe,
                    dataKeys: this.props.dataKeys,
                    data: this.props.data,
                    tdClasses: this.props.tdClasses
                })
            )
        );
    }
}

class VehicleListTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let rows = [];
        for (let i = 0; i < this.props.data.length; i += 2) {
            rows.push(e(VehicleListRowTd, {
                dataKeys: this.props.dataKeys,
                data: this.props.data[i],
                tdClasses: this.props.tdClasses
            }));
            if (this.props.data[i + 1] != 'undefined') {
                rows.push(e(VehicleListRowTd, {
                    className: this.props.trStripe,
                    dataKeys: this.props.dataKeys,
                    data: this.props.data[i],
                    tdClasses: this.props.tdClasses
                }));
            }
        }

        return e(
            'table',
            { className: this.props.className, id: this.props.id },
            e(
                'tbody',
                null,
                rows
            )
        );
    }
}
'use strict';

//
// Page ops, logic, etc
//

function PageInit() {
    ReactDOM.render(e(MakeNavButtons, null), document.getElementById('div-navbar'));
    getSomeData().then(makeList, logError).then(makeLargeList, logError);
    //getAllData().then(makeLargeList, logError);
}

function getSomeData() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/res/vehicle_list100.json");
        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = function () {
            reject('Network error');
        };
        xhr.send();
    });
}

function makeList(responseText) {
    console.log('makeList: Start');
    let json = JSON.parse(responseText);
    let dataKeys = ['device_id', 'vehicle_id', 'provider_id', 'type', 'status'];
    let tdHeaderClassNames = ['header-device-id', 'header-vehicle-id', 'header-provider-id', 'header-type', 'header-status'];
    let tdHeaderClasses = {};
    dataKeys.map((item, index) => tdHeaderClasses[item] = tdHeaderClassNames[index]);
    let tdTableClassNames = ['device-id', 'vehicle-id', 'provider-id', 'type', 'status'];
    let tdTableClasses = {};
    dataKeys.map((item, index) => tdTableClasses[item] = tdTableClassNames[index]);

    ReactDOM.render(e(VehicleListHeader, {
        className: 'header',
        id: 'tr-header',
        dataKeys: dataKeys,
        data: tdTableClasses, // Reusing tdTableClasses as header data
        tdClasses: tdHeaderClasses,
        trStripe: 'gray'
    }), document.getElementById('div-header'));

    ReactDOM.render(e(VehicleListTable, {
        className: 'default',
        id: 'tr-table',
        dataKeys: dataKeys,
        data: json.data,
        tdClasses: tdTableClasses,
        trStripe: 'blue'
    }), document.getElementById('div-table'));

    return getAllData();
}

function getAllData() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/res/vehicle_list.json");
        xhr.onload = function () {
            if (xhr.status == 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = function () {
            reject('Network error');
        };
        xhr.send();
    });
}

function makeLargeList(responseText) {
    console.log('makeLargeList: Start');
    let json = JSON.parse(responseText);
    let dataKeys = ['device_id', 'vehicle_id', 'provider_id', 'type', 'status'];
    let tdTableClassNames = ['device-id', 'vehicle-id', 'provider-id', 'type', 'status'];
    let tdTableClasses = {};
    dataKeys.map((item, index) => tdTableClasses[item] = tdTableClassNames[index]);

    ReactDOM.render(e(VehicleListTable, {
        className: 'default',
        id: 'tr-table',
        dataKeys: dataKeys,
        data: json.data,
        tdClasses: tdTableClasses,
        trStripe: 'blue'
    }), document.getElementById('div-table-large'));

    console.log('makeLargeList: Done');
}

function logError(msg) {
    console.log('logError: msg=' + msg);
}

document.getElementById('div-table').addEventListener('scroll', function (e) {
    // Switch to large table when scroll is near the bottom
    if (this.scrollHeight - this.scrollTop <= this.clientHeight * 1.25) {
        document.getElementById('div-table').style.display = 'none';
        document.getElementById('div-table-large').style.display = 'block';
    }
});
