/* =========================================================
   CURAMATRIX
   DASHBOARD JAVASCRIPT
   ========================================================= */


/* =========================================================
   GET DATA FROM LOCAL STORAGE
   ========================================================= */

function getMedicines() {
    return JSON.parse(
        localStorage.getItem("curaMatrixMedicines")
    ) || [];
}


function getSales() {
    return JSON.parse(
        localStorage.getItem("curaMatrixSales")
    ) || [];
}


function getBills() {
    return JSON.parse(
        localStorage.getItem("curaMatrixBills")
    ) || [];
}


/* =========================================================
   DATE HELPERS
   ========================================================= */

function getToday() {

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return today;
}


function isExpired(dateString) {

    if (!dateString) {
        return false;
    }

    const expiry = new Date(dateString);

    expiry.setHours(
        0,
        0,
        0,
        0
    );

    return expiry < getToday();
}


/* =========================================================
   UPDATE SUMMARY CARDS
   ========================================================= */

function updateSummary() {

    const medicines = getMedicines();

    const sales = getSales();

    const bills = getBills();


    /* TOTAL MEDICINES */

    const totalMedicines =
        document.getElementById(
            "totalMedicines"
        );

    if (totalMedicines) {

        totalMedicines.textContent =
            medicines.length;
    }


    /* TOTAL STOCK */

    const totalStock =
        medicines.reduce(
            (total, medicine) => {

                return total +
                    Number(
                        medicine.stock || 0
                    );

            },
            0
        );


    const totalStockElement =
        document.getElementById(
            "totalStock"
        );

    if (totalStockElement) {

        totalStockElement.textContent =
            totalStock;
    }


    /* TOTAL SALES */

    const totalSales =
        sales.reduce(
            (total, sale) => {

                return total +
                    Number(
                        sale.total ||
                        sale.amount ||
                        sale.grandTotal ||
                        0
                    );

            },
            0
        );


    const totalSalesElement =
        document.getElementById(
            "totalSales"
        );

    if (totalSalesElement) {

        totalSalesElement.textContent =
            "₹" + totalSales.toFixed(2);
    }


    /* TOTAL BILLS */

    const totalBillsElement =
        document.getElementById(
            "totalBills"
        );

    if (totalBillsElement) {

        totalBillsElement.textContent =
            bills.length;
    }


    /* LOW STOCK */

    const lowStockCount =
        medicines.filter(
            medicine => {

                return Number(
                    medicine.stock || 0
                ) <= Number(
                    medicine.minimumStock || 0
                );

            }
        ).length;


    const lowStockElement =
        document.getElementById(
            "lowStock"
        );

    if (lowStockElement) {

        lowStockElement.textContent =
            lowStockCount;
    }


    /* EXPIRED MEDICINES */

    const expiredCount =
        medicines.filter(
            medicine =>
                isExpired(
                    medicine.expiryDate
                )
        ).length;


    const expiredElement =
        document.getElementById(
            "expiredMedicines"
        );

    if (expiredElement) {

        expiredElement.textContent =
            expiredCount;
    }
}


/* =========================================================
   LOW STOCK LIST
   ========================================================= */

function updateLowStockList() {

    const list =
        document.getElementById(
            "lowStockList"
        );


    if (!list) {
        return;
    }


    const medicines =
        getMedicines();


    const lowStockMedicines =
        medicines.filter(
            medicine => {

                return Number(
                    medicine.stock || 0
                ) <= Number(
                    medicine.minimumStock || 0
                );

            }
        );


    if (
        lowStockMedicines.length === 0
    ) {

        list.innerHTML =
            `<div class="empty-message">
                No low stock medicines.
            </div>`;

        return;
    }


    list.innerHTML =
        lowStockMedicines
            .slice(0, 5)
            .map(
                medicine => {

                    return `
                        <div class="medicine-item">

                            <div class="medicine-info">

                                <strong>
                                    ${escapeHTML(
                                        medicine.medicineName ||
                                        "Unnamed Medicine"
                                    )}
                                </strong>

                                <span>
                                    Batch:
                                    ${escapeHTML(
                                        medicine.batchNumber ||
                                        "-"
                                    )}
                                </span>

                            </div>

                            <span class="stock-status">
                                ${Number(
                                    medicine.stock || 0
                                )}
                                ${escapeHTML(
                                    medicine.unit ||
                                    "units"
                                )}
                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   EXPIRY LIST
   ========================================================= */

function updateExpiryList() {

    const list =
        document.getElementById(
            "expiryList"
        );


    if (!list) {
        return;
    }


    const medicines =
        getMedicines();


    const today =
        getToday();


    const expiryMedicines =
        medicines
            .filter(
                medicine => {

                    if (
                        !medicine.expiryDate
                    ) {
                        return false;
                    }


                    const expiry =
                        new Date(
                            medicine.expiryDate
                        );


                    expiry.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    const difference =
                        expiry - today;


                    const days =
                        difference /
                        (
                            1000 *
                            60 *
                            60 *
                            24
                        );


                    return days <= 30;
                }
            )
            .sort(
                (a, b) =>
                    new Date(
                        a.expiryDate
                    ) -
                    new Date(
                        b.expiryDate
                    )
            );


    if (
        expiryMedicines.length === 0
    ) {

        list.innerHTML =
            `<div class="empty-message">
                No medicines expiring soon.
            </div>`;

        return;
    }


    list.innerHTML =
        expiryMedicines
            .slice(0, 5)
            .map(
                medicine => {

                    const expiry =
                        new Date(
                            medicine.expiryDate
                        );


                    const daysLeft =
                        Math.ceil(
                            (
                                expiry -
                                today
                            ) /
                            (
                                1000 *
                                60 *
                                60 *
                                24
                            )
                        );


                    let statusText;


                    if (daysLeft < 0) {

                        statusText =
                            "Expired";

                    }
                    else if (
                        daysLeft === 0
                    ) {

                        statusText =
                            "Expires today";

                    }
                    else {

                        statusText =
                            daysLeft +
                            " days";
                    }


                    return `
                        <div class="medicine-item expiry-item">

                            <div class="medicine-info">

                                <strong>
                                    ${escapeHTML(
                                        medicine.medicineName ||
                                        "Unnamed Medicine"
                                    )}
                                </strong>

                                <span>
                                    Expiry:
                                    ${formatDate(
                                        medicine.expiryDate
                                    )}
                                </span>

                            </div>

                            <span class="stock-status">
                                ${statusText}
                            </span>

                        </div>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   RECENT SALES
   ========================================================= */

function updateRecentSales() {

    const tableBody =
        document.getElementById(
            "recentSalesBody"
        );


    if (!tableBody) {
        return;
    }


    const sales =
        getSales();


    if (sales.length === 0) {

        tableBody.innerHTML =
            `
                <tr>
                    <td
                        colspan="4"
                        class="empty-message"
                    >
                        No sales recorded yet.
                    </td>
                </tr>
            `;

        return;
    }


    const recentSales =
        [...sales]
            .sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            a.date ||
                            a.createdAt ||
                            0
                        );


                    const dateB =
                        new Date(
                            b.date ||
                            b.createdAt ||
                            0
                        );


                    return dateB - dateA;
                }
            )
            .slice(0, 5);


    tableBody.innerHTML =
        recentSales
            .map(
                (sale, index) => {

                    const billId =
                        sale.billId ||
                        sale.invoiceNumber ||
                        sale.id ||
                        `BILL-${index + 1}`;


                    const customer =
                        sale.customerName ||
                        sale.customer ||
                        "Walk-in Customer";


                    const date =
                        sale.date ||
                        sale.createdAt;


                    const amount =
                        Number(
                            sale.total ||
                            sale.amount ||
                            sale.grandTotal ||
                            0
                        );


                    return `
                        <tr>

                            <td class="bill-id">
                                ${escapeHTML(
                                    String(billId)
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    String(customer)
                                )}
                            </td>

                            <td>
                                ${formatDateTime(
                                    date
                                )}
                            </td>

                            <td>
                                ₹${amount.toFixed(2)}
                            </td>

                        </tr>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   HTML SECURITY
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (
        isNaN(
            date.getTime()
        )
    ) {
        return "-";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function formatDateTime(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (
        isNaN(
            date.getTime()
        )
    ) {
        return "-";
    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================================
   DARK MODE
   ========================================================= */

function setupDarkMode() {

    const darkModeBtn =
        document.getElementById(
            "darkModeBtn"
        );


    const savedDarkMode =
        localStorage.getItem(
            "curaMatrixDarkMode"
        );


    if (
        savedDarkMode === "true"
    ) {

        document.body.classList.add(
            "dark"
        );
    }


    if (!darkModeBtn) {
        return;
    }


    darkModeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                "curaMatrixDarkMode",
                isDark
            );


            darkModeBtn.textContent =
                isDark
                    ? "☀️"
                    : "🌙";
        }
    );


    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        darkModeBtn.textContent =
            "☀️";
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) {
        return;
    }


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


            window.location.href =
                "../login.html";
        }
    );
}


/* =========================================================
   INITIALIZE DASHBOARD
   ========================================================= */

function initializeDashboard() {

    updateSummary();

    updateLowStockList();

    updateExpiryList();

    updateRecentSales();

    setupDarkMode();

    setupLogout();
}


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);


// ================= REAL-TIME DATE & TIME =================

function updateDateTime() {

    const now = new Date();

    const timeElement =
        document.getElementById("currentTime");

    const dateElement =
        document.getElementById("currentDate");

    if (!timeElement || !dateElement) return;

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    const date = now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    timeElement.textContent = time;
    dateElement.textContent = date;
}

updateDateTime();

setInterval(updateDateTime, 1000);