async function AdminLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('/Admin/AdminLogin', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.message === "LoginSuccess") {
            const homeresponse = await fetch('/Home/RedirectHome', {
                method: 'GET',
                credentials: 'include'
            });

            if (homeresponse.ok) {
                const loginhtml = await homeresponse.text();
                const wrapper = document.querySelector('.wrapper');
                wrapper.innerHTML = loginhtml;

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

                const headermobile = await fetch('/Home/UpdateHeadermobile', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (headermobile.ok) {
                    const headerHtmlmobile = await headermobile.text();
                    const headerElementmobile = document.querySelector('.header-mobile');
                    headerElementmobile.innerHTML = headerHtmlmobile;
                } else {
                    showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to update mobile header.');
                }

                const headerpc = await fetch('/Home/UpdateHeaderpc', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (headerpc.ok) {
                    const headerHtml = await headerpc.text();
                    const headerElement = document.querySelector('.header-pc');
                    headerElement.innerHTML = headerHtml;
                } else {
                    showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to update pc header.');
                }

                const homeattr5b4tesresponse = await fetch('/Home/HomeAttributes', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (homeattr5b4tesresponse.ok) {
                    const loginhtmls = await homeattr5b4tesresponse.text();
                    const wrappers = document.querySelector('.header-UI');
                    wrappers.innerHTML = loginhtmls;
                } else {
                    showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to update home attributes.');
                }

            } else {
                showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to load home page.');
            }
        } else if (result.message === "LoginFail") {
            alert('Login failed! Credentials do not match.');
        } else {
            alert('Unexpected response received.');
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

async function ShowReport(event) {
    event.preventDefault();

    // Fetch and display the main report view
    const LoginResponse = await fetch('/Admin/ShowReport', {
        method: 'GET',
        credentials: 'include'
    });

    if (LoginResponse.ok) {
        const LoginHtml = await LoginResponse.text();
        const wrapper = document.querySelector('.wrapper');
        wrapper.innerHTML = LoginHtml;

        // Fetch report data
        const DatabaseRecords = await fetch('/Admin/GetShowReport', {
            method: 'GET',
            credentials: 'include'
        });

        const DatabaseRecordsResult = await DatabaseRecords.json();
        if (DatabaseRecords.ok) {
            const reportTbody = document.getElementById('report-tbody');

            // Clear existing table rows
            reportTbody.innerHTML = '';

            // Loop through report records and create new rows with buttons
            DatabaseRecordsResult.forEach(report => {
                const row = document.createElement('tr');

                // Title Button Cell
                const titleCell = document.createElement('td');
                const titleButton = document.createElement('button');
                titleButton.classList.add('btn', 'btn-view');
                titleButton.innerHTML = '<i class="fas fa-eye"></i>';
                titleButton.addEventListener('click', () => {
                    document.getElementById('modalMessage').textContent = report.title;
                    document.getElementById('titleModal').style.display = 'block';
                });
                titleCell.appendChild(titleButton);
                row.appendChild(titleCell);

                // Description Button Cell
                const descCell = document.createElement('td');
                const descButton = document.createElement('button');
                descButton.classList.add('btn', 'btn-view');
                descButton.innerHTML = '<i class="fas fa-eye"></i>';
                descButton.addEventListener('click', () => {
                    document.getElementById('modalMessage').textContent = report.description;
                    document.getElementById('titleModal').style.display = 'block';
                });
                descCell.appendChild(descButton);
                row.appendChild(descCell);

                // Image/Video Button Cell
                const imageOrVideoCell = document.createElement('td');
                const imageOrVideoButton = document.createElement('button');
                imageOrVideoButton.classList.add('btn', 'btn-video');
                imageOrVideoButton.innerHTML = '<i class="fas fa-video"></i>'; // Change icon as needed

                imageOrVideoButton.addEventListener('click', () => {
                    const mediaUrl = report.vidpicproofath; // Assuming this is the URL to media

                    // Clear previous content
                    const modalMessage = document.getElementById('modalMessage');
                    modalMessage.innerHTML = ''; // Clear previous content

                    // Determine if the media URL is an image or video
                    if (mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') || mediaUrl.endsWith('.ogg')) {
                        // Create video element
                        const videoElement = document.createElement('video');
                        videoElement.src = mediaUrl;
                        videoElement.controls = true; // Show controls
                        videoElement.style.width = '100%'; // Make video responsive
                        modalMessage.appendChild(videoElement);
                    } else if (mediaUrl.endsWith('.jpg') || mediaUrl.endsWith('.jpeg') || mediaUrl.endsWith('.png') || mediaUrl.endsWith('.gif')) {
                        // Create image element
                        const imgElement = document.createElement('img');
                        imgElement.src = mediaUrl;
                        imgElement.style.width = '100%'; // Make image responsive
                        modalMessage.appendChild(imgElement);
                    } else {
                        // Handle unsupported media type
                        modalMessage.textContent = 'Unsupported media type.';
                    }

                    // Show the modal
                    document.getElementById('titleModal').style.display = 'block';
                });

                // Append the button to the cell
                imageOrVideoCell.appendChild(imageOrVideoButton);
                row.appendChild(imageOrVideoCell);


                // Review Button Cell Replacement
                const locationCell = document.createElement('td');
                const reviewTypeLabel = document.createElement('span'); // You can use 'label' if desired
                reviewTypeLabel.textContent = report.review_type; // Display the review_type directly as text
                locationCell.appendChild(reviewTypeLabel);
                row.appendChild(locationCell);

                // Approve/Delete Button Cell
                const actionCell = document.createElement('td');
                actionCell.classList.add('action-buttons');

                // Approve Button
                const approveButton = document.createElement('button');
                approveButton.classList.add('btn', 'btn-approve');
                approveButton.innerHTML = '<i class="fas fa-check"></i>';
                approveButton.addEventListener('click', async () => { // Declare as async
                    try {
                        // Fetch and display the main report view, passing the report ID as a query parameter
                        const response = await fetch(`/Admin/AprovedReport?id=${report.id}`, { // Use report.Id if that's the correct property
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json' // Optional, can be omitted for POST with query parameters
                            }
                        });

                        if (response.ok) {
                            
                            row.remove();
                            
                        } else {
                            console.error('Error approving report:', response.statusText);
                            alert('Error approving report. Please try again.');
                        }
                    } catch (error) {
                        console.error('Fetch error:', error);
                        alert('An error occurred. Please try again.');
                    }
                });
                actionCell.appendChild(approveButton);

                // Delete Button
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-delete');
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteButton.addEventListener('click', async () => {
                    try {
                        // Fetch and display the main report view, passing the report ID as a query parameter
                        const response = await fetch(`/Admin/DeleteReport?id=${report.id}`, {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json' // Optional, can be omitted for POST with query parameters
                            }
                        });

                        if (response.ok) {

                            row.remove();

                        } else {
                            console.error('Error deleting report:', response.statusText);
                            alert('Error deleting report. Please try again.');
                        }
                    } catch (error) {
                        console.error('Fetch error:', error);
                        alert('An error occurred. Please try again.');
                    }
                });
                actionCell.appendChild(deleteButton);

                row.appendChild(actionCell);

                // Append the row to the table body
                reportTbody.appendChild(row);
            });
        }
    }
}


                // Function to close the modal when the cross icon is clicked
    function closeModal() {
        document.getElementById('titleModal').style.display = 'none';
    }

    // Get the close icon element and add the event listener for closing the modal
    const closeIcon = document.querySelector('.close');
    closeIcon.addEventListener('click', closeModal);

    // Close the modal when the user clicks outside of the modal
    window.onclick = function (event) {
        const modal = document.getElementById('titleModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
}

function showMedia(mediaUrl) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = ''; // Clear previous content

    // Determine if it's an image or video based on the URL file extension
    const fileExtension = mediaUrl.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        // Create an image element
        const img = document.createElement('img');
        img.src = mediaUrl;
        img.alt = 'Media Image';
        img.style.maxWidth = '100%'; // Ensure the image fits within the modal
        modalContent.appendChild(img);
    } else if (['mp4', 'webm'].includes(fileExtension)) {
        // Create a video element
        const video = document.createElement('video');
        video.src = mediaUrl;
        video.controls = true;
        video.style.maxWidth = '100%'; // Ensure the video fits within the modal
        modalContent.appendChild(video);
    } else {
        modalContent.textContent = 'Unsupported media format';
    }
}

function closeModal() {
    $('#titleModal').fadeOut();  // Hide modal with animation
}
