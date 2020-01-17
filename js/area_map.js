'use strict';

const e = React.createElement;

function PageInit() {
    ReactDOM.render(e(MakeNavButtons, null), document.getElementById('div-navbar'));
}
