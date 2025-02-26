async function HomeRedirect(event) {
    event.preventDefault();

    try {
        const LoginResponse = await fetch('/Home/RedirectHome', {
            method: 'GET',
            credentials: 'include'
        });

        if (LoginResponse.ok) {
            //Load HTML
            const LoginHtml = await LoginResponse.text();
            const wrapper = document.querySelector('.wrapper');
            wrapper.innerHTML = LoginHtml;
            //Load javascript
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
                initializeMap();
            };
            document.body.appendChild(script);


            loadScripts([
                '/template_css/js/jquery.min.js',
                '/template_css/js/bootstrap.bundle.min.js',
                '/template_css/js/Headroom.js',
                '/template_css/js/jQuery.headroom.js',
                '/template_css/js/slick.min.js',
                '/template_css/js/custom.js'
            ], () => {
                Homesliderjs();
            });
        }
    } catch (error) {
        console.error('Failed to load home page:', error);
    }
}

//Load External Script Start
function loadScripts(scripts, callback) {
    let loadedScripts = 0;
    const totalScripts = scripts.length;

    function onScriptLoad() {
        loadedScripts++;
        if (loadedScripts === totalScripts) {
            if (typeof callback === 'function') callback();
        }
    }

    scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onScriptLoad;
        script.onerror = () => console.error(`Failed to load script: ${src}`);
        document.head.appendChild(script);
    });
}
function Homesliderjs() {
    $('.slick-slideshow').slick({
        autoplay: true,
        infinite: true,
        arrows: false,
        fade: true,
        dots: true,
    });

    $('.slick-testimonial').slick({
        arrows: false,
        dots: true,
    });
}

function toggleNavbar() {
    var navbar = document.getElementById("navbarNav");
    // Toggle between adding/removing 'show' class for expanding/collapsing
    if (navbar.classList.contains("show")) {
        // If already expanded, collapse it
        navbar.classList.remove("show");
    } else {
        // If collapsed, expand it
        navbar.classList.add("show");
    }
}


async function ReportPage(event) {
    event.preventDefault();
    try {
        const LoginResponse = await fetch('/Home/ReportPage', {
            method: 'GET',
            credentials: 'include'
        });

        if (LoginResponse.ok) {
            const LoginHtml = await LoginResponse.text();
            const wrapper = document.querySelector('.wrapper');
            wrapper.innerHTML = LoginHtml;

            // Initialize page scripts and map
            initializeReportPageScripts();
            initializeMap(); // Initialize the map after the HTML is loaded

        } else {
            console.error('Failed to load the report page.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}



function initializeReportPageScripts() {
    const fileInput = document.getElementById('prooffile');
    const fileNameDisplay = document.getElementById('file-name');

    if (fileInput) {
        fileInput.addEventListener('change', showFileName);
    } else {
        console.error('File input element not found.');
    }
    if (fileNameDisplay) {
        fileNameDisplay.style.display = 'flex'; // Ensure it’s visible and centered
    } else {
        console.error('File name display element not found.');
    }

    // Ensure that event listeners for map functionality are initialized
    if (document.getElementById('report-btn')) {
        document.getElementById('report-btn').addEventListener('click', function () {
            reportMode = true;
            firstLocationSelected = false; // Reset location selection state
            
            showPopup('Success!', 'Report mode enabled. Select two locations on the map or use the search box.', 'correct');

        });
    }

    if (document.getElementById('clean-btn')) {
        document.getElementById('clean-btn').addEventListener('click', function () {
            if (firstMarker) map.removeLayer(firstMarker);
            if (secondMarker) map.removeLayer(secondMarker);
            if (polyline) map.removeLayer(polyline);
            firstMarker = secondMarker = polyline = null;
            firstLocationSelected = false;
            reportMode = false;
    
            showPopup('Success!', 'Selected locations cleared.', 'correct');


        });
    }



    if (document.getElementById('search-btn')) {
        document.getElementById('search-btn').addEventListener('click', function () {
            var location = document.getElementById('location-search').value;
            if (location) {
                var geocoder = L.Control.Geocoder.nominatim();
                geocoder.geocode(location, function (results) {
                    if (results && results.length > 0) {
                        var result = results[0];
                        var lat = result.center.lat;
                        var lon = result.center.lng;

                        if (reportMode) {
                            selectLocation(lat, lon); // Reuse the location selection logic
                        } else {
                            // Regular search behavior
                            if (marker) {
                                map.removeLayer(marker);
                            }
                            marker = L.marker([lat, lon]).addTo(map)
                                .bindPopup(result.name)
                                .openPopup();
                            map.setView([lat, lon], 13);
                        }
                    } else {
                        showPopup('Error!', 'Location not found', 'incorrect');
                    }
                });
            } else {
                showPopup('Error!', 'Please enter a location', 'incorrect');
            }
        });
    }
}

function showFileName() {
    const fileInput = document.getElementById('vidpicproof'); // Corrected ID
    const fileNameDisplay = document.getElementById('file-name');

    if (fileInput && fileNameDisplay) {
        if (fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            fileNameDisplay.textContent = fileName;
        } else {
            fileNameDisplay.textContent = "Submit your proof (video or image - optional)";
        }
    } else {
        console.error('File input or file name display element not found.');
    }
}


var map;
var marker;
var reportMode = false;
var firstLocationSelected = false;
var firstMarker, secondMarker, polyline;
var originalMarker; // To store the original location marker

// Get current location using IP info API
function getLocation() {
    return new Promise((resolve, reject) => {
        $.get('https://ipinfo.io/json?token=7e1935ddf24e7e', (response) => {
            const [lat, lon] = response.loc.split(',');
            resolve({
                lat: parseFloat(lat),
                lon: parseFloat(lon),
            });
        }).fail(() => {
            reject('Failed to retrieve location from API');
        });
    });
}

// Initialize the map with the user's location
async function initializeMap() {
    try {
        const location = await getLocation();
        const { lat, lon } = location;

        map = L.map('map').setView([lat, lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        originalMarker = L.marker([lat, lon]).addTo(map)
            .bindPopup('You are here!')
            .openPopup();

        // Map click event to select locations
        map.on('click', function (e) {
            if (reportMode) {
                selectLocation(e.latlng.lat, e.latlng.lng);
            }
        });

        // Ensure map resizes properly when the window is resized
        window.addEventListener('resize', () => {
            map.invalidateSize(); // Invalidate the map size to recalculate its dimensions
        });

    } catch (error) {
        //alert(error);
    }
}
function selectLocation(lat, lon) {
    if (!firstLocationSelected) {
        if (firstMarker) {
            map.removeLayer(firstMarker);
        }
        firstMarker = L.marker([lat, lon]).addTo(map);
        // Store the first location in hidden fields
        document.getElementById('fromlongitude').value = lon;
        document.getElementById('fromlatitude').value = lat;
        firstLocationSelected = true;
        showPopup('Success!', 'First location selected! Select another location to complete.', 'correct');
    } else if (firstMarker && !secondMarker) {
        secondMarker = L.marker([lat, lon]).addTo(map);
        polyline = L.polyline([firstMarker.getLatLng(), secondMarker.getLatLng()], { color: 'blue' }).addTo(map);
        // Store the second location in hidden fields
        document.getElementById('tolongitude').value = lon;
        document.getElementById('tolatitude').value = lat;
        showPopup('Success!', 'Your location is reported!', 'correct');
        reportMode = false; // Disable report mode after selection
        // Remove the original marker permanently until "Clear" button is clicked
        if (originalMarker) {
            map.removeLayer(originalMarker); // Hide the original marker
        }
    }
}

// Function to display the user's current location when clicking "My Location"
async function showMyLocation() {
    try {
        const location = await getLocation();
        const { lat, lon } = location;

        // If there's an existing marker, remove it
        if (marker) {
            map.removeLayer(marker);
        }

        // Add a new marker for the user's current location and center the map
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup('You are here!')
            .openPopup();

        map.setView([lat, lon], 13); // Center the map on the user's location

    } catch (error) {
        showPopup('Error!', 'Failed to retrieve your location', 'incorrect');
    }
}
function initializeReportPageScripts() {
    const fileInput = document.getElementById('prooffile');
    const fileNameDisplay = document.getElementById('file-name');

    if (fileInput) {
        fileInput.addEventListener('change', showFileName);
    } else {
        console.error('File input element not found.');
    }
    if (fileNameDisplay) {
        fileNameDisplay.style.display = 'flex'; // Ensure it’s visible and centered
    } else {
        console.error('File name display element not found.');
    }

    // Ensure that event listeners for map functionality are initialized
    if (document.getElementById('report-btn')) {
        document.getElementById('report-btn').addEventListener('click', function () {
            reportMode = true;
            firstLocationSelected = false; // Reset location selection state

            // Clear all map elements (markers, polyline) when entering report mode
            if (firstMarker) map.removeLayer(firstMarker);
            if (secondMarker) map.removeLayer(secondMarker);
            if (polyline) map.removeLayer(polyline);
            if (marker) map.removeLayer(marker);  // Clear current location marker
            firstMarker = secondMarker = polyline = marker = null; // Reset variables

            // Clear hidden fields
            document.getElementById('fromlongitude').value = '';
            document.getElementById('fromlatitude').value = '';
            document.getElementById('tolongitude').value = '';
            document.getElementById('tolatitude').value = '';

            // Hide the original marker until "Clear" button is clicked
            if (originalMarker) {
                map.removeLayer(originalMarker);
            }

            showPopup('Success!', 'Report mode enabled. Select two locations on the map or use the search box.', 'correct');

        });
    }

    if (document.getElementById('clean-btn')) {
        document.getElementById('clean-btn').addEventListener('click', function () {
            if (firstMarker) map.removeLayer(firstMarker);
            if (secondMarker) map.removeLayer(secondMarker);
            if (polyline) map.removeLayer(polyline);
            firstMarker = secondMarker = polyline = null;
            firstLocationSelected = false;
            reportMode = false;
            // Clear hidden fields
            document.getElementById('fromlongitude').value = '';
            document.getElementById('fromlatitude').value = '';
            document.getElementById('tolongitude').value = '';
            document.getElementById('tolatitude').value = '';
            // Show the original marker again when clearing
            if (originalMarker) {
                originalMarker.addTo(map); // Show the original marker
            }
            
            showPopup('Success!', 'Selected locations cleared.', 'correct');

        });
    }

    // Search functionality
    if (document.getElementById('search-icon')) {
        document.getElementById('search-icon').addEventListener('click', function () {
            var location = document.getElementById('location-search').value;
            if (location) {
                var geocoder = L.Control.Geocoder.nominatim();
                geocoder.geocode(location, function (results) {
                    if (results && results.length > 0) {
                        var result = results[0];
                        var lat = result.center.lat;
                        var lon = result.center.lng;

                        if (reportMode) {
                            selectLocation(lat, lon); // Reuse the location selection logic
                        } else {
                            // Regular search behavior
                            if (marker) {
                                map.removeLayer(marker);
                            }
                            marker = L.marker([lat, lon]).addTo(map)
                                .bindPopup(result.name)
                                .openPopup();
                            map.setView([lat, lon], 13);
                        }
                    } else {
                        showPopup('Error!', 'Location not found', 'incorrect');
                    }
                });
            } else {
                showPopup('Error!', 'Please enter a location', 'incorrect');
            }
        });
    }

    document.getElementById('my-location').addEventListener('click', async function (e) {
        e.preventDefault();
        try {
            const location = await getLocation();
            const { lat, lon } = location;
            map.setView([lat, lon], 13);
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([lat, lon]).addTo(map)
                .bindPopup('You are here!')
                .openPopup();
        } catch (error) {
            showPopup('Error!', 'Could not get your location: ' + error, 'incorrect');
        }
    });
}

// Function to display error messages
function displayErrorMessage(element, message) {
    let errorElement = document.getElementById(`${element.id}-error`);
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = `${element.id}-error`;
        errorElement.className = 'error-message';
        errorElement.style.color = 'red'; // Set the error text color to red
        errorElement.style.marginTop = '5px'; // Adjust margin for better spacing
        element.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Function to clear previous error messages
function clearErrorMessages() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// Function to handle form validation and submission
async function GetReport(event) {
    event.preventDefault(); // Prevent form submission

    const form = event.target;
    const formdata = new FormData(form);

    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const reviewType = document.querySelector('input[name="review_type"]:checked');

    // Latitude and Longitude Values
    const fromLatitude = document.getElementById('fromlatitude').value.trim();
    const fromLongitude = document.getElementById('fromlongitude').value.trim();
    const toLatitude = document.getElementById('tolatitude').value.trim();
    const toLongitude = document.getElementById('tolongitude').value.trim();

    let isValid = true;
    let missingFields = [];

    clearErrorMessages();

    if (!title.value.trim()) {
        isValid = false;
        missingFields.push("Title");
    }

    if (!fromLatitude || !fromLongitude || !toLatitude || !toLongitude) {
        isValid = false;
        missingFields.push("Location is not selected.");
    }

    if (!description.value.trim()) {
        isValid = false;
        missingFields.push("Description is required.");
    }
    if (!reviewType) {
        isValid = false;
        missingFields.push("Review type is required.");
    }
    if (!isValid) {
        showPopup('Error!', `${missingFields.join(', ')}`, 'incorrect');
        return;
    }

    try {
        const response = await fetch('/Home/GetReport', {
            method: 'POST',
            body: formdata
        });

        const result = await response.json();

        if (result.success) {
            if (result.message == 'Report inserted successfully') {
                showPopup('Success!', result.message, 'correct');
                form.reset();
            } else {
                showPopup('Error!', result.message, 'incorrect');
            }
        } else {
            showPopup('Error!', 'Something went wrong. Please try again.', 'incorrect');
        }
    } catch (error) {
        showPopup('Error!', 'An error occurred while submitting the report. Please try again.', 'incorrect'); 
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeMap();
    initializeReportPageScripts();
});

function showPopup(title, message, iconType) {
    // Create the popup container
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '300px';
    popup.style.color = 'white'; // White text for better contrast
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    popup.style.padding = '20px';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '1000';
    popup.style.borderRadius = '10px'; // Rounded corners

    // Set background color based on icon type
    if (iconType === 'correct') {
        popup.style.backgroundColor = 'green'; // Green for correct
    } else if (iconType === 'incorrect') {
        popup.style.backgroundColor = 'red'; // Red for incorrect
    }

    // Title
    const titleElement = document.createElement('div');
    titleElement.style.fontSize = '18px';
    titleElement.style.marginBottom = '10px';
    titleElement.style.fontWeight = 'bold';
    titleElement.textContent = title;
    popup.appendChild(titleElement);

    // Icon
    const iconElement = document.createElement('div');
    iconElement.style.fontSize = '40px';
    iconElement.style.marginBottom = '10px';
    iconElement.style.fontWeight = 'bold'; // Bold icon
    iconElement.style.color = 'white'; // White icon for better contrast

    if (iconType === 'correct') {
        iconElement.textContent = '✔';  // Correct icon (checkmark)
    } else if (iconType === 'incorrect') {
        iconElement.textContent = '✖';  // Incorrect icon (cross)
    }
    popup.appendChild(iconElement);

    // Message
    const messageElement = document.createElement('div');
    messageElement.style.fontSize = '16px';
    messageElement.style.marginBottom = '10px';
    messageElement.textContent = message;
    popup.appendChild(messageElement);

    // Add the popup to the body
    document.body.appendChild(popup);

    // Auto close the popup after 2 seconds (2000 milliseconds)
    setTimeout(function () {
        document.body.removeChild(popup); // Remove the popup after 2 seconds
    }, 2000);
}



