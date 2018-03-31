function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(51.5, -0.12),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

$(document).keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        searchData();
    }
});

function searchData() {
    var textvalue = $("#searchBtn").value;

    var keyworld = {"keyworld" : textvalue};
    var myJSON = JSON.stringify(keyworld);

    $.ajax({
        method: "POST",
        url: "/api",
        data: myJSON,
        dataType: 'json',
        async: false,
        beforeSend: function (){
            jQuery('loading').show();
        }
    }).done(function( data ) {

        console.log("done");
    });
};