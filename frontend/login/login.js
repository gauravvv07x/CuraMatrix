// =====================================================
// CURAMATRIX LOGIN
// =====================================================
const API_URL =
    window.location.protocol === "file:"
        ? "http://localhost:5000/api/auth/login"
        : "https://curamatrix-backend.onrender.com/api/auth/login";

// =====================================================
// GET ELEMENTS
// =====================================================

const loginForm = document.getElementById("loginForm");

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
// LOAD REMEMBERED USERNAME
// =====================================================

const savedUsername =
    localStorage.getItem("curaMatrixRememberedUsername");

if (savedUsername && usernameInput && rememberCheckbox) {

    usernameInput.value = savedUsername;

    rememberCheckbox.checked = true;
}


// =====================================================
// SHOW / HIDE PASSWORD
// =====================================================

if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "🙈";

            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "◉";

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );
        }

    });

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


            // Clear previous message

            message.textContent = "";

            message.className =
                "login-message";


            // =================================================
            // CHECK EMPTY FIELDS
            // =================================================

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


            // =================================================
            // REMEMBER USERNAME
            // =================================================

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


            // =================================================
            // LOGIN BUTTON
            // =================================================

            const loginButton =
                loginForm.querySelector(".login-button");

            const originalButtonText =
                loginButton.innerHTML;

            loginButton.disabled = true;

            loginButton.innerHTML =
                "Logging in...";


            try {

                // =================================================
                // SEND LOGIN REQUEST TO BACKEND
                // =================================================

                const response =
                    await fetch(API_URL, {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    });


                const data =
                    await response.json();


                // =================================================
                // LOGIN FAILED
                // =================================================

                if (!response.ok || !data.success) {

                    message.textContent =
                        data.message ||
                        "Invalid username or password.";

                    message.className =
                        "login-message error";

                    loginButton.disabled = false;

                    loginButton.innerHTML =
                        originalButtonText;

                    return;
                }


                // =================================================
                // SAVE LOGIN SESSION
                // =================================================

                localStorage.setItem(
                    "curaMatrixLoggedIn",
                    "true"
                );


                // Save JWT token

                localStorage.setItem(
                    "curaMatrixToken",
                    data.token
                );


                // Save logged-in user

                localStorage.setItem(
                    "curaMatrixUser",
                    JSON.stringify(data.user)
                );


                // =================================================
                // SUCCESS MESSAGE
                // =================================================

                message.textContent =
                    "Login successful! Redirecting...";

                message.className =
                    "login-message success";


                // =================================================
                // DASHBOARD
                // =================================================

                setTimeout(function () {

                    window.location.href =
                        "dashboard/dashboard.html";

                }, 500);

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

                loginButton.disabled = false;

                loginButton.innerHTML =
                    originalButtonText;
            }

        }
    );

}


// =====================================================
// FORGOT PASSWORD
// =====================================================

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const username =
                usernameInput.value.trim();


            if (username === "") {

                message.textContent =
                    "Please enter your username first.";

                message.className =
                    "login-message error";

                usernameInput.focus();

                return;
            }


            message.textContent =
                "Password reset will be available after database integration. Please contact the administrator.";

            message.className =
                "login-message info";

        }
    );

}