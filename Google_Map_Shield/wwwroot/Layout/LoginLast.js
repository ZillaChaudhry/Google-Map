async function LoginRedirect(event) {
    event.preventDefault();
    const LoginResponse = await fetch('/Login/Login', {
        method: 'GET',
        credentials: 'include'
    });

    if (LoginResponse.ok) {
        const LoginHtml = await LoginResponse.text();
        const wrapper = document.querySelector('.wrapper');
        wrapper.innerHTML = LoginHtml;

        initializeLoginPage();
    }
}

function initializeLoginPage() {
    // File upload label update
    const fileUploadInput = document.getElementById('file-upload');
    const fileUploadLabel = document.getElementById('file-upload-label');

    if (fileUploadInput) {
        fileUploadInput.addEventListener('change', function () {
            var fileName = this.files[0].name; // Get the selected file's name
            fileUploadLabel.textContent = fileName; // Update the label to show the file name
        });
    }

    // Form switch functionality
    const loginText = document.querySelector(".title-text .login");
    const loginForm = document.querySelector("form.login");
    const loginBtn = document.querySelector("label.login");
    const signupBtn = document.querySelector("label.signup");
    const signupLink = document.querySelector("form .signup-link a");
    const loginLink = document.querySelector(".login-link a");

    if (loginText && loginForm && loginBtn && signupBtn && signupLink && loginLink) {
        signupBtn.addEventListener('click', () => {
            loginForm.style.marginLeft = "-50%";
            loginText.style.marginLeft = "-50%";
        });

        loginBtn.addEventListener('click', () => {
            loginForm.style.marginLeft = "0%";
            loginText.style.marginLeft = "0%";
        });

        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupBtn.click();
        });

        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginBtn.click();
        });
    }
}




//Signup code
async function Signup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const signupButton = form.querySelector('input[type="submit"]');
    setButtonSignupState(signupButton, true);

    try {
        // Perform the signup request
        const response = await fetch('/Login/Signup', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            // Load verification page content
            const verificationResponse = await fetch('Login/Verification', {
                method: 'GET',
                credentials: 'include'
            });

            if (verificationResponse.ok) {
                const verificationHtml = await verificationResponse.text();
                console.log(verificationHtml); // Debug: Log the fetched HTML content
                document.querySelector('#LoginPage').innerHTML = verificationHtml;
            } else {
                showModal('fas fa-exclamation-circle fa-5x text-danger', "Failed to load verification page.");
            }
        } else {
            showModal('fas fa-exclamation-circle fa-5x text-danger', result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showModal('fas fa-exclamation-circle fa-5x text-danger', "An error occurred.");
    } finally {
        // Reset button state
        setButtonSignupState(signupButton, false);
    }
}

async function verification(event) {
    event.preventDefault();
    var code = document.getElementById("verificationCode").value;

    try {
        const response = await fetch('Login/Verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                EnterCode: code
            })
        });
        const result = await response.text();

        if (result == "Account Successfully Created") {
            showModal('fas fa-check-circle text-success', result);

            setTimeout(async () => {
                const loginResponse = await fetch('/Login/Login', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (loginResponse.ok) {
                    const loginHtml = await loginResponse.text();
                    const wrapper = document.querySelector('.wrapper');
                    wrapper.innerHTML = loginHtml;
                    initializeLoginPage();
                } else {
                   showModal('fas fa-exclamation-circle text-danger', "HTTP error: " + loginResponse.status);
                }
            }, 3000);

        } else if (result == "Sorry, the code does not match. Please try again.") {
            showModal('fas fa-exclamation-circle text-danger', result);
        } else if (result == "Error: Account creation failed") {
            showModal('fas fa-exclamation-circle text-danger', result);
        } else {
            showModal('fas fa-exclamation-circle text-danger', "HTTP error: " + response.status);
        }
    } catch (err) {
        showModal('fas fa-exclamation-circle text-danger', "An error occurred during verification.");
    }
}



async function ResendCode(event) {
    event.preventDefault();
    var email = document.getElementById('hiddenuserEmail').value;
    try {
        const response = await fetch('Login/ResendCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                email: email
            })
        });
        const result = await response.text();
        if (result == "Verification Code is Sent Successfully.") {
            showModal('fas fa-check-circle text-success', result);
        }
    } catch (error) {
        showModal('fas fa-exclamation-circle text-danger', "An error occurred during Resending Code.");
    }
}


// Login code
async function Login(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const LoginButton = form.querySelector('input[type="submit"]');
    setButtonLoadingState(LoginButton, true);

    try {
        const response = await fetch('/Login/LoginUser', {
            method: 'POST',
            body: formData
        });

        const result = await response.text();

        if (result === "Account Successfully Open") {
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




                // Ensure external scripts are loaded after the new content is injected
                loadScripts([
                    '/template_css/js/jquery.min.js',
                    '/template_css/js/bootstrap.bundle.min.js',
                    '/template_css/js/Headroom.js',
                    '/template_css/js/jQuery.headroom.js',
                    '/template_css/js/slick.min.js',
                    '/template_css/js/custom.js'
                ], () => {
                    // Initialize sliders after scripts are loaded and content is injected
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
                    showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to update pc header.');
                }

            } else {
                showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to load home page.');
            }
        } else {
            setButtonLoadingState(LoginButton, false);
            showModal('fas fa-exclamation-circle fa-5x text-danger', result);
        }
    } catch (error) {
        setButtonLoadingState(LoginButton, false);
        showModal('fas fa-exclamation-circle fa-5x text-danger', 'An error occurred during login. Please try again.');
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
//Load External Script End

// LogOut code
async function Logout(event) {
    event.preventDefault();
    try {
        const response = await fetch('/Login/Logout', {
            method: 'POST'
        });

        var result = await response.text();
        if (result == "Logout") {
            const homeresponse = await fetch('/Login/Login', {
                method: 'GET',
                credentials: 'include'
            });

            if (homeresponse.ok) {
                const loginhtml = await homeresponse.text();
                const wrapper = document.querySelector('.wrapper');
                wrapper.innerHTML = loginhtml;

                initializeLoginPage();
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

                }else {
                    showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to update pc header.');
                }

            }
        }
    } catch (err) {
        
    }
}

function setButtonLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.value = 'Loading...';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.value = 'Login';
        button.classList.remove('loading');
    }
}
async function updateProfiles(event) {
    event.preventDefault();
    const form = event.target;
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const oldPasswordError = document.getElementById('oldPasswordError');
    const newPasswordError = document.getElementById('newPasswordError');

    oldPasswordError.textContent = '';
    newPasswordError.textContent = '';

    // Validation
    if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
        if (!newPassword) {
            newPasswordError.textContent = 'Please enter a new password if the old password is provided.';
            document.getElementById('newPassword').classList.add('error-border');
        }
        if (!oldPassword) {
            oldPasswordError.textContent = 'Please enter the old password if the new password is provided.';
            document.getElementById('oldPassword').classList.add('error-border');
        }
        return;
    }

    const formData = new FormData(form);
    const ProfileUpdateButton = form.querySelector('input[type="submit"]');
    ProfileUpdateButtonstatus(ProfileUpdateButton, true);

    const response = await fetch('/Login/updateprofile', {
        method: 'POST',
        body: formData
    });

    const message = await response.text();

    if (response.ok) {
        if (message === "Old password does not match.") {
            showModal('fas fa-exclamation-circle fa-5x text-danger', message);
        } else if (message === "Profile updated successfully.") {
            showModal('fas fa-check-circle text-success', message);

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
            updateprofile();


        }
    } else {
        showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to update Profile.');
    }


    ProfileUpdateButtonstatus(ProfileUpdateButton, false);
}

async function updateprofile(event) {
    event.preventDefault();

    const LoginResponse = await fetch('/Login/updateprofilesync', {
        method: 'GET',
        credentials: 'include'
    });

    if (LoginResponse.ok) {
        const LoginHtml = await LoginResponse.text();
        const wrapper = document.querySelector('.wrapper');
        wrapper.innerHTML = LoginHtml;

        const profileResponse = await fetch('/Login/updateprofile', {
            method: 'GET',
            credentials: 'include'
        });
        const profileData = await profileResponse.json();
        if (profileResponse.ok && profileData) {
            document.getElementById('name').value = profileData.name;
            document.getElementById('Password').value = profileData.password;
            document.getElementById('profilePic').src = profileData.profilepic;
        }
        
        initializeProfilePage();
    }
}

function initializeProfilePage() {
    // Show image options modal
    document.getElementById('profilePic').addEventListener('click', showImageOptions);

    // Preview updated profile picture
    document.getElementById('profilePicUpload').addEventListener('change', previewProfilePic);

    // View image in a new tab
    document.getElementById('viewImageBtn').addEventListener('click', viewImage);
    document.getElementById('viewImageModal').addEventListener('click', Closepopup);
}

// Close both modals
function Closepopup() {
    $('#viewImageModal').modal('hide');
    $('#imageOptionsModal').modal('hide');
}

// Show image options modal
function showImageOptions() {
    var modalImage = document.getElementById('modalProfilePic');
    var profileImage = document.getElementById('profilePic');
    modalImage.src = profileImage.src; // Set modal image to current profile image
    $('#imageOptionsModal').modal('show'); // Show the image options modal
}

// View the image in a modal pop-up, auto-close, and ensure the image fits the modal
function viewImage() {
    var profileImage = document.getElementById('profilePic').src;
    var modalImage = document.getElementById('viewImageModalContent'); // Get the modal's image element
    modalImage.src = profileImage; // Set the src of the modal image to the profile image

    // Close the options modal and show the view modal
    $('#imageOptionsModal').modal('hide');
    $('#viewImageModal').modal('show');
}

// Preview the updated profile picture and show the file name
function previewProfilePic(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('profilePic');
        output.src = reader.result; // Set new profile image preview

        // Close the image options modal after upload
        $('#imageOptionsModal').modal('hide');

        // Display the file name below the image
        var fileName = event.target.files[0].name;
        document.getElementById('fileName').textContent = "Uploaded: " + fileName;
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Trigger the file input when clicking the "Upload New Picture" button
function uploadImage() {
    document.getElementById('profilePicUpload').click();
}


function SendingButton(button, isSending) {
    if (isSending) {
        button.textContent = 'Sending...'; 
        button.style.pointerEvents = 'none'; 
    } else {
        button.textContent = 'Resend Code';
        button.style.pointerEvents = 'auto';
    }
}
function ProfileUpdateButtons(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.value = 'Sending...';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.value = 'Enter';
        button.classList.remove('loading');
    }
}
function ProfileUpdateButtonstatus(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.value = 'Loading...';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.value = 'Update Profile';
        button.classList.remove('loading');
    }
}
function setButtonSignupState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.value = 'Loading...';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.value = 'Signup';
        button.classList.remove('loading');
    }
}

function showModal(iconClass, message) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.role = 'dialog';
    modal.style.zIndex = '1050'; // Ensure modal is on top

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div class="modal-content" style="
                border-radius: 12px; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                overflow: hidden; 
                background: linear-gradient(135deg, #fff, #f7f7f7); 
                position: relative;
            ">
                <div class="modal-header" style="
                    border-bottom: none; 
                    padding: 15px; 
                    background-color: #f8f9fa;
                    display: flex; 
                    align-items: center;
                    justify-content: space-between;
                ">
                    <span style="
                        font-weight: bold; 
                        color: #343a40;
                        font-size: 1rem;
                    ">Notification</span>
                    <button type="button" class="btn-close" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center" style="
                    padding: 20px;
                    color: #495057;
                ">
                    <i class="${iconClass}" style="
                        font-size: 2.5rem; 
                        color: #dc3545; 
                        animation: blinking 1.5s infinite;
                    "></i>
                    <p style="margin-top: 15px; font-size: 1rem;">${message}</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add keyframes for blinking effect dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes blinking {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Show the modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Handle the close button
    modal.querySelector('.btn-close').addEventListener('click', () => {
        bsModal.hide();
        // Remove the modal from the DOM after hiding
        setTimeout(() => {
            modal.remove();
            style.remove(); // Clean up the added style
        }, 300);
    });

    // Auto-close the modal after 3 seconds
    setTimeout(() => {
        bsModal.hide();
        // Remove the modal from the DOM after hiding
        setTimeout(() => {
            modal.remove();
            style.remove(); // Clean up the added style
        }, 300);
    }, 3000);
}

async function Forgotpasswordenteremail(event)
{
    event.preventDefault();
    const LoginResponse = await fetch('/Login/Forgotpasswordenteremail', {
        method: 'GET',
        credentials: 'include'
    });

    if (LoginResponse.ok) {
        const LoginHtml = await LoginResponse.text();
        const wrapper = document.querySelector('#LoginPage');
        wrapper.innerHTML = LoginHtml;


    }
}

async function Forgotpasswordentersendcode(event) {
    event.preventDefault();
    try {
        const form = event.target; // Get the form element
        const formData = new FormData(form); // Create FormData from form
        const ProfileUpdateButton = form.querySelector('input[type="submit"]');
        ProfileUpdateButtons(ProfileUpdateButton, true);

        const response = await fetch('/Login/Forgotpasswordentersendcode', {
            method: 'POST',
            body: formData
        });

        const message = await response.text(); // Get the response text

        if (response.ok) {
            if (message === "Verification code sent") {
                // Redirect to verification page after sending the code
                const loginResponse = await fetch('/Login/Forgotpasswordenteremailverification', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (loginResponse.ok) {
                    const loginHtml = await loginResponse.text();
                    const wrapper = document.querySelector('#forgotpasswordenteremailPage');
                    wrapper.innerHTML = loginHtml; // Display the verification page
                } else {
                    showModal('fas fa-exclamation-circle fa-5x text-danger', 'Error loading verification page.');
                }
            } else if (message === "Email not registered") {
                // Handle the case where the email is not registered
                showModal('fas fa-exclamation-circle fa-5x text-warning', 'Email not registered.');
            }
        } else {
            showModal('fas fa-exclamation-circle fa-5x text-danger', 'An error occurred. Please try again.');
        }
    } catch (err) {
        showModal('fas fa-exclamation-circle fa-5x text-danger', err.message);
    } finally {
        ProfileUpdateButtons(ProfileUpdateButton, false);
    }
}



async function EmailVerification(event) {
    event.preventDefault();

    // Ensure form is properly referenced
    const form = event.target; // Assuming the event target is the form
    const formData = new FormData(form);
    const ProfileUpdateButton = form.querySelector('input[type="submit"]');
    ProfileUpdateButton.disabled = true; // Disable the button

    try {
        const formresponse = await fetch('/Login/ForgotPasswordverificationmatching', {
            method: 'POST',
            body: formData
        });

        // Check if the response is OK and contains the expected message
        const responseText = await formresponse.text();
        if (formresponse.ok && responseText === "Email verified") {
            const loginResponse = await fetch('/Login/ForgotEmailcodeVerification', {
                method: 'GET',
                credentials: 'include'
            });

            if (loginResponse.ok) {
                const loginHtml = await loginResponse.text();
                const wrapper = document.querySelector('#VerificationPage');
                wrapper.innerHTML = loginHtml; // Display the verification page
            } else {
                showModal('fas fa-exclamation-circle fa-5x text-danger', 'Error loading verification page.');
            }
        } else {
            showModal('fas fa-exclamation-circle fa-5x text-danger', 'Error Code Does not Match.');
        }
    } catch (error) {
        showModal('fas fa-exclamation-circle fa-5x text-danger', 'An unexpected error occurred.');
    } finally {
        ProfileUpdateButton.disabled = false; // Re-enable the button
    }
}

async function ForgotResendCodes(event) {
    event.preventDefault();
    var submitButton = document.getElementById("ResendCodeid");
    SendingButton(submitButton, true);
    try {
        const fetchResend = await fetch('/Login/ForgotResendCode', {
            method: 'POST'
        });

        const responseText = await fetchResend.text(); // Get response text

        if (fetchResend.ok) {
            showModal('fas fa-check-circle text-success', responseText);
        } else {
            showModal('fas fa-exclamation-circle fa-5x text-danger', responseText);
        }
    } catch (error) {
        showModal('fas fa-exclamation-circle fa-5x text-danger', 'An unexpected error occurred.');
    } finally {
        SendingButton(submitButton, false); // Re-enable the button after the request is completed
    }
}

async function ForgotPasswordUpdated(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Get values from form
    const newpass = formData.get("newPassword");
    const conpass = formData.get("oldPassword");

    // Client-side validation for passwords
    if (newpass === "" || conpass === "") {
        showModal('fas fa-exclamation-circle fa-5x text-danger', 'Passwords cannot be empty.');
        return;
    }

    if (newpass !== conpass) {
        showModal('fas fa-exclamation-circle fa-5x text-danger', 'Passwords do not match.');
        return;
    }

    try {
        // Send POST request to update the password
        const response = await fetch("/Login/UpdateForgotPasswords", {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const responseText = await response.text();

            showModal('fas fa-check-circle text-success', responseText);

            // After a successful password update, load the login page after a delay
            setTimeout(async () => {
                const loginResponse = await fetch('/Login/Login', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (loginResponse.ok) {
                    const loginHtml = await loginResponse.text();
                    const wrapper = document.querySelector('.wrapper');
                    wrapper.innerHTML = loginHtml;

                    // Initialize login page
                    initializeLoginPage();
                } else {
                    showModal('fas fa-exclamation-circle fa-5x text-danger', 'Failed to load login page.');
                }
            }, 3000);
        } else {
            const errorText = await response.text();
            showModal('fas fa-exclamation-circle fa-5x text-danger', errorText);
        }
    } catch (error) {
        showModal('fas fa-exclamation-circle fa-5x text-danger', 'An error occurred while updating the password.');
    }
}



