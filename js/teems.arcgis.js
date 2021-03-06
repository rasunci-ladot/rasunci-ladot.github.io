'use strict';

// Globals
var LAST_LON = null;
var LAST_LAT = null;


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
            basemap: 'streets-vector'
        });

        let view = new MapView({
            container: 'div-map',
            map: map,
            center: [-118.243422, 34.051249],
            zoom: 11
        });

        window.view = view;

        // let tileLayer = new TileLayer({
        // };

        let featureLayer = new FeatureLayer({
            url: 'http://services1.arcgis.com/tp9wqSVX1AitKgjd/arcgis/rest/services/TEAMS_WORK_ORDER_POINTshp/FeatureServer/0',
        });
        map.add(featureLayer);

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
        let layerLADOT = makeDataLayer('/res/ladot.geojson', true, renderLADOT);
        map.add(layerLADOT);

        // onClick handler for map
        view.on("click", function(e) {
            let lon = (Math.floor(e.mapPoint.longitude * 1000000)/1000000);
            let lat = (Math.floor(e.mapPoint.latitude * 1000000)/1000000);

            if (LAST_LON == null || LAST_LAT == null) {
                LAST_LON = lon;
                LAST_LAT = lat;
                return;
            }

            let line = new Graphic({
                geometry: new Polyline({
                    type: "polyline",
                    paths: [[LAST_LON, LAST_LAT], [lon, lat]]
                }),
                symbol: new SimpleLineSymbol({
                    type: "simple-line",
                    color: "yellow",
                    width: "5px",
                    style: "solid"
                })
            });
            view.graphics.add(line);

            // Save last (lon, lat)
            LAST_LON = lon;
            LAST_LAT = lat;
        });
    }
);

