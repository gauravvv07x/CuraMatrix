// =====================================================
// CURAMATRIX - ROLE BASED ACCESS CONTROL
// =====================================================

(function () {

    // -------------------------------------------------
    // GET LOGGED-IN USER
    // -------------------------------------------------

    const loggedIn =
        localStorage.getItem("curaMatrixLoggedIn");

    const userData =
        localStorage.getItem("curaMatrixUser");


    // -------------------------------------------------
    // LOGIN PATH
    // -------------------------------------------------

    const currentPath =
        window.location.pathname.toLowerCase();

    // Dashboard page:
    // /login/dashboard/dashboard.html
    //
    // Module page:
    // /login/dashboard/billing/billing.html
    //
    // Module pages need ../../login.html
    // Dashboard needs ../login.html

    const isModulePage =
        /\/dashboard\/[^/]+\/[^/]+\.html$/i.test(currentPath);

    const loginPath =
        isModulePage
            ? "../../login.html"
            : "../login.html";


    // -------------------------------------------------
    // CHECK LOGIN SESSION
    // -------------------------------------------------

    if (loggedIn !== "true" || !userData) {

        window.location.replace(loginPath);

        return;
    }


    // -------------------------------------------------
    // PARSE USER DATA
    // -------------------------------------------------

    let user;

    try {

        user =
            JSON.parse(userData);

    } catch (error) {

        console.error(
            "Invalid user session:",
            error
        );

        localStorage.removeItem(
            "curaMatrixLoggedIn"
        );

        localStorage.removeItem(
            "curaMatrixToken"
        );

        localStorage.removeItem(
            "curaMatrixUser"
        );

        window.location.replace(loginPath);

        return;
    }


    // -------------------------------------------------
    // GET ROLE
    // -------------------------------------------------

    const role =
        String(user.role || "")
            .toLowerCase()
            .trim();


    // -------------------------------------------------
    // ALLOWED MODULES
    // -------------------------------------------------

    const permissions = {

        admin: [
            "dashboard",
            "add-medicine",
            "medicines",
            "billing",
            "sales",
            "low-stock",
            "expiry-alert",
            "reports",
            "shop-settings",
            "users"
        ],

        pharmacist: [
            "dashboard",
            "add-medicine",
            "medicines",
            "billing",
            "sales",
            "low-stock",
            "expiry-alert",
            "reports"
        ],

        staff: [
            "dashboard",
            "medicines",
            "billing",
            "sales",
            "low-stock",
            "expiry-alert"
        ]

    };


    // -------------------------------------------------
    // INVALID ROLE
    // -------------------------------------------------

    if (!permissions[role]) {

        alert(
            "Your account does not have a valid user role."
        );

        localStorage.removeItem(
            "curaMatrixLoggedIn"
        );

        localStorage.removeItem(
            "curaMatrixToken"
        );

        localStorage.removeItem(
            "curaMatrixUser"
        );

        window.location.replace(loginPath);

        return;
    }


    // -------------------------------------------------
    // CURRENT MODULE
    // -------------------------------------------------

    let currentModule = "dashboard";


    if (
        currentPath.includes("/add-medicine/")
    ) {

        currentModule = "add-medicine";

    }
    else if (
        currentPath.includes("/medicines/")
    ) {

        currentModule = "medicines";

    }
    else if (
        currentPath.includes("/billing/")
    ) {

        currentModule = "billing";

    }
    else if (
        currentPath.includes("/sales/")
    ) {

        currentModule = "sales";

    }
    else if (
        currentPath.includes("/low-stock/")
    ) {

        currentModule = "low-stock";

    }
    else if (
        currentPath.includes("/expiry-alert/")
    ) {

        currentModule = "expiry-alert";

    }
    else if (
        currentPath.includes("/reports/")
    ) {

        currentModule = "reports";

    }
    else if (
        currentPath.includes("/shop-settings/")
    ) {

        currentModule = "shop-settings";

    }
    else if (
        currentPath.includes("/users/")
    ) {

        currentModule = "users";

    }
    else if (
        currentPath.endsWith("/dashboard/dashboard.html")
    ) {

        currentModule = "dashboard";

    }


    // -------------------------------------------------
    // BLOCK UNAUTHORIZED PAGE
    // -------------------------------------------------

    if (
        !permissions[role].includes(currentModule)
    ) {

        alert(
            "You do not have permission to access this module."
        );

        // From dashboard modules:
        // ../dashboard.html

        window.location.replace(
            isModulePage
                ? "../dashboard.html"
                : "dashboard.html"
        );

        return;
    }


    // -------------------------------------------------
    // SIDEBAR LINKS
    // -------------------------------------------------

    const navLinks =
        document.querySelectorAll(
            ".navigation .nav-link"
        );


    navLinks.forEach(function (link) {

        const href =
            link.getAttribute("href") || "";

        let moduleName = null;


        if (
            href.includes("dashboard.html")
        ) {

            moduleName = "dashboard";

        }
        else if (
            href.includes("add-medicine/")
        ) {

            moduleName = "add-medicine";

        }
        else if (
            href.includes("medicines/")
        ) {

            moduleName = "medicines";

        }
        else if (
            href.includes("billing/")
        ) {

            moduleName = "billing";

        }
        else if (
            href.includes("sales/")
        ) {

            moduleName = "sales";

        }
        else if (
            href.includes("low-stock/")
        ) {

            moduleName = "low-stock";

        }
        else if (
            href.includes("expiry-alert/")
        ) {

            moduleName = "expiry-alert";

        }
        else if (
            href.includes("reports/")
        ) {

            moduleName = "reports";

        }
        else if (
            href.includes("shop-settings/")
        ) {

            moduleName = "shop-settings";

        }
        else if (
            href.includes("users/")
        ) {

            moduleName = "users";

        }


        // Hide unauthorized module

        if (
            moduleName &&
            !permissions[role].includes(moduleName)
        ) {

            link.style.display = "none";

        }

    });



    // -------------------------------------------------
    // DASHBOARD QUICK ACTIONS
    // -------------------------------------------------

    const quickActions =
        document.querySelectorAll(
            "[data-module]"
        );


    quickActions.forEach(function (element) {

        const moduleName =
            element.getAttribute(
                "data-module"
            );


        if (
            moduleName &&
            !permissions[role].includes(moduleName)
        ) {

            element.style.display = "none";

        }

    });


    // -------------------------------------------------
    // MAKE ROLE AVAILABLE TO OTHER SCRIPTS
    // -------------------------------------------------

    window.curaMatrixUser = user;

    window.curaMatrixRole = role;


})();