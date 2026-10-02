// =====================================================
// CURAMATRIX LOGIN + FORGOT PASSWORD
// =====================================================


// =====================================================
// API URLS
// =====================================================

const API_BASE_URL =
    (
        window.location.protocol === "file:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
    )
        ? "http://localhost:5000/api/auth"
        : "https://curamatrix-backend.onrender.com/api/auth";

const LOGIN_API =
    `${API_BASE_URL}/login`;

const FORGOT_PASSWORD_API =
    `${API_BASE_URL}/forgot-password`;

const VERIFY_OTP_API =
    `${API_BASE_URL}/verify-reset-otp`;

const RESET_PASSWORD_API =
    `${API_BASE_URL}/reset-password`;


// =====================================================
// GET LOGIN ELEMENTS
// =====================================================

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const rememberCheckbox =
    document.getElementById("rememberMe");

const togglePassword =
    document.getElementById("togglePassword");

const forgotPassword =
    document.getElementById("forgotPassword");

const message =
    document.getElementById("loginMessage");


// =====================================================
// GET FORGOT PASSWORD ELEMENTS
// =====================================================

const forgotPasswordModal =
    document.getElementById("forgotPasswordModal");

const closeForgotPassword =
    document.getElementById("closeForgotPassword");

const forgotStep1 =
    document.getElementById("forgotStep1");

const forgotStep2 =
    document.getElementById("forgotStep2");

const forgotStep3 =
    document.getElementById("forgotStep3");

const forgotStepSuccess =
    document.getElementById("forgotStepSuccess");


const forgotUsername =
    document.getElementById("forgotUsername");

const forgotEmail =
    document.getElementById("forgotEmail");

const forgotMessage =
    document.getElementById("forgotMessage");

const sendOtpBtn =
    document.getElementById("sendOtpBtn");


const resetOtp =
    document.getElementById("resetOtp");

const otpMessage =
    document.getElementById("otpMessage");

const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");

const resendOtpBtn =
    document.getElementById("resendOtpBtn");


const newPassword =
    document.getElementById("newPassword");

const toggleNewPassword =
    document.getElementById("toggleNewPassword");

const confirmNewPassword =
    document.getElementById("confirmNewPassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

const newPasswordMessage =
    document.getElementById("newPasswordMessage");

const resetPasswordBtn =
    document.getElementById("resetPasswordBtn");


const backToLoginBtn =
    document.getElementById("backToLoginBtn");


// =====================================================
// RESET PASSWORD FLOW DATA
// =====================================================

let resetUsername = "";

let resetEmail = "";

let resetToken = "";


// =====================================================
// LOAD REMEMBERED USERNAME
// =====================================================

const savedUsername =
    localStorage.getItem(
        "curaMatrixRememberedUsername"
    );

if (
    savedUsername &&
    usernameInput &&
    rememberCheckbox
) {

    usernameInput.value =
        savedUsername;

    rememberCheckbox.checked =
        true;
}


// =====================================================
// SHOW / HIDE LOGIN PASSWORD
// =====================================================

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "🙈";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "◉";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }

        }
    );
}


// =====================================================
// LOGIN
// =====================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                usernameInput.value.trim();

            const password =
                passwordInput.value;
            
            const loginRole =
                 document.getElementById("loginRole");

            const role =
                loginRole ? loginRole.value : "";    


            // -------------------------------------------------
            // CLEAR PREVIOUS MESSAGE
            // -------------------------------------------------

            message.textContent = "";

            message.className =
                "login-message";


            // -------------------------------------------------
            // CHECK EMPTY FIELDS
            // -------------------------------------------------
            if (role === "") {

                 message.textContent =
                  "Please select your role.";

                  message.className =
                "login-message error";

                return;
            }
            if (
                username === "" ||
                password === ""
            ) {

                message.textContent =
                    "Please enter username and password.";

                message.className =
                    "login-message error";

                return;
            }


            // -------------------------------------------------
            // REMEMBER USERNAME
            // -------------------------------------------------

            if (
                rememberCheckbox &&
                rememberCheckbox.checked
            ) {

                localStorage.setItem(
                    "curaMatrixRememberedUsername",
                    username
                );

            } else {

                localStorage.removeItem(
                    "curaMatrixRememberedUsername"
                );
            }


            // -------------------------------------------------
            // LOGIN BUTTON
            // -------------------------------------------------

            const loginButton =
                loginForm.querySelector(
                    ".login-button"
                );

            const originalButtonText =
                loginButton.innerHTML;

            loginButton.disabled = true;

            loginButton.innerHTML =
                "Logging in...";


            try {

                // -------------------------------------------------
                // SEND LOGIN REQUEST
                // -------------------------------------------------

                const response =
                    await fetch(
                        LOGIN_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                            username:
                                    username,

                            password:
                                    password,

                            role:
                                 role
                            })
                        }
                    );


                const data =
                    await response.json();


                // -------------------------------------------------
                // LOGIN FAILED
                // -------------------------------------------------

                if (
                    !response.ok ||
                    !data.success
                ) {

                    message.textContent =
                        data.message ||
                        "Invalid username or password.";

                    message.className =
                        "login-message error";

                    loginButton.disabled =
                        false;

                    loginButton.innerHTML =
                        originalButtonText;

                    return;
                }


                // -------------------------------------------------
                // SAVE LOGIN SESSION
                // -------------------------------------------------

                localStorage.setItem(
                    "curaMatrixLoggedIn",
                    "true"
                );


                localStorage.setItem(
                    "curaMatrixToken",
                    data.token
                );


                localStorage.setItem(
                    "curaMatrixUser",
                    JSON.stringify(
                        data.user
                    )
                );


                // -------------------------------------------------
                // SUCCESS MESSAGE
                // -------------------------------------------------

                message.textContent =
                    "Login successful! Redirecting...";

                message.className =
                    "login-message success";


                // -------------------------------------------------
                // REDIRECT TO DASHBOARD
                // -------------------------------------------------

                setTimeout(
                    function () {

                        window.location.replace(
                            "dashboard/dashboard.html"
                        );

                    },
                    500
                );

            }

            catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                message.textContent =
                    "Unable to connect to the server.";

                message.className =
                    "login-message error";

                loginButton.disabled =
                    false;

                loginButton.innerHTML =
                    originalButtonText;
            }

        }
    );
}


// =====================================================
// FORGOT PASSWORD - OPEN MODAL
// =====================================================

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openForgotPasswordModal();

        }
    );
}


// =====================================================
// OPEN FORGOT PASSWORD MODAL
// =====================================================

function openForgotPasswordModal() {

    if (!forgotPasswordModal) {
        return;
    }


    // -------------------------------------------------
    // RESET FLOW
    // -------------------------------------------------

    resetUsername = "";

    resetEmail = "";

    resetToken = "";


    // -------------------------------------------------
    // RESET INPUTS
    // -------------------------------------------------

    if (forgotUsername) {
        forgotUsername.value =
            usernameInput
                ? usernameInput.value.trim()
                : "";
    }

    if (forgotEmail) {
        forgotEmail.value = "";
    }

    if (resetOtp) {
        resetOtp.value = "";
    }

    if (newPassword) {
        newPassword.value = "";
    }

    if (confirmNewPassword) {
        confirmNewPassword.value = "";
    }


    // -------------------------------------------------
    // RESET MESSAGES
    // -------------------------------------------------

    clearForgotMessages();


    // -------------------------------------------------
    // SHOW STEP 1
    // -------------------------------------------------

    showForgotStep(
        forgotStep1
    );


    // -------------------------------------------------
    // SHOW MODAL
    // -------------------------------------------------

    forgotPasswordModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    // -------------------------------------------------
    // FOCUS USERNAME
    // -------------------------------------------------

    setTimeout(
        function () {

            if (forgotUsername) {
                forgotUsername.focus();
            }

        },
        100
    );
}


// =====================================================
// CLOSE FORGOT PASSWORD MODAL
// =====================================================

function closeForgotModal() {

    if (!forgotPasswordModal) {
        return;
    }

    forgotPasswordModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";
}


if (closeForgotPassword) {

    closeForgotPassword.addEventListener(
        "click",
        function () {

            closeForgotModal();

        }
    );
}


// =====================================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// =====================================================

if (forgotPasswordModal) {

    forgotPasswordModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                forgotPasswordModal
            ) {

                closeForgotModal();

            }

        }
    );
}


// =====================================================
// ESC KEY CLOSE
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            forgotPasswordModal &&
            forgotPasswordModal.classList.contains(
                "active"
            )
        ) {

            closeForgotModal();

        }

    }
);


// =====================================================
// SHOW FORGOT PASSWORD STEP
// =====================================================

function showForgotStep(step) {

    const steps = [
        forgotStep1,
        forgotStep2,
        forgotStep3,
        forgotStepSuccess
    ];

    steps.forEach(
        function (currentStep) {

            if (currentStep) {

                currentStep.classList.remove(
                    "active"
                );

            }

        }
    );


    if (step) {

        step.classList.add(
            "active"
        );

    }
}


// =====================================================
// CLEAR FORGOT PASSWORD MESSAGES
// =====================================================

function clearForgotMessages() {

    if (forgotMessage) {

        forgotMessage.textContent = "";

        forgotMessage.className =
            "forgot-message";

    }

    if (otpMessage) {

        otpMessage.textContent = "";

        otpMessage.className =
            "forgot-message";

    }

    if (newPasswordMessage) {

        newPasswordMessage.textContent = "";

        newPasswordMessage.className =
            "forgot-message";

    }
}


// =====================================================
// SEND OTP
// =====================================================

if (sendOtpBtn) {

    sendOtpBtn.addEventListener(
        "click",
        async function () {

            const username =
                forgotUsername
                    ? forgotUsername.value.trim()
                    : "";

            const email =
                forgotEmail
                    ? forgotEmail.value.trim()
                    : "";


            // -------------------------------------------------
            // CLEAR MESSAGE
            // -------------------------------------------------

            if (forgotMessage) {

                forgotMessage.textContent =
                    "";

                forgotMessage.className =
                    "forgot-message";

            }


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (!username) {

                showForgotMessage(
                    forgotMessage,
                    "Please enter your registered username.",
                    "error"
                );

                if (forgotUsername) {
                    forgotUsername.focus();
                }

                return;
            }


            if (!email) {

                showForgotMessage(
                    forgotMessage,
                    "Please enter your registered email.",
                    "error"
                );

                if (forgotEmail) {
                    forgotEmail.focus();
                }

                return;
            }


            if (!isValidEmail(email)) {

                showForgotMessage(
                    forgotMessage,
                    "Please enter a valid email address.",
                    "error"
                );

                if (forgotEmail) {
                    forgotEmail.focus();
                }

                return;
            }


            // -------------------------------------------------
            // DISABLE BUTTON
            // -------------------------------------------------

            const originalText =
                sendOtpBtn.textContent;

            sendOtpBtn.disabled = true;

            sendOtpBtn.textContent =
                "Sending OTP...";


            try {

                // -------------------------------------------------
                // SEND OTP REQUEST
                // -------------------------------------------------

                const response =
                    await fetch(
                        FORGOT_PASSWORD_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username:
                                    username,

                                email:
                                    email
                            })
                        }
                    );


                const data =
                    await response.json();


                // -------------------------------------------------
                // REQUEST FAILED
                // -------------------------------------------------

                if (
                    !response.ok ||
                    !data.success
                ) {

                    showForgotMessage(
                        forgotMessage,
                        data.message ||
                            "Unable to send OTP.",
                        "error"
                    );

                    sendOtpBtn.disabled =
                        false;

                    sendOtpBtn.textContent =
                        originalText;

                    return;
                }


                // -------------------------------------------------
                // SAVE RESET DETAILS
                // -------------------------------------------------

                resetUsername =
                    username;

                resetEmail =
                    email;


                // -------------------------------------------------
                // MOVE TO OTP STEP
                // -------------------------------------------------

                showForgotStep(
                    forgotStep2
                );


                if (otpMessage) {

                    otpMessage.textContent =
                        data.message ||
                        "OTP sent successfully. Check your registered email.";

                    otpMessage.className =
                        "forgot-message success";

                }


                if (resetOtp) {

                    resetOtp.value = "";

                    setTimeout(
                        function () {

                            resetOtp.focus();

                        },
                        100
                    );
                }


                // -------------------------------------------------
                // RESTORE BUTTON
                // -------------------------------------------------

                sendOtpBtn.disabled =
                    false;

                sendOtpBtn.textContent =
                    originalText;

            }

            catch (error) {

                console.error(
                    "Send OTP error:",
                    error
                );

                showForgotMessage(
                    forgotMessage,
                    "Unable to connect to the server.",
                    "error"
                );

                sendOtpBtn.disabled =
                    false;

                sendOtpBtn.textContent =
                    originalText;
            }

        }
    );
}


// =====================================================
// VERIFY OTP
// =====================================================

if (verifyOtpBtn) {

    verifyOtpBtn.addEventListener(
        "click",
        async function () {

            const otp =
                resetOtp
                    ? resetOtp.value.trim()
                    : "";


            if (otpMessage) {

                otpMessage.textContent =
                    "";

                otpMessage.className =
                    "forgot-message";

            }


            // -------------------------------------------------
            // OTP VALIDATION
            // -------------------------------------------------

            if (!/^\d{6}$/.test(otp)) {

                showForgotMessage(
                    otpMessage,
                    "Please enter the 6-digit OTP.",
                    "error"
                );

                if (resetOtp) {
                    resetOtp.focus();
                }

                return;
            }


            const originalText =
                verifyOtpBtn.textContent;

            verifyOtpBtn.disabled =
                true;

            verifyOtpBtn.textContent =
                "Verifying...";


            try {

                // -------------------------------------------------
                // VERIFY OTP REQUEST
                // -------------------------------------------------

                const response =
                    await fetch(
                        VERIFY_OTP_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username:
                                    resetUsername,

                                email:
                                    resetEmail,

                                otp:
                                    otp
                            })
                        }
                    );


                const data =
                    await response.json();


                // -------------------------------------------------
                // OTP INVALID
                // -------------------------------------------------

                if (
                    !response.ok ||
                    !data.success
                ) {

                    showForgotMessage(
                        otpMessage,
                        data.message ||
                            "Invalid or expired OTP.",
                        "error"
                    );

                    verifyOtpBtn.disabled =
                        false;

                    verifyOtpBtn.textContent =
                        originalText;

                    return;
                }


                // -------------------------------------------------
                // SAVE RESET TOKEN
                // -------------------------------------------------

                resetToken =
                    data.resetToken;


                // -------------------------------------------------
                // MOVE TO NEW PASSWORD
                // -------------------------------------------------

                showForgotStep(
                    forgotStep3
                );


                if (newPassword) {

                    setTimeout(
                        function () {

                            newPassword.focus();

                        },
                        100
                    );
                }


                // -------------------------------------------------
                // RESTORE BUTTON
                // -------------------------------------------------

                verifyOtpBtn.disabled =
                    false;

                verifyOtpBtn.textContent =
                    originalText;

            }

            catch (error) {

                console.error(
                    "Verify OTP error:",
                    error
                );

                showForgotMessage(
                    otpMessage,
                    "Unable to connect to the server.",
                    "error"
                );

                verifyOtpBtn.disabled =
                    false;

                verifyOtpBtn.textContent =
                    originalText;
            }

        }
    );
}


// =====================================================
// RESEND OTP
// =====================================================

if (resendOtpBtn) {

    resendOtpBtn.addEventListener(
        "click",
        async function () {

            if (
                !resetUsername ||
                !resetEmail
            ) {

                return;
            }


            const originalText =
                resendOtpBtn.textContent;

            resendOtpBtn.disabled =
                true;

            resendOtpBtn.textContent =
                "Sending...";


            if (otpMessage) {

                otpMessage.textContent =
                    "";

                otpMessage.className =
                    "forgot-message";

            }


            try {

                const response =
                    await fetch(
                        FORGOT_PASSWORD_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username:
                                    resetUsername,

                                email:
                                    resetEmail
                            })
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    showForgotMessage(
                        otpMessage,
                        data.message ||
                            "Unable to resend OTP.",
                        "error"
                    );

                    resendOtpBtn.disabled =
                        false;

                    resendOtpBtn.textContent =
                        originalText;

                    return;
                }


                showForgotMessage(
                    otpMessage,
                    data.message ||
                        "A new OTP has been sent to your email.",
                    "success"
                );


                if (resetOtp) {

                    resetOtp.value = "";

                    resetOtp.focus();

                }


                resendOtpBtn.disabled =
                    false;

                resendOtpBtn.textContent =
                    originalText;

            }

            catch (error) {

                console.error(
                    "Resend OTP error:",
                    error
                );

                showForgotMessage(
                    otpMessage,
                    "Unable to connect to the server.",
                    "error"
                );

                resendOtpBtn.disabled =
                    false;

                resendOtpBtn.textContent =
                    originalText;
            }

        }
    );
}


// =====================================================
// TOGGLE NEW PASSWORD
// =====================================================

if (
    toggleNewPassword &&
    newPassword
) {

    toggleNewPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (
                newPassword.type ===
                "password"
            ) {

                newPassword.type =
                    "text";

                toggleNewPassword.textContent =
                    "Hide";

            } else {

                newPassword.type =
                    "password";

                toggleNewPassword.textContent =
                    "Show";
            }

        }
    );
}


// =====================================================
// TOGGLE CONFIRM PASSWORD
// =====================================================

if (
    toggleConfirmPassword &&
    confirmNewPassword
) {

    toggleConfirmPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (
                confirmNewPassword.type ===
                "password"
            ) {

                confirmNewPassword.type =
                    "text";

                toggleConfirmPassword.textContent =
                    "Hide";

            } else {

                confirmNewPassword.type =
                    "password";

                toggleConfirmPassword.textContent =
                    "Show";
            }

        }
    );
}


// =====================================================
// RESET PASSWORD
// =====================================================

if (resetPasswordBtn) {

    resetPasswordBtn.addEventListener(
        "click",
        async function () {

            const password =
                newPassword
                    ? newPassword.value
                    : "";

            const confirmPassword =
                confirmNewPassword
                    ? confirmNewPassword.value
                    : "";


            if (newPasswordMessage) {

                newPasswordMessage.textContent =
                    "";

                newPasswordMessage.className =
                    "forgot-message";

            }


            // -------------------------------------------------
            // PASSWORD VALIDATION
            // -------------------------------------------------

            if (!password) {

                showForgotMessage(
                    newPasswordMessage,
                    "Please enter a new password.",
                    "error"
                );

                if (newPassword) {
                    newPassword.focus();
                }

                return;
            }


            if (password.length < 6) {

                showForgotMessage(
                    newPasswordMessage,
                    "Password must be at least 6 characters.",
                    "error"
                );

                if (newPassword) {
                    newPassword.focus();
                }

                return;
            }


            if (!confirmPassword) {

                showForgotMessage(
                    newPasswordMessage,
                    "Please confirm your new password.",
                    "error"
                );

                if (confirmNewPassword) {
                    confirmNewPassword.focus();
                }

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                showForgotMessage(
                    newPasswordMessage,
                    "Passwords do not match.",
                    "error"
                );

                if (confirmNewPassword) {
                    confirmNewPassword.focus();
                }

                return;
            }


            if (!resetToken) {

                showForgotMessage(
                    newPasswordMessage,
                    "Reset session expired. Please request a new OTP.",
                    "error"
                );

                return;
            }


            // -------------------------------------------------
            // DISABLE BUTTON
            // -------------------------------------------------

            const originalText =
                resetPasswordBtn.textContent;

            resetPasswordBtn.disabled =
                true;

            resetPasswordBtn.textContent =
                "Updating Password...";


            try {

                // -------------------------------------------------
                // RESET PASSWORD REQUEST
                // -------------------------------------------------

                const response =
                    await fetch(
                        RESET_PASSWORD_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                resetToken:
                                    resetToken,

                                newPassword:
                                    password
                            })
                        }
                    );


                const data =
                    await response.json();


                // -------------------------------------------------
                // RESET FAILED
                // -------------------------------------------------

                if (
                    !response.ok ||
                    !data.success
                ) {

                    showForgotMessage(
                        newPasswordMessage,
                        data.message ||
                            "Unable to reset password.",
                        "error"
                    );

                    resetPasswordBtn.disabled =
                        false;

                    resetPasswordBtn.textContent =
                        originalText;

                    return;
                }


                // -------------------------------------------------
                // PASSWORD RESET SUCCESS
                // -------------------------------------------------

                resetToken = "";


                showForgotStep(
                    forgotStepSuccess
                );


                // -------------------------------------------------
                // RESTORE BUTTON
                // -------------------------------------------------

                resetPasswordBtn.disabled =
                    false;

                resetPasswordBtn.textContent =
                    originalText;

            }

            catch (error) {

                console.error(
                    "Reset password error:",
                    error
                );

                showForgotMessage(
                    newPasswordMessage,
                    "Unable to connect to the server.",
                    "error"
                );

                resetPasswordBtn.disabled =
                    false;

                resetPasswordBtn.textContent =
                    originalText;
            }

        }
    );
}


// =====================================================
// BACK TO LOGIN
// =====================================================

if (backToLoginBtn) {

    backToLoginBtn.addEventListener(
        "click",
        function () {

            closeForgotModal();


            // -------------------------------------------------
            // CLEAR PASSWORD FIELDS
            // -------------------------------------------------

            if (newPassword) {
                newPassword.value = "";
            }

            if (confirmNewPassword) {
                confirmNewPassword.value = "";
            }

            if (resetOtp) {
                resetOtp.value = "";
            }


            // -------------------------------------------------
            // FOCUS LOGIN USERNAME
            // -------------------------------------------------

            if (usernameInput) {

                setTimeout(
                    function () {

                        usernameInput.focus();

                    },
                    100
                );
            }

        }
    );
}


// =====================================================
// SHOW MESSAGE HELPER
// =====================================================

function showForgotMessage(
    element,
    text,
    type
) {

    if (!element) {
        return;
    }

    element.textContent =
        text;

    element.className =
        "forgot-message " +
        (type || "error");
}


// =====================================================
// EMAIL VALIDATION
// =====================================================

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


// =====================================================
// PREVENT ENTER KEY FROM ACCIDENTALLY
// SUBMITTING THE WRONG STEP
// =====================================================

if (forgotPasswordModal) {

    forgotPasswordModal.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            const activeStep =
                document.querySelector(
                    ".forgot-step.active"
                );


            if (
                activeStep ===
                forgotStep1
            ) {

                event.preventDefault();

                if (sendOtpBtn) {
                    sendOtpBtn.click();
                }

            }

            else if (
                activeStep ===
                forgotStep2
            ) {

                event.preventDefault();

                if (verifyOtpBtn) {
                    verifyOtpBtn.click();
                }

            }

            else if (
                activeStep ===
                forgotStep3
            ) {

                event.preventDefault();

                if (resetPasswordBtn) {
                    resetPasswordBtn.click();
                }

            }

        }
    );
}