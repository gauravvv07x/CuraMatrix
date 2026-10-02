// ==========================================
// CURAMATRIX - SALES MODULE
// MongoDB Connected - Render Backend
// ==========================================

const API_URL =
    "https://curamatrix-backend.onrender.com/api/bills";

let bills = [];


// ==========================================
// HTML ELEMENTS
// ==========================================

const salesTableBody =
    document.getElementById("salesTableBody");

const salesSearch =
    document.getElementById("salesSearch");

const totalBills =
    document.getElementById("totalBills");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(value) {

    return `₹${Number(value || 0).toFixed(2)}`;

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// ==========================================
// LOAD SALES FROM MONGODB
// ==========================================

async function loadSales() {

    try {

        console.log("Loading sales from:", API_URL);

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        console.log("Sales API response:", data);


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load sales."
            );

        }


        bills =
            Array.isArray(data.bills)
                ? data.bills
                : [];


        // Update total bills
        if (totalBills) {

            totalBills.textContent =
                bills.length;

        }


        // Display sales
        renderSales();


    } catch (error) {

        console.error(
            "Sales loading error:",
            error
        );


        if (totalBills) {

            totalBills.textContent =
                "0";

        }


        if (salesTableBody) {

            salesTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty-message"
                    >

                        Unable to load sales from MongoDB.

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
// RENDER SALES TABLE
// ==========================================

function renderSales() {

    if (!salesTableBody) {
        return;
    }


    const searchText =
        salesSearch
            ? salesSearch.value
                .toLowerCase()
                .trim()
            : "";


    // ======================================
    // FILTER BILLS
    // ======================================

    const filteredBills =
        bills.filter(bill => {

            const billId =
                String(
                    bill.billId || ""
                ).toLowerCase();


            const customerName =
                String(
                    bill.customerName || ""
                ).toLowerCase();


            return (
                billId.includes(searchText) ||
                customerName.includes(searchText)
            );

        });


    // ======================================
    // CLEAR TABLE
    // ======================================

    salesTableBody.innerHTML = "";


    // ======================================
    // NO SALES FOUND
    // ======================================

    if (filteredBills.length === 0) {

        salesTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-message"
                >

                    No sales found.

                </td>

            </tr>

        `;

        return;

    }


    // ======================================
    // ADD SALES ROWS
    // ======================================

    filteredBills.forEach(
        (bill, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            bill.billId || "-"
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        bill.customerName || "-"
                    )}
                </td>

                <td>
                    ${formatDate(
                        bill.createdAt
                    )}
                </td>

                <td>
                    <strong>
                        ${formatCurrency(
                            bill.grandTotal
                        )}
                    </strong>
                </td>

            `;


            salesTableBody.appendChild(row);

        }
    );

}


// ==========================================
// SEARCH SALES
// ==========================================

if (salesSearch) {

    salesSearch.addEventListener(
        "input",
        renderSales
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

loadSales();