class StationsMap {

    constructor () {

        this.center = new google.maps.LatLng(45.750000, 4.850000);
        this.map = new google.maps.Map(document.getElementById('mapBox'), {
            zoom: 12,
            center: this.center,
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            styles: [{"featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"color": "#444444"} ] }, {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#f2f2f2"} ] }, {"featureType": "poi", "elementType": "all", "stylers": [{"visibility": "off"} ] }, {"featureType": "road", "elementType": "all", "stylers": [{"saturation": -100 }, {"lightness": 45 } ] }, {"featureType": "road.highway", "elementType": "all", "stylers": [{"visibility": "simplified"} ] }, {"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{"visibility": "off"} ] }, {"featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"} ] }, {"featureType": "water", "elementType": "all", "stylers": [{"color": "#46bcec"}, {"visibility": "on"} ] } ]
        });

        // ===== JCDecaux API =====
        this.apiJCD = 'https://api.jcdecaux.com/vls/v1/';
        this.station = 'stations?';
        this.contract = 'contract=Lyon';
        this.apiKey = '&apiKey=255229fed34f3e1707d63fd88f489115575ef64b';

        this.getApiJCD();

    }

    getApiJCD() {
        $.ajax({url: this.apiJCD+this.station+this.contract+this.apiKey, success: (result) => { 
            this.treatData(result);
        }})
    }

    treatData(data) {

        let markers = [];
    
        for (var i in data) {

            var icon = {url: 'img/markerCluster/bikeStationIcon.png', scaledSize: new google.maps.Size(35, 35)};
            let marker = new google.maps.Marker({
                position: {lat: data[i].position.lat, lng: data[i].position.lng},
                icon: icon,
                title: data[i].name
            });
            marker.slot = i; // Adds slot in the marker object to get the reference later on
            markers.push(marker);
            markers[i].addListener('click', function(e) {

                stop();

                sideMenu.setStation = data[this.slot];

                let sepName = sideMenu.setStation.name.substr(sideMenu.setStation.name.search("- ")+2);
                sideMenu.name.text(sepName);
                sideMenu.address.text(sideMenu.setStation.address);

                if (sideMenu.setStation.status == 'OPEN') {
                    sideMenu.status.text('OUVERTE');
                    sideMenu.status.css('color', 'green');
                    sideMenu.standsFree.show();
                    sideMenu.bikeFree.show();
                    sideMenu.standsFree.text(sideMenu.setStation.available_bike_stands);
                    sideMenu.bikeFree.text(sideMenu.setStation.available_bikes);
                } else {
                    sideMenu.status.text('FERMEE');
                    sideMenu.status.css('color', 'rgb(225, 31, 38)');
                    sideMenu.standsFree.hide();
                    sideMenu.bikeFree.hide();
                }

                if (!sideMenu.isOpened()) { sideMenu.open() }

            });
            
        }
        let clusterStyles = [
            { url: 'img/markerCluster/small.png',
                textColor: 'white', textSize: 17, height: 30, width: 30 },
            { url: 'img/markerCluster/medium.png',
                textColor: 'white', textSize: 17, height: 45, width: 45 },
            { url: 'img/markerCluster/large.png',
                textColor: 'white', textSize: 17, height: 60, width: 60 }
        ];
        let mcOptions = {
            gridSize: 50,
            styles: clusterStyles,
            maxZoom: 15
        };
        let markerCluster = new MarkerClusterer(this.map, markers, mcOptions);

    }

}
