// ================================
// CURAMATRIX SHOP SETTINGS
// ================================


// DOM ELEMENTS

const shopSettingsForm =
    document.getElementById(
        "shopSettingsForm"
    );

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

const showGST =
    document.getElementById("showGST");

const showAddress =
    document.getElementById("showAddress");

const successMessage =
    document.getElementById(
        "successMessage"
    );


// ================================
// SHOW SUCCESS MESSAGE
// ================================

function showSuccess() {

    successMessage.classList.add("show");

    setTimeout(() => {

        successMessage.classList.remove(
            "show"
        );

    }, 2500);

}


// ================================
// LOAD SETTINGS
// ================================

function loadSettings() {

    const settings =
        JSON.parse(
            localStorage.getItem(
                "curaMatrixShopSettings"
            )
        ) || {};


    shopName.value =
        settings.shopName || "";

    ownerName.value =
        settings.ownerName || "";

    shopMobile.value =
        settings.shopMobile || "";

    shopEmail.value =
        settings.shopEmail || "";

    gstNumber.value =
        settings.gstNumber || "";

    shopAddress.value =
        settings.shopAddress || "";


    const invoiceSettings =
        JSON.parse(
            localStorage.getItem(
                "curaMatrixInvoiceSettings"
            )
        ) || {};


    showGST.checked =
        invoiceSettings.showGST !== false;

    showAddress.checked =
        invoiceSettings.showAddress !== false;

}


// ================================
// SAVE SHOP SETTINGS
// ================================

shopSettingsForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const settings = {

            shopName:
                shopName.value.trim(),

            ownerName:
                ownerName.value.trim(),

            shopMobile:
                shopMobile.value.trim(),

            shopEmail:
                shopEmail.value.trim(),

            gstNumber:
                gstNumber.value
                    .trim()
                    .toUpperCase(),

            shopAddress:
                shopAddress.value.trim()

        };


        localStorage.setItem(
            "curaMatrixShopSettings",
            JSON.stringify(settings)
        );


        showSuccess();

    }
);


// ================================
// SAVE INVOICE SETTINGS
// ================================

document.getElementById(
    "saveInvoiceBtn"
).addEventListener(
    "click",
    function() {

        const invoiceSettings = {

            showGST:
                showGST.checked,

            showAddress:
                showAddress.checked

        };


        localStorage.setItem(
            "curaMatrixInvoiceSettings",
            JSON.stringify(
                invoiceSettings
            )
        );


        showSuccess();

    }
);


// ================================
// RESET
// ================================

document.getElementById(
    "resetBtn"
).addEventListener(
    "click",
    function() {

        const confirmReset =
            confirm(
                "Are you sure you want to reset the shop settings?"
            );


        if (!confirmReset) {
            return;
        }


        shopSettingsForm.reset();


        showGST.checked = true;

        showAddress.checked = true;


        localStorage.removeItem(
            "curaMatrixShopSettings"
        );

        localStorage.removeItem(
            "curaMatrixInvoiceSettings"
        );


        showSuccess();

    }
);


// ================================
// DARK MODE
// ================================

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );


function applyDarkMode() {

    const darkMode =
        localStorage.getItem(
            "curaMatrixDarkMode"
        ) === "true";


    if (darkMode) {

        document.body.classList.add(
            "dark"
        );

        darkModeBtn.textContent = "☀️";

    } else {

        document.body.classList.remove(
            "dark"
        );

        darkModeBtn.textContent = "🌙";

    }

}


darkModeBtn.addEventListener(
    "click",
    function() {

        const isDark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            "curaMatrixDarkMode",
            !isDark
        );


        applyDarkMode();

    }
);


// ================================
// LOGOUT
// ================================

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    function() {

        localStorage.removeItem(
            "curaMatrixLoggedIn"
        );

        window.location.href =
            "login.html";

    }
);


// ================================
// INITIALIZE
// ================================

loadSettings();

applyDarkMode();