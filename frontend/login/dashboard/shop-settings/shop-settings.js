// ==========================================
// CURAMATRIX - SHOP SETTINGS
// ==========================================

const STORAGE_KEY =
    "curaMatrixShopSettings";


// ==========================================
// RESET DATABASE API
// ==========================================

const RESET_DATABASE_API =
    (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:"
    )
        ? "http://localhost:5000/api/users/reset-database"
        : "https://curamatrix-backend.onrender.com/api/users/reset-database";


// ==========================================
// ELEMENTS
// ==========================================

const shopSettingsForm =
    document.getElementById(
        "shopSettingsForm"
    );

const shopName =
    document.getElementById(
        "shopName"
    );

const ownerName =
    document.getElementById(
        "ownerName"
    );

const shopMobile =
    document.getElementById(
        "shopMobile"
    );

const shopEmail =
    document.getElementById(
        "shopEmail"
    );

const gstNumber =
    document.getElementById(
        "gstNumber"
    );

const shopAddress =
    document.getElementById(
        "shopAddress"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );

const showGST =
    document.getElementById(
        "showGST"
    );

const showAddress =
    document.getElementById(
        "showAddress"
    );

const saveInvoiceBtn =
    document.getElementById(
        "saveInvoiceBtn"
    );

const successMessage =
    document.getElementById(
        "successMessage"
    );

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// ==========================================
// DATABASE RESET ELEMENTS
// ==========================================

const resetDatabaseBtn =
    document.getElementById(
        "resetDatabaseBtn"
    );

const resetDatabaseModal =
    document.getElementById(
        "resetDatabaseModal"
    );

const adminResetPassword =
    document.getElementById(
        "adminResetPassword"
    );

const toggleResetPassword =
    document.getElementById(
        "toggleResetPassword"
    );

const resetDatabaseMessage =
    document.getElementById(
        "resetDatabaseMessage"
    );

const cancelResetDatabaseBtn =
    document.getElementById(
        "cancelResetDatabaseBtn"
    );

const confirmResetDatabaseBtn =
    document.getElementById(
        "confirmResetDatabaseBtn"
    );


// ==========================================
// DEFAULT SETTINGS
// ==========================================

const defaultSettings = {

    shopName: "",

    ownerName: "",

    shopMobile: "",

    shopEmail: "",

    gstNumber: "",

    shopAddress: "",

    showGST: false,

    showAddress: false

};


// ==========================================
// SHOW SUCCESS MESSAGE
// ==========================================

function showSuccess(message) {

    if (!successMessage) {
        return;
    }

    successMessage.textContent =
        "✓ " + message;

    successMessage.classList.add(
        "show"
    );

    setTimeout(() => {

        successMessage.classList.remove(
            "show"
        );

    }, 2500);

}


// ==========================================
// LOAD SHOP SETTINGS
// ==========================================

function loadSettings() {

    const savedSettings =
        localStorage.getItem(
            STORAGE_KEY
        );

    let settings =
        { ...defaultSettings };


    if (savedSettings) {

        try {

            settings = {
                ...defaultSettings,
                ...JSON.parse(
                    savedSettings
                )
            };

        } catch (error) {

            console.error(
                "Unable to read saved settings:",
                error
            );

        }

    }


    if (shopName) {
        shopName.value =
            settings.shopName;
    }

    if (ownerName) {
        ownerName.value =
            settings.ownerName;
    }

    if (shopMobile) {
        shopMobile.value =
            settings.shopMobile;
    }

    if (shopEmail) {
        shopEmail.value =
            settings.shopEmail;
    }

    if (gstNumber) {
        gstNumber.value =
            settings.gstNumber;
    }

    if (shopAddress) {
        shopAddress.value =
            settings.shopAddress;
    }

    if (showGST) {
        showGST.checked =
            settings.showGST;
    }

    if (showAddress) {
        showAddress.checked =
            settings.showAddress;
    }

}


// ==========================================
// GET CURRENT SETTINGS
// ==========================================

function getCurrentSettings() {

    return {

        shopName:
            shopName
                ? shopName.value.trim()
                : "",

        ownerName:
            ownerName
                ? ownerName.value.trim()
                : "",

        shopMobile:
            shopMobile
                ? shopMobile.value.trim()
                : "",

        shopEmail:
            shopEmail
                ? shopEmail.value.trim()
                : "",

        gstNumber:
            gstNumber
                ? gstNumber.value.trim()
                : "",

        shopAddress:
            shopAddress
                ? shopAddress.value.trim()
                : "",

        showGST:
            showGST
                ? showGST.checked
                : false,

        showAddress:
            showAddress
                ? showAddress.checked
                : false

    };

}


// ==========================================
// SAVE SHOP SETTINGS
// ==========================================

if (shopSettingsForm) {

    shopSettingsForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                !shopName ||
                !shopName.value.trim()
            ) {

                alert(
                    "Please enter shop name."
                );

                if (shopName) {
                    shopName.focus();
                }

                return;

            }


            const settings =
                getCurrentSettings();


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );


            showSuccess(
                "Settings saved successfully"
            );

        }
    );

}


// ==========================================
// RESET SHOP SETTINGS
// ==========================================

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        function () {

            const confirmReset =
                confirm(
                    "Are you sure you want to reset shop settings?"
                );


            if (!confirmReset) {
                return;
            }


            localStorage.removeItem(
                STORAGE_KEY
            );


            loadSettings();


            showSuccess(
                "Settings reset successfully"
            );

        }
    );

}


// ==========================================
// SAVE INVOICE SETTINGS
// ==========================================

if (saveInvoiceBtn) {

    saveInvoiceBtn.addEventListener(
        "click",
        function () {

            const settings =
                getCurrentSettings();


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );


            showSuccess(
                "Invoice settings saved successfully"
            );

        }
    );

}


// ==========================================
// DARK MODE
// ==========================================

if (darkModeBtn) {

    darkModeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            const darkModeEnabled =
                document.body.classList.contains(
                    "dark-mode"
                );


            localStorage.setItem(
                "curaMatrixDarkMode",
                darkModeEnabled
            );


            darkModeBtn.textContent =
                darkModeEnabled
                    ? "☀️"
                    : "🌙";

        }
    );

}


// ==========================================
// LOAD DARK MODE
// ==========================================

function loadDarkMode() {

    const darkMode =
        localStorage.getItem(
            "curaMatrixDarkMode"
        );


    if (darkMode === "true") {

        document.body.classList.add(
            "dark-mode"
        );


        if (darkModeBtn) {

            darkModeBtn.textContent =
                "☀️";

        }

    }

}


// ==========================================
// SHOW / HIDE RESET DATABASE PASSWORD
// ==========================================

if (
    toggleResetPassword &&
    adminResetPassword
) {

    toggleResetPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (
                adminResetPassword.type ===
                "password"
            ) {

                adminResetPassword.type =
                    "text";

                toggleResetPassword.textContent =
                    "Hide";

            } else {

                adminResetPassword.type =
                    "password";

                toggleResetPassword.textContent =
                    "Show";

            }

        }
    );

}


// ==========================================
// OPEN RESET DATABASE MODAL
// ==========================================

if (resetDatabaseBtn) {

    resetDatabaseBtn.addEventListener(
        "click",
        function () {

            if (!resetDatabaseModal) {
                return;
            }


            resetDatabaseModal.classList.add(
                "show"
            );


            if (adminResetPassword) {

                adminResetPassword.value =
                    "";

                adminResetPassword.type =
                    "password";

            }


            if (toggleResetPassword) {

                toggleResetPassword.textContent =
                    "Show";

            }


            if (resetDatabaseMessage) {

                resetDatabaseMessage.textContent =
                    "";

                resetDatabaseMessage.className =
                    "reset-message";

            }


            setTimeout(
                function () {

                    if (adminResetPassword) {
                        adminResetPassword.focus();
                    }

                },
                100
            );

        }
    );

}


// ==========================================
// CLOSE RESET DATABASE MODAL
// ==========================================

function closeResetDatabaseModal() {

    if (resetDatabaseModal) {

        resetDatabaseModal.classList.remove(
            "show"
        );

    }


    if (adminResetPassword) {

        adminResetPassword.value =
            "";

        adminResetPassword.type =
            "password";

    }


    if (toggleResetPassword) {

        toggleResetPassword.textContent =
            "Show";

    }


    if (resetDatabaseMessage) {

        resetDatabaseMessage.textContent =
            "";

        resetDatabaseMessage.className =
            "reset-message";

    }

}


// ==========================================
// CANCEL RESET DATABASE
// ==========================================

if (cancelResetDatabaseBtn) {

    cancelResetDatabaseBtn.addEventListener(
        "click",
        function () {

            closeResetDatabaseModal();

        }
    );

}


// ==========================================
// RESET DATABASE
// ==========================================

if (confirmResetDatabaseBtn) {

    confirmResetDatabaseBtn.addEventListener(
        "click",
        async function () {

            const password =
                adminResetPassword
                    ? adminResetPassword.value.trim()
                    : "";


            if (!password) {

                if (resetDatabaseMessage) {

                    resetDatabaseMessage.textContent =
                        "Please enter the Administrator password.";

                    resetDatabaseMessage.className =
                        "reset-message error";

                }


                if (adminResetPassword) {
                    adminResetPassword.focus();
                }

                return;

            }


            confirmResetDatabaseBtn.disabled =
                true;

            confirmResetDatabaseBtn.textContent =
                "Resetting...";


            if (resetDatabaseMessage) {

                resetDatabaseMessage.textContent =
                    "Verifying Administrator password...";

                resetDatabaseMessage.className =
                    "reset-message";

            }


            try {

                const response =
                    await fetch(
                        RESET_DATABASE_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    adminPassword:
                                        password
                                })
                        }
                    );


                // ----------------------------------
                // Read response safely
                // ----------------------------------

                const contentType =
                    response.headers.get(
                        "content-type"
                    ) || "";


                let data;


                if (
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    data =
                        await response.json();

                } else {

                    const text =
                        await response.text();

                    throw new Error(
                        "Server returned an invalid response."
                    );

                }


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to reset database."
                    );

                }


                // ----------------------------------
                // SUCCESS
                // ----------------------------------

                const deleted =
                    data.deleted || {};


                if (resetDatabaseMessage) {

                    resetDatabaseMessage.textContent =
                        "✓ Database reset successfully.";

                    resetDatabaseMessage.className =
                        "reset-message success";

                }


                console.log(
                    "Database reset completed:",
                    deleted
                );


                // Close modal first
                closeResetDatabaseModal();


                // Then show result
                setTimeout(
                    function () {

                        alert(
                            "Database reset successfully.\n\n" +
                            "Medicines deleted: " +
                            (deleted.medicines || 0) +
                            "\nBills deleted: " +
                            (deleted.bills || 0) +
                            "\nUsers deleted: " +
                            (deleted.users || 0)
                        );

                    },
                    150
                );


            } catch (error) {

                console.error(
                    "Database reset error:",
                    error
                );


                if (resetDatabaseMessage) {

                    resetDatabaseMessage.textContent =
                        error.message ||
                        "Unable to reset database.";

                    resetDatabaseMessage.className =
                        "reset-message error";

                }

            } finally {

                confirmResetDatabaseBtn.disabled =
                    false;

                confirmResetDatabaseBtn.textContent =
                    "Reset Database";

            }

        }
    );

}


// ==========================================
// CLOSE MODAL BY CLICKING OUTSIDE
// ==========================================

if (resetDatabaseModal) {

    resetDatabaseModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                resetDatabaseModal
            ) {

                closeResetDatabaseModal();

            }

        }
    );

}


// ==========================================
// ENTER KEY FOR PASSWORD
// ==========================================

if (adminResetPassword) {

    adminResetPassword.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                if (
                    confirmResetDatabaseBtn &&
                    !confirmResetDatabaseBtn.disabled
                ) {

                    confirmResetDatabaseBtn.click();

                }

            }

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            localStorage.removeItem(
                "curaMatrixLoggedIn"
            );

            localStorage.removeItem(
                "curaMatrixToken"
            );

            localStorage.removeItem(
                "curaMatrixUser"
            );


            window.location.href =
                "../../login.html";

        }
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadSettings();

loadDarkMode();