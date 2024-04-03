let map = L.map('map');
var is_map_sat = 1;

getLocation();

function getLocation() {
    

    map.locate({
        setView: true,
        enableHighAccuracy: true
    })
        .on('locationfound', function (e) {
            var marker = new L.marker(e.latlng);
            marker.addTo(map);
            var radius = e.accuracy;
            L.circle(e.latlng, radius).addTo(map);
        });
}

/* L.Control.MyControl = L.Control.extend({
    onAdd: function (map) {
        var el = L.DomUtil.create('div', 'leaflet-bar my-control');

        el.innerHTML = 'My Control';

        return el;
    },

    onRemove: function (map) {
        // Nothing to do here
    }
});

L.control.myControl = function (opts) {
    return new L.Control.MyControl(opts);
}

L.control.myControl({
    position: 'topright'
}).addTo(map);
 */
/* L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); */

//set up
var mapLink = '<a href="http://www.esri.com/">Esri</a>';
var wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

var baseline = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var satelite = L.tileLayer(
    'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; ' + mapLink + ', ' + wholink,
    maxZoom: 18,
});
map.addLayer(baseline);


L.Control.geocoder().addTo(map);

var routeControl = L.Routing.control({
    waypoints: [
        L.latLng(46.48195392047746, 30.725802494375056),
        L.latLng(46.48934111296114, 30.741681172148283)
    ],
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim()
}).addTo(map);


//change map button
document.getElementById('change_map_btn').onclick = function (e) {
    if (is_map_sat == 1) {
        map.removeLayer(satelite);
        map.addLayer(baseline);
        is_map_sat = 0;
        document.getElementById('change_map_btn').innerHTML = "Roadmap";
    }
    else if (is_map_sat == 0) {
        map.removeLayer(baseline);
        map.addLayer(satelite);
        is_map_sat = 1;
        document.getElementById('change_map_btn').innerHTML = "Satellite ESRI";
    }

}

//distance calc todo

let
    _firstLatLng, //holding first marker latitude and longitude
    _secondLatLng,//holding second marker latitude and longitude
    _polyline,    //holding polyline object
    merkerA = null,
    markerB = null;

map.on('click', function (e) {
    if (!_firstLatLng) {

        //get first point latitude and longitude
        _firstLatLng = e.latlng;

        //get first point layerpoint
        _firstPoint = e.layerPoint;

        //create first marker and add popup
        markerA = L.marker(_firstLatLng).addTo(map).bindPopup('Point A<br/>' + e.latlng + '<br/>' + e.layerPoint).openPopup();


    } else if (!_secondLatLng) {
        //get second point latitude and longitude
        _secondLatLng = e.latlng;

        //get second point layerpoint
        _secondPoint = e.layerPoint;

        //create second marker and add popup
        markerB = L.marker(_secondLatLng).addTo(map).bindPopup('Point B<br/>' + e.latlng + '<br/>' + e.layerPoint).openPopup();


        //draw a line between two points
        _polyline = L.polyline([_firstLatLng, _secondLatLng], {
            color: 'red'
        });

        //add the line to the map
        _polyline.addTo(map);

        //get the distance between two points
        let _length = map.distance(_firstLatLng, _secondLatLng);

        //display the result
        document.getElementById('length').innerHTML = _length;

    } else {

        //if already we have two points first we remove the polyline object
        if (_polyline) {
            map.removeLayer(_polyline);
            _polyline = null;
        }

        //get new point latitude and longitude
        _firstLatLng = e.latlng;

        //get new point layerpoint
        _firstPoint = e.layerPoint;

        //remove previous markers and values for second point
        map.removeLayer(markerA);
        map.removeLayer(markerB);
        _secondLatLng = null;
        _secondPoint = null;

        //create new marker and add it to map
        markerA = L.marker(_firstLatLng).addTo(map).bindPopup('Point A<br/>' + e.latlng + '<br/>' + e.layerPoint).openPopup();

    }
});


var routeArray = new Array();
routeArray = routeControl.getWaypoints();

document.getElementById("waypoint").innerHTML = String(routeArray[0].latLng.lat + " " + routeArray[0].latLng.lng);

alert(String(routeArray[0].latLng.lat + " " + routeArray[0].latLng.lng));


//popup
/* var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick); */


//OLD
/* let markers = [];

map.on('click', function(event) {
    addMarker(event.latlng);
});

function addMarker(location) {
    let marker = L.marker(location, {
        draggable: true
    }).addTo(map);

    markers.push(marker);

    if (markers.length >= 2) {
        calculateAndDisplayRoute();
    }
}

function calculateAndDisplayRoute() {
    let waypoints = [];
    markers.forEach(function(marker) {
        waypoints.push(marker.getLatLng());
    }); 

    control.setWaypoints(waypoints);
}
*/