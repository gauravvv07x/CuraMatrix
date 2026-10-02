// ==========================================
// CURAMATRIX - LOW STOCK MODULE
// MongoDB Connected - Render Backend
// ==========================================

const MEDICINE_API =
    "https://curamatrix-backend.onrender.com/api/medicines";

let medicines = [];


// ==========================================
// HTML ELEMENTS
// ==========================================

const lowStockCount =
    document.getElementById("lowStockCount");

const searchInput =
    document.getElementById("searchInput");

const lowStockTableBody =
    document.getElementById("lowStockTableBody");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// LOAD MEDICINES FROM MONGODB
// ==========================================

async function loadMedicines() {

    try {

        console.log(
            "Loading medicines from:",
            MEDICINE_API
        );


        const response =
            await fetch(MEDICINE_API);


        const data =
            await response.json();


        console.log(
            "Medicine API response:",
            data
        );


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load medicines."
            );

        }


        // Support backend response
        // { medicines: [...] }
        // or { data: [...] }

        if (Array.isArray(data.medicines)) {

            medicines = data.medicines;

        } else if (Array.isArray(data.data)) {

            medicines = data.data;

        } else {

            medicines = [];

        }


        renderLowStock();


    } catch (error) {

        console.error(
            "Low stock loading error:",
            error
        );


        if (lowStockCount) {

            lowStockCount.textContent =
                "0";

        }


        if (lowStockTableBody) {

            lowStockTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        class="empty-message"
                    >

                        Unable to load medicines from MongoDB.

                        <br>

                        ${escapeHTML(
                            error.message ||
                            "Unknown error"
                        )}

                    </td>

                </tr>

            `;

        }

    }

}


// ==========================================
// RENDER LOW STOCK MEDICINES
// ==========================================

function renderLowStock() {

    if (!lowStockTableBody) {
        return;
    }


    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    // ======================================
    // FIND LOW STOCK MEDICINES
    // ======================================

    const lowStockMedicines =
        medicines.filter(medicine => {

            const stock =
                Number(
                    medicine.stock || 0
                );


            const minimumStock =
                Number(
                    medicine.minimumStock || 0
                );


            return stock <= minimumStock;

        });


    // ======================================
    // UPDATE COUNT
    // ======================================

    if (lowStockCount) {

        lowStockCount.textContent =
            lowStockMedicines.length;

    }


    // ======================================
    // APPLY SEARCH
    // ======================================

    const filteredMedicines =
        lowStockMedicines.filter(
            medicine => {

                const medicineName =
                    String(
                        medicine.medicineName || ""
                    ).toLowerCase();


                const category =
                    String(
                        medicine.category || ""
                    ).toLowerCase();


                const batchNumber =
                    String(
                        medicine.batchNumber || ""
                    ).toLowerCase();


                return (
                    medicineName.includes(
                        searchText
                    ) ||

                    category.includes(
                        searchText
                    ) ||

                    batchNumber.includes(
                        searchText
                    )
                );

            }
        );


    // ======================================
    // CLEAR TABLE
    // ======================================

    lowStockTableBody.innerHTML = "";


    // ======================================
    // NO MEDICINES
    // ======================================

    if (filteredMedicines.length === 0) {

        lowStockTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-message"
                >

                    ${
                        searchText
                            ? "No matching low stock medicines."
                            : "No low stock medicines."
                    }

                </td>

            </tr>

        `;

        return;

    }


    // ======================================
    // CREATE TABLE ROWS
    // ======================================

    filteredMedicines.forEach(
        (medicine, index) => {

            const stock =
                Number(
                    medicine.stock || 0
                );


            const minimumStock =
                Number(
                    medicine.minimumStock || 0
                );


            let statusText;


            if (stock === 0) {

                statusText =
                    "Out of Stock";

            } else {

                statusText =
                    "Low Stock";

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
                            medicine.medicineName || "-"
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        medicine.category || "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        medicine.batchNumber || "-"
                    )}
                </td>

                <td>
                    <strong>
                        ${stock}
                    </strong>
                </td>

                <td>
                    ${minimumStock}
                </td>

                <td>
                    ${escapeHTML(
                        medicine.unit || "-"
                    )}
                </td>

                <td>
                    <span class="stock-status">
                        ${statusText}
                    </span>
                </td>

            `;


            lowStockTableBody.appendChild(
                row
            );

        }
    );

}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderLowStock
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