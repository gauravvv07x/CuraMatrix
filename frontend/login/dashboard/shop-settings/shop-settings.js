// ==========================================
// CURAMATRIX - SHOP SETTINGS
// ==========================================

const STORAGE_KEY = "curaMatrixShopSettings";

// ==========================================
// ELEMENTS
// ==========================================

const shopSettingsForm =
    document.getElementById("shopSettingsForm");

const shopName =
    document.getElementById("shopName");

const ownerName =
    document.getElementById("ownerName");

const shopMobile =
    document.getElementById("shopMobile");

const shopEmail =
    document.getElementById("shopEmail");

const gstNumber =
    document.getElementById("gstNumber");

const shopAddress =
    document.getElementById("shopAddress");

const resetBtn =
    document.getElementById("resetBtn");

const showGST =
    document.getElementById("showGST");

const showAddress =
    document.getElementById("showAddress");

const saveInvoiceBtn =
    document.getElementById("saveInvoiceBtn");

const successMessage =
    document.getElementById("successMessage");

const darkModeBtn =
    document.getElementById("darkModeBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


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
// LOAD SETTINGS
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


    shopName.value =
        settings.shopName;

    ownerName.value =
        settings.ownerName;

    shopMobile.value =
        settings.shopMobile;

    shopEmail.value =
        settings.shopEmail;

    gstNumber.value =
        settings.gstNumber;

    shopAddress.value =
        settings.shopAddress;

    showGST.checked =
        settings.showGST;

    showAddress.checked =
        settings.showAddress;

}


// ==========================================
// GET CURRENT SETTINGS
// ==========================================

function getCurrentSettings() {

    return {

        shopName:
            shopName.value.trim(),

        ownerName:
            ownerName.value.trim(),

        shopMobile:
            shopMobile.value.trim(),

        shopEmail:
            shopEmail.value.trim(),

        gstNumber:
            gstNumber.value.trim(),

        shopAddress:
            shopAddress.value.trim(),

        showGST:
            showGST.checked,

        showAddress:
            showAddress.checked

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
                !shopName.value.trim()
            ) {

                alert(
                    "Please enter shop name."
                );

                shopName.focus();

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
// RESET SETTINGS
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