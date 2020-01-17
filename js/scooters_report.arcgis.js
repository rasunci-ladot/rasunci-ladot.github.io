'use strict';

// Globals
var mapScootersReportLADOT = null;
var mapScootersReportToday = null;
var mapScootersReport1Week = null;
var mapScootersReportPast = null;
var reorderLADOT = null;


// ArcGIS API
require([
    'esri/Map',
    'esri/views/MapView',
    'esri/layers/GeoJSONLayer',
    'esri/renderers/SimpleRenderer'
    ],
    function(Map, MapView, GeoJSONLayer, SimpleRenderer) {
        var map = new Map({
            basemap: 'gray-vector'
        });

        var view = new MapView({
            container: 'scooters-report-div-map',
            map: map,
            center: [-118.243422, 34.051249],
            zoom: 11
        });

        function pointRenderer(size=4, color='black') {
            return ({
                type: 'simple',
                symbol: {
                    type: 'simple-marker',
                    size: size,
                    color: color
                }
            });
        }

        // No need to use Promises to create data layer because ArcGIS has it built-in
        function makeDataLayer(url, visible, renderer=pointRenderer()) {
            return (new GeoJSONLayer({
                url: url,
                visible: visible,
                renderer: renderer
            }));
        }

        let layerLADOT = null;
        mapScootersReportLADOT = function() {
            let renderLADOT = {
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
            };
            layerLADOT = makeDataLayer('/res/scooters_report_ladot.geojson', true, renderLADOT);
            map.add(layerLADOT);
        }

        mapScootersReportToday = function() {
            let renderToday = pointRenderer(4, 'red');
            let layer = makeDataLayer('/res/scooters_report_today.geojson', true, renderToday);
            map.add(layer);
            return layer;
        }        

        mapScootersReport1Week = function() {
            let render1Week = pointRenderer(4, 'yellow');
            let layer = makeDataLayer('/res/scooters_report_1week.geojson', false, render1Week);
            map.add(layer);
            return layer;
        }

        mapScootersReportPast = function() {
            let renderPast = pointRenderer(4, 'gray');
            let layer = makeDataLayer('/res/scooters_report_past.geojson', false, renderPast);
            map.add(layer);
            return layer;
        }

        reorderLADOT = function() {
            map.reorder(layerLADOT, 4);
        }

    }
);

