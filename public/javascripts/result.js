function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(51.5, -0.12),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function searchData(e){
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode != '13') {
        return;
    } 
    var textvalue = document.getElementById('searchBtn').value;
    if(textvalue == ""){
        alert("검색어를 입력해주세요.")
        return;
    }

    document.getElementsByClassName('loader')[0].style.display = 'block';

     
    var keyword = {};
    keyword.keyword = textvalue;

    $.ajax({    
        method: "POST",
        url: "/api",
        data: keyword,
        dataType: 'json',
        async: true
    }).done(function( data ) {
        if(JSON.stringify(data) == "{}"){
            alert("일치하는 결과가 없습니다.")
            document.getElementsByClassName('loader')[0].style.display = 'none';
            document.getElementById('searchBtn').value = ""
            return
        }
        localStorage.crimeData = JSON.stringify(data);
        window.location = "/result";
    });
}
