'use strict';

var layerScootersToday = null;
var layerScooters1Week = null;
var layerScootersPast = null;

// ArcGIS API
require([
    'esri/Map',
    'esri/views/MapView',
    'esri/layers/TileLayer',
    'esri/layers/FeatureLayer',
    'esri/layers/GeoJSONLayer',
    'esri/renderers/SimpleRenderer',
    'esri/Graphic',
    'esri/symbols/SimpleLineSymbol',
    'esri/geometry/Polyline'
    ],
    function(
        Map,
        MapView,
        TileLayer,
        FeatureLayer,
        GeoJSONLayer,
        SimpleRenderer,
        Graphic,
        SimpleLineSymbol,
        Polyline
        ){

        let map = new Map({
            basemap: 'gray-vector'
        });

        let view = new MapView({
            container: 'div-map',
            map: map,
            center: [-118.243422, 34.051249],
            zoom: 11
        });

        function renderLADOT() {
            return ({
                type: 'simple',
                symbol: {
                    type: 'simple-marker',
                    size: 18,
                    color: 'black',
                    outline: {
                        width: 2,
                        color: 'white'
                    }
                }
            });
        }

        function renderPoint(size=4, color='black') {
            return ({
                type: 'simple',
                symbol: {
                    type: 'simple-marker',
                    size: size,
                    color: color
                }
            });
        }

        // ArcGIS has built-in promises
        function makeDataLayer(url, visible, renderer) {
            return (new GeoJSONLayer({
                url: url,
                visible: visible,
                renderer: renderer
            }));
        }

        let layerLADOT = makeDataLayer('/res/ladot.geojson', true, renderLADOT());
        map.add(layerLADOT);

        layerScootersToday = makeDataLayer('/res/live-scooters-today.geojson', true, renderPoint(4, 'red'));
        map.add(layerScootersToday);

        layerScooters1Week = makeDataLayer('/res/live-scooters-1week.geojson', false, renderPoint(4, 'yellow'));
        map.add(layerScooters1Week);

        layerScootersPast = makeDataLayer('/res/live-scooters-past.geojson', false, renderPoint(4, 'gray'));
        map.add(layerScootersPast);

        map.reorder(layerLADOT, 4);
    }
);

