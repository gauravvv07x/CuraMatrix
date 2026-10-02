// ==========================================
// CURAMATRIX - EXPIRY ALERT MODULE
// MongoDB Connected
// ==========================================

const MEDICINE_API =
    "http://localhost:5000/api/medicines";

const EXPIRY_WARNING_DAYS = 30;

let medicines = [];


// ==========================================
// HTML ELEMENTS
// ==========================================

const expiredCount =
    document.getElementById("expiredCount");

const expiringSoonCount =
    document.getElementById("expiringSoonCount");

const safeCount =
    document.getElementById("safeCount");

const totalCount =
    document.getElementById("totalCount");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const refreshBtn =
    document.getElementById("refreshBtn");

const resultCount =
    document.getElementById("resultCount");

const expiryTableBody =
    document.getElementById("expiryTableBody");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// GET TODAY
// ==========================================

function getToday() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;

}


// ==========================================
// GET EXPIRY STATUS
// ==========================================

function getExpiryStatus(expiryDate) {

    const today = getToday();

    const expiry = new Date(expiryDate);

    expiry.setHours(0, 0, 0, 0);


    const difference =
        expiry.getTime() -
        today.getTime();


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


    if (
        daysRemaining <=
        EXPIRY_WARNING_DAYS
    ) {

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


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {
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


// ==========================================
// LOAD MEDICINES FROM MONGODB
// ==========================================

async function loadMedicines() {

    try {

        refreshBtn.disabled = true;

        refreshBtn.textContent =
            "⏳ Loading...";


        const response =
            await fetch(MEDICINE_API);


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to load medicines."
            );

        }


        medicines =
            data.medicines || [];


        updateSummary();

        renderExpiryTable();


    } catch (error) {

        console.error(
            "Expiry alert error:",
            error
        );


        expiredCount.textContent = "0";

        expiringSoonCount.textContent = "0";

        safeCount.textContent = "0";

        totalCount.textContent = "0";

        resultCount.textContent =
            "0 medicines";


        expiryTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty"
                >

                    Unable to load medicines from MongoDB.

                    <br>

                    Make sure backend server is running.

                </td>

            </tr>

        `;

    } finally {

        refreshBtn.disabled = false;

        refreshBtn.textContent =
            "🔄 Refresh";

    }

}


// ==========================================
// UPDATE SUMMARY CARDS
// ==========================================

function updateSummary() {

    let expired = 0;

    let expiringSoon = 0;

    let safe = 0;


    medicines.forEach(
        medicine => {

            const result =
                getExpiryStatus(
                    medicine.expiryDate
                );


            if (
                result.status ===
                "expired"
            ) {

                expired++;

            } else if (
                result.status ===
                "soon"
            ) {

                expiringSoon++;

            } else {

                safe++;

            }

        }
    );


    expiredCount.textContent =
        expired;


    expiringSoonCount.textContent =
        expiringSoon;


    safeCount.textContent =
        safe;


    totalCount.textContent =
        medicines.length;

}


// ==========================================
// RENDER EXPIRY TABLE
// ==========================================

function renderExpiryTable() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    const filteredMedicines =
        medicines.filter(
            medicine => {

                const medicineName =
                    String(
                        medicine.medicineName || ""
                    ).toLowerCase();


                const category =
                    String(
                        medicine.category || ""
                    ).toLowerCase();


                // Search
                const matchesSearch =
                    medicineName.includes(
                        searchText
                    ) ||
                    category.includes(
                        searchText
                    );


                // Status
                const expiry =
                    getExpiryStatus(
                        medicine.expiryDate
                    );


                const matchesStatus =
                    selectedStatus === "all" ||
                    expiry.status ===
                    selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    expiryTableBody.innerHTML = "";


    if (
        filteredMedicines.length === 0
    ) {

        expiryTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty"
                >

                    No medicines found

                </td>

            </tr>

        `;


        resultCount.textContent =
            "0 medicines";


        return;

    }


    // Create table rows
    filteredMedicines.forEach(
        (medicine, index) => {

            const expiry =
                getExpiryStatus(
                    medicine.expiryDate
                );


            let statusText = "";

            let daysText = "";


            if (
                expiry.status ===
                "expired"
            ) {

                statusText =
                    "Expired";


                daysText =
                    `${Math.abs(
                        expiry.days
                    )} days ago`;

            } else if (
                expiry.status ===
                "soon"
            ) {

                statusText =
                    "Expiring Soon";


                daysText =
                    `${expiry.days} days`;

            } else {

                statusText =
                    "Safe";


                daysText =
                    `${expiry.days} days`;

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
                        medicine.stock || 0
                    )}
                </td>


                <td>
                    ${formatDate(
                        medicine.expiryDate
                    )}
                </td>


                <td>
                    ${daysText}
                </td>


                <td>
                    <span class="expiry-status">
                        ${statusText}
                    </span>
                </td>

            `;


            expiryTableBody.appendChild(
                row
            );

        }
    );


    resultCount.textContent =
        `${filteredMedicines.length} medicine${
            filteredMedicines.length !== 1
                ? "s"
                : ""
        }`;

}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderExpiryTable
    );

}


// ==========================================
// STATUS FILTER
// ==========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderExpiryTable
    );

}


// ==========================================
// REFRESH
// ==========================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        loadMedicines
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
// SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
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


// ==========================================
// INITIAL LOAD
// ==========================================

loadMedicines();