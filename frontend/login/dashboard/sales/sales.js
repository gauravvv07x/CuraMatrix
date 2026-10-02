// ==========================================
// CURAMATRIX - SALES MODULE
// MongoDB Connected
// ==========================================

const BILL_API = "http://localhost:5000/api/bills";

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

        const response =
            await fetch(BILL_API);


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load sales."
            );

        }


        bills = data.bills || [];


        // Update total bills
        totalBills.textContent =
            bills.length;


        // Display sales
        renderSales();


    } catch (error) {

        console.error(
            "Sales loading error:",
            error
        );


        totalBills.textContent = "0";


        salesTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-message"
                >

                    Unable to load sales from MongoDB.

                    <br>

                    Make sure backend server is running.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// RENDER SALES TABLE
// ==========================================

function renderSales() {

    const searchText =
        salesSearch.value
            .toLowerCase()
            .trim();


    // Filter bills
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


    // Clear table
    salesTableBody.innerHTML = "";


    // No sales found
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


    // Add sales rows
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