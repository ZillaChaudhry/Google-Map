var map;
var marker;
var reportMode = false;
var firstLocationSelected = false;
var firstMarker, secondMarker, polyline;

// Ensure DOM is fully loaded before executing script
document.addEventListener('DOMContentLoaded', function () {
    initializeMap();

    // Handle report button click
    const reportBtn = document.getElementById('report-btn');
    if (reportBtn) {
        reportBtn.addEventListener('click', function () {
            reportMode = true;
            firstLocationSelected = false;
            alert('Report mode enabled. Select two locations on the map or use the search box.');
        });
    }

    // Handle clean button click to remove selected locations
    const cleanBtn = document.getElementById('clean-btn');
    if (cleanBtn) {
        cleanBtn.addEventListener('click', function () {
            if (firstMarker) map.removeLayer(firstMarker);
            if (secondMarker) map.removeLayer(secondMarker);
            if (polyline) map.removeLayer(polyline);
            firstMarker = secondMarker = polyline = null;
            firstLocationSelected = false;
            reportMode = false;
            alert('Selected locations cleared.');
        });
    }

    // Geocoding search functionality
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            var location = document.getElementById('location-search').value;
            if (location) {
                var geocoder = L.Control.Geocoder.nominatim();
                geocoder.geocode(location, function (results) {
                    if (results && results.length > 0) {
                        var result = results[0];
                        var lat = result.center.lat;
                        var lon = result.center.lng;

                        if (reportMode) {
                            selectLocation(lat, lon);
                        } else {
                            if (marker) {
                                map.removeLayer(marker);
                            }
                            marker = L.marker([lat, lon]).addTo(map)
                                .bindPopup(result.name)
                                .openPopup();
                            map.setView([lat, lon], 13);
                        }
                    } else {
                        alert('Location not found');
                    }
                });
            } else {
                alert('Please enter a location');
            }
        });
    }
});

// Function to get current location using IP info API
async function getLocation() {
    try {
        const response = await fetch('https://ipinfo.io/json?token=7e1935ddf24e7e');
        const data = await response.json();
        const [lat, lon] = data.loc.split(',');
        return {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
        };
    } catch (error) {
        throw new Error('Failed to retrieve location from API');
    }
}

async function initializeMap() {
    try {
        const location = await getLocation();
        const { lat, lon } = location;

        map = L.map('map', {
            center: [lat, lon],
            zoom: 13,
            zoomControl: true,
            scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup('You are here!')
            .openPopup();

        // Ensure the map properly resizes
        setTimeout(function () {
            map.invalidateSize();  // Recalculates the map size
        }, 200);

        // Map click event to select locations
        map.on('click', function (e) {
            if (reportMode) {
                selectLocation(e.latlng.lat, e.latlng.lng);
            }
        });

    } catch (error) {
        alert(error);
    }
}

// Function to handle selecting locations
function selectLocation(lat, lon) {
    if (!firstLocationSelected) {
        if (firstMarker) {
            map.removeLayer(firstMarker);
        }
        firstMarker = L.marker([lat, lon]).addTo(map);
        firstLocationSelected = true;
        alert('First location selected! Select another location to complete.');
    } else if (firstMarker && !secondMarker) {
        secondMarker = L.marker([lat, lon]).addTo(map);
        polyline = L.polyline([firstMarker.getLatLng(), secondMarker.getLatLng()], { color: 'blue' }).addTo(map);
        alert('Your location is reported!');
        reportMode = false;
    }
}
