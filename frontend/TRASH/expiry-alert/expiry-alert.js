// ===============================
// Load Medicines
// ===============================

let medicines =
    JSON.parse(
        localStorage.getItem("curaMatrixMedicines")
    ) || [];


// ===============================
// Elements
// ===============================

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const tableBody =
    document.getElementById("expiryTableBody");


// ===============================
// Get Today's Date
// ===============================

function getToday() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
}


// ===============================
// Get Expiry Status
// ===============================

function getExpiryStatus(expiryDate) {

    const today = getToday();

    const expiry = new Date(expiryDate);

    expiry.setHours(0, 0, 0, 0);


    const difference =
        expiry.getTime() - today.getTime();


    const daysRemaining =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (daysRemaining < 0) {

        return {
            status: "expired",
            days: daysRemaining
        };

    }


    if (daysRemaining <= 30) {

        return {
            status: "soon",
            days: daysRemaining
        };

    }


    return {
        status: "safe",
        days: daysRemaining
    };
}


// ===============================
// Format Date
// ===============================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ===============================
// Render Table
// ===============================

function renderExpiryTable() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedStatus =
        statusFilter.value;


    const filtered =
        medicines.filter(medicine => {

            const name =
                String(
                    medicine.medicineName
                ).toLowerCase();

            const category =
                String(
                    medicine.category
                ).toLowerCase();


            const matchesSearch =
                name.includes(search) ||
                category.includes(search);


            const expiryInfo =
                getExpiryStatus(
                    medicine.expiryDate
                );


            const matchesStatus =
                selectedStatus === "all" ||
                selectedStatus === expiryInfo.status;


            return (
                matchesSearch &&
                matchesStatus
            );
        });


    tableBody.innerHTML = "";


    if (filtered.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    No medicines found
                </td>
            </tr>
        `;

        document.getElementById("resultCount")
            .textContent =
            "0 medicines";

        return;
    }


    filtered.forEach(
        (medicine, index) => {

            const expiryInfo =
                getExpiryStatus(
                    medicine.expiryDate
                );


            let statusHTML;
            let daysHTML;


            if (
                expiryInfo.status ===
                "expired"
            ) {

                statusHTML = `
                    <span class="status-expired">
                        Expired
                    </span>
                `;

                daysHTML = `
                    <span class="days-expired">
                        ${Math.abs(
                            expiryInfo.days
                        )} days ago
                    </span>
                `;

            } else if (
                expiryInfo.status ===
                "soon"
            ) {

                statusHTML = `
                    <span class="status-soon">
                        Expiring Soon
                    </span>
                `;

                daysHTML = `
                    <span class="days-soon">
                        ${expiryInfo.days}
                        days left
                    </span>
                `;

            } else {

                statusHTML = `
                    <span class="status-safe">
                        Safe
                    </span>
                `;

                daysHTML = `
                    <span class="days-safe">
                        ${expiryInfo.days}
                        days left
                    </span>
                `;
            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            medicine.medicineName
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        medicine.category
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        medicine.batchNumber
                    )}
                </td>

                <td>
                    ${Number(
                        medicine.stock
                    )}
                </td>

                <td>
                    ${formatDate(
                        medicine.expiryDate
                    )}
                </td>

                <td>
                    ${daysHTML}
                </td>

                <td>
                    ${statusHTML}
                </td>
            `;


            tableBody.appendChild(row);
        }
    );


    document.getElementById("resultCount")
        .textContent =
        `${filtered.length} medicine${
            filtered.length !== 1
                ? "s"
                : ""
        }`;
}


// ===============================
// Update Summary
// ===============================

function updateSummary() {

    let expired = 0;

    let expiringSoon = 0;

    let safe = 0;


    medicines.forEach(medicine => {

        const info =
            getExpiryStatus(
                medicine.expiryDate
            );


        if (info.status === "expired") {

            expired++;

        } else if (
            info.status === "soon"
        ) {

            expiringSoon++;

        } else {

            safe++;
        }
    });


    document.getElementById("expiredCount")
        .textContent = expired;


    document.getElementById(
        "expiringSoonCount"
    ).textContent = expiringSoon;


    document.getElementById("safeCount")
        .textContent = safe;


    document.getElementById("totalCount")
        .textContent = medicines.length;
}


// ===============================
// Search
// ===============================

searchInput.addEventListener(
    "input",
    renderExpiryTable
);


// ===============================
// Status Filter
// ===============================

statusFilter.addEventListener(
    "change",
    renderExpiryTable
);


// ===============================
// Refresh
// ===============================

document.getElementById("refreshBtn")
    .addEventListener(
        "click",
        function () {

            medicines =
                JSON.parse(
                    localStorage.getItem(
                        "curaMatrixMedicines"
                    )
                ) || [];


            updateSummary();

            renderExpiryTable();
        }
    );


// ===============================
// Dark Mode
// ===============================

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );


if (
    localStorage.getItem(
        "curaMatrixDarkMode"
    ) === "true"
) {

    document.body.classList.add("dark");

    darkModeBtn.textContent = "☀️";
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


// ===============================
// Logout
// ===============================

document.getElementById("logoutBtn")
    .addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "curaMatrixLoggedIn"
            );

            window.location.href =
                "login.html";
        }
    );


// ===============================
// Security
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ===============================
// Initial Load
// ===============================

updateSummary();

renderExpiryTable();
