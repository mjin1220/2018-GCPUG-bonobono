function initMap() {
    var center_of_chicago = {lat: 41.881832, lng:  -87.623177};
    var chicago_university = {lat:41.869358, lng:-87.670521};

    var markers = [center_of_chicago, chicago_university];

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: center_of_chicago
    });

    for (i = 0; i < markers.length; i++) {
        marker = new google.maps.Marker({
            position: markers[i],
            map: map
        });
    }
}