var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data) {
    createFeatures(data.features);
});

function getColor(d) {

    if (d < 1) {
        return 'rgb(0, 255, 0)'
    } else if (d < 2) {
        return 'rgb(255, 255, 102)'
    } else if (d < 3) {
        return 'rgb(255, 102, 0)'
    } else if (d < 4) {
        return 'rgb(255, 0, 0)'
    } else {
        return 'rgb(128, 0, 0)'
    }
}
function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3 align='center'>" + feature.properties.place +
            "</h3><hr><p><u>Occurrence:</u> " + new Date(feature.properties.time) + "</p>" +
            "</h3><p><u>Magnitude:</u> " + feature.properties.mag + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var geojsonMarkerOptions = {
            radius: 4*feature.properties.mag,
            fillColor: getColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });
    
    createMap(earthquakes);
}

function createMap(earthquakes) {

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: "pk.eyJ1Ijoic2FoYWhhaGEiLCJhIjoiY2sycnB1bW03MHNlbzNwcWUxM3Brbno2cSJ9.aU7skKXnUJ_oy4U0HmmdMg"
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: "pk.eyJ1Ijoic2FoYWhhaGEiLCJhIjoiY2sycnB1bW03MHNlbzNwcWUxM3Brbno2cSJ9.aU7skKXnUJ_oy4U0HmmdMg"
    });
 
    var baseMaps = {
        "Outdoors": outdoors,
        "Light Map": lightmap 
    };
    
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var map = L.map("map", {
        center: [39.83, -98.58],
        zoom: 4.5,
        layers: [outdoors, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false})
             .addTo(map);

    var legend = L.control({position: 'bottomright'});
  
    legend.onAdd = function (map) {    
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4],
        labels = [];
  
        div.innerHTML+='Magnitude Legend<br><hr>'
    
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(map);
}