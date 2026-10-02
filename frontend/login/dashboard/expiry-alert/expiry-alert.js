const MEDICINE_API =
    "https://curamatrix-backend.onrender.com/api/medicines";

const WARNING_DAYS = 30;

let medicines = [];

const $ = (id) => document.getElementById(id);


function startOfToday() {

    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
}


function statusOf(expiryDate) {

    const date = new Date(expiryDate);

    if (isNaN(date)) {

        return {
            status: "safe",
            days: 0
        };

    }

    date.setHours(0, 0, 0, 0);

    const today = startOfToday();

    const days = Math.ceil(
        (date - today) / 86400000
    );


    if (days < 0) {

        return {
            status: "expired",
            days: days
        };

    }


    if (days <= WARNING_DAYS) {

        return {
            status: "soon",
            days: days
        };

    }


    return {
        status: "safe",
        days: days
    };

}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function formatDate(value) {

    const date = new Date(value);

    if (isNaN(date)) {
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


async function loadMedicines() {

    try {

        $("refreshBtn").disabled = true;

        $("refreshBtn").textContent = "⏳ Loading...";


        const response = await fetch(
            MEDICINE_API + "?t=" + Date.now(),
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Accept": "application/json"
                }
            }
        );


        const data = await response.json();


        if (!response.ok || data.success !== true) {

            throw new Error(
                data.message ||
                "Unable to load medicines"
            );

        }


        medicines = Array.isArray(data.medicines)
            ? data.medicines
            : [];


        updateSummary();

        render();


    } catch (error) {

        console.error(
            "Expiry Alert Error:",
            error
        );


        medicines = [];

        updateSummary();


        $("resultCount").textContent =
            "0 medicines";


        $("expiryTableBody").innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    Unable to load medicines.<br>
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;


    } finally {

        $("refreshBtn").disabled = false;

        $("refreshBtn").textContent =
            "🔄 Refresh";

    }

}


function updateSummary() {

    let expired = 0;
    let expiringSoon = 0;
    let safe = 0;


    medicines.forEach((medicine) => {

        const result =
            statusOf(medicine.expiryDate);


        if (result.status === "expired") {

            expired++;

        } else if (result.status === "soon") {

            expiringSoon++;

        } else {

            safe++;

        }

    });


    $("expiredCount").textContent =
        expired;

    $("expiringSoonCount").textContent =
        expiringSoon;

    $("safeCount").textContent =
        safe;

    $("totalCount").textContent =
        medicines.length;

}


function render() {

    const search =
        $("searchInput")
            .value
            .toLowerCase()
            .trim();


    const filter =
        $("statusFilter").value;


    const filtered =
        medicines.filter((medicine) => {

            const result =
                statusOf(
                    medicine.expiryDate
                );


            const searchableText = `

                ${medicine.medicineName || ""}

                ${medicine.category || ""}

                ${medicine.batchNumber || ""}

            `.toLowerCase();


            const matchesSearch =
                searchableText.includes(search);


            const matchesFilter =
                filter === "all" ||
                filter === result.status;


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    if (filtered.length === 0) {

        $("expiryTableBody").innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    No medicines found
                </td>
            </tr>
        `;

        $("resultCount").textContent =
            "0 medicines";

        return;

    }


    $("expiryTableBody").innerHTML =
        filtered.map(
            (medicine, index) => {

                const result =
                    statusOf(
                        medicine.expiryDate
                    );


                let daysText;


                if (
                    result.status === "expired"
                ) {

                    daysText =
                        `${Math.abs(result.days)} days ago`;

                } else if (
                    result.days === 0
                ) {

                    daysText =
                        "Today";

                } else {

                    daysText =
                        `${result.days} days`;

                }


                let statusText;


                if (
                    result.status === "expired"
                ) {

                    statusText = "Expired";

                } else if (
                    result.status === "soon"
                ) {

                    statusText =
                        result.days === 0
                            ? "Expires Today"
                            : "Expiring Soon";

                } else {

                    statusText = "Safe";

                }


                return `
                    <tr>

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
                            <span class="status ${result.status}">
                                ${statusText}
                            </span>
                        </td>

                    </tr>
                `;

            }
        ).join("");


    $("resultCount").textContent =
        `${filtered.length} medicine${filtered.length === 1 ? "" : "s"}`;

}


$("searchInput").addEventListener(
    "input",
    render
);


$("statusFilter").addEventListener(
    "change",
    render
);


$("refreshBtn").addEventListener(
    "click",
    loadMedicines
);


$("logoutBtn").addEventListener(
    "click",
    () => {

        if (
            confirm(
                "Are you sure you want to logout?"
            )
        ) {

            localStorage.removeItem(
                "curaMatrixLoggedIn"
            );

            localStorage.removeItem(
                "curaMatrixToken"
            );

            localStorage.removeItem(
                "curaMatrixUser"
            );


            location.href =
                "../../login.html";

        }

    }
);


loadMedicines();