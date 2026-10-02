// =====================================
// CURAMATRIX - MEDICINES
// =====================================


// Get medicines from temporary storage

let medicines =
    JSON.parse(
        localStorage.getItem("curaMatrixMedicines")
    ) || [];


// Elements

const tableBody =
    document.getElementById("medicineTableBody");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");


// =====================================
// DISPLAY MEDICINES
// =====================================

function displayMedicines() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedCategory =
        categoryFilter.value;


    const filteredMedicines =
        medicines.filter(function(medicine) {

            const matchesSearch =
                medicine.medicineName
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                selectedCategory === "" ||
                medicine.category === selectedCategory;

            return matchesSearch && matchesCategory;

        });


    tableBody.innerHTML = "";


    // No medicines

    if (filteredMedicines.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-row">

                    <div class="empty-content">

                        <div class="empty-icon">
                            💊
                        </div>

                        <h3>No medicines found</h3>

                        <p>
                            Add a medicine to see it here.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        updateSummary();

        return;
    }


    // Create rows

    filteredMedicines.forEach(function(medicine, index) {

        const row =
            document.createElement("tr");


        const status =
            getMedicineStatus(medicine);


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>
                <div class="medicine-name">
                    ${escapeHTML(medicine.medicineName)}
                </div>

                <div class="manufacturer">
                    ${escapeHTML(medicine.manufacturer || "Manufacturer not added")}
                </div>
            </td>

            <td>
                ${escapeHTML(medicine.category)}
            </td>

            <td>
                ${escapeHTML(medicine.batchNumber)}
            </td>

            <td>
                ${medicine.stock} ${escapeHTML(medicine.unit)}
            </td>

            <td>
                ₹${Number(medicine.mrp).toFixed(2)}
            </td>

            <td>
                ${formatDate(medicine.expiryDate)}
            </td>

            <td>
                <span class="status ${status.className}">
                    ${status.text}
                </span>
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteMedicine(${medicine.id})"
                    title="Delete Medicine"
                >
                    🗑
                </button>

            </td>
        `;


        tableBody.appendChild(row);

    });


    updateSummary();
}


// =====================================
// MEDICINE STATUS
// =====================================

function getMedicineStatus(medicine) {

    const today =
        new Date();

    const expiry =
        new Date(medicine.expiryDate);


    // Expired

    if (expiry < today) {

        return {
            text: "Expired",
            className: "expired"
        };

    }


    // Low stock

    if (
        Number(medicine.stock) <=
        Number(medicine.minimumStock)
    ) {

        return {
            text: "Low Stock",
            className: "low-stock"
        };

    }


    // In stock

    return {
        text: "In Stock",
        className: "in-stock"
    };
}


// =====================================
// DATE FORMAT
// =====================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// =====================================
// SUMMARY
// =====================================

function updateSummary() {

    const total =
        medicines.length;


    let inStock = 0;
    let lowStock = 0;
    let expired = 0;


    medicines.forEach(function(medicine) {

        const status =
            getMedicineStatus(medicine);


        if (status.className === "in-stock") {
            inStock++;
        }

        else if (status.className === "low-stock") {
            lowStock++;
        }

        else if (status.className === "expired") {
            expired++;
        }

    });


    document.getElementById(
        "totalMedicines"
    ).textContent = total;


    document.getElementById(
        "inStock"
    ).textContent = inStock;


    document.getElementById(
        "lowStock"
    ).textContent = lowStock;


    document.getElementById(
        "expired"
    ).textContent = expired;
}


// =====================================
// DELETE MEDICINE
// =====================================

function deleteMedicine(id) {

    const medicine =
        medicines.find(
            item => item.id === id
        );


    if (!medicine) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete ${medicine.medicineName}?`
        );


    if (!confirmDelete) {
        return;
    }


    medicines =
        medicines.filter(
            item => item.id !== id
        );


    localStorage.setItem(
        "curaMatrixMedicines",
        JSON.stringify(medicines)
    );


    displayMedicines();
}


// =====================================
// SEARCH
// =====================================

searchInput.addEventListener(
    "input",
    displayMedicines
);


// =====================================
// CATEGORY FILTER
// =====================================

categoryFilter.addEventListener(
    "change",
    displayMedicines
);


// =====================================
// DARK MODE
// =====================================

const darkModeBtn =
    document.getElementById("darkModeBtn");


darkModeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");


        const dark =
            document.body.classList.contains("dark");


        localStorage.setItem(
            "curaMatrixDarkMode",
            dark
        );

    }
);


// Load dark mode

if (
    localStorage.getItem(
        "curaMatrixDarkMode"
    ) === "true"
) {

    document.body.classList.add("dark");

}


// =====================================
// LOGOUT
// =====================================

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    function() {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (confirmLogout) {

            localStorage.removeItem(
                "curaMatrixLoggedIn"
            );

            window.location.href =
                "login.html";
        }

    }
);


// =====================================
// BASIC HTML SECURITY
// =====================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================
// INITIAL LOAD
// =====================================

displayMedicines();