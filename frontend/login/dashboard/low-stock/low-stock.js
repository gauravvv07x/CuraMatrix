// ==========================================
// CURAMATRIX - LOW STOCK MODULE
// MongoDB Connected
// ==========================================

const MEDICINE_API =
    "http://localhost:5000/api/medicines";

let medicines = [];


// ==========================================
// HTML ELEMENTS
// ==========================================

const lowStockCount =
    document.getElementById("lowStockCount");

const searchInput =
    document.getElementById("searchInput");

const lowStockTableBody =
    document.getElementById(
        "lowStockTableBody"
    );

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// LOAD MEDICINES FROM MONGODB
// ==========================================

async function loadMedicines() {

    try {

        const response =
            await fetch(MEDICINE_API);


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load medicines."
            );

        }


        medicines =
            data.medicines || [];


        renderLowStock();


    } catch (error) {

        console.error(
            "Low stock loading error:",
            error
        );


        lowStockCount.textContent = "0";


        lowStockTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-message"
                >

                    Unable to load medicines from MongoDB.

                    <br>

                    Make sure backend server is running.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// RENDER LOW STOCK MEDICINES
// ==========================================

function renderLowStock() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    // Find low-stock medicines
    const lowStockMedicines =
        medicines.filter(medicine => {

            const stock =
                Number(medicine.stock || 0);

            const minimumStock =
                Number(
                    medicine.minimumStock || 0
                );


            return stock <= minimumStock;

        });


    // Update total low stock count
    lowStockCount.textContent =
        lowStockMedicines.length;


    // Apply search filter
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


                return (
                    medicineName.includes(
                        searchText
                    ) ||

                    category.includes(
                        searchText
                    )
                );

            }
        );


    // Clear table
    lowStockTableBody.innerHTML = "";


    // No medicines
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


    // Create table rows
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
                    <strong>
                        ${stock}
                    </strong>
                </td>


                <td>
                    ${minimumStock}
                </td>


                <td>
                    ${escapeHTML(
                        medicine.unit
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