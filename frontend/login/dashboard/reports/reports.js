// ==========================================
// CURAMATRIX - REPORTS MODULE
// MongoDB Connected
// ==========================================

const MEDICINE_API = "http://localhost:5000/api/medicines";
const BILL_API = "http://localhost:5000/api/bills";

let medicines = [];
let bills = [];


// ==========================================
// HTML ELEMENTS
// ==========================================

const totalSales =
    document.getElementById("totalSales");

const totalBills =
    document.getElementById("totalBills");

const itemsSold =
    document.getElementById("itemsSold");

const totalGST =
    document.getElementById("totalGST");

const medicineCount =
    document.getElementById("medicineCount");

const stockUnits =
    document.getElementById("stockUnits");

const lowStockCount =
    document.getElementById("lowStockCount");

const expiredCount =
    document.getElementById("expiredCount");

const stockValue =
    document.getElementById("stockValue");

const recentSalesBody =
    document.getElementById("recentSalesBody");

const topMedicinesBody =
    document.getElementById("topMedicinesBody");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// FORMAT CURRENCY
// ==========================================

function formatCurrency(value) {

    return "₹" +
        Number(value || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

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
// GET EXPIRY STATUS
// ==========================================

function getExpiryStatus(expiryDate) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    const expiry =
        new Date(expiryDate);

    expiry.setHours(0, 0, 0, 0);


    return expiry < today;

}


// ==========================================
// LOAD MEDICINES
// ==========================================

async function loadMedicines() {

    try {

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


        updateStockReport();


    } catch (error) {

        console.error(
            "Medicine report error:",
            error
        );

    }

}


// ==========================================
// UPDATE STOCK REPORT
// ==========================================

function updateStockReport() {

    const totalMedicines =
        medicines.length;


    let totalStockUnits = 0;

    let lowStock = 0;

    let expired = 0;

    let purchaseValue = 0;


    medicines.forEach(
        medicine => {

            const stock =
                Number(
                    medicine.stock || 0
                );


            const minimumStock =
                Number(
                    medicine.minimumStock || 0
                );


            const purchasePrice =
                Number(
                    medicine.purchasePrice || 0
                );


            totalStockUnits += stock;


            if (
                stock <= minimumStock
            ) {

                lowStock++;

            }


            if (
                getExpiryStatus(
                    medicine.expiryDate
                )
            ) {

                expired++;

            }


            purchaseValue +=
                stock * purchasePrice;

        }
    );


    medicineCount.textContent =
        totalMedicines;


    stockUnits.textContent =
        totalStockUnits;


    lowStockCount.textContent =
        lowStock;


    expiredCount.textContent =
        expired;


    stockValue.textContent =
        formatCurrency(
            purchaseValue
        );

}


// ==========================================
// LOAD BILLS
// ==========================================

async function loadBills() {

    try {

        const response =
            await fetch(BILL_API);


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to load bills."
            );

        }


        bills =
            data.bills || [];


        updateSalesSummary();

        renderRecentSales();

        renderTopMedicines();


    } catch (error) {

        console.error(
            "Sales report error:",
            error
        );


        totalSales.textContent =
            "₹0.00";

        totalBills.textContent =
            "0";

        itemsSold.textContent =
            "0";

        totalGST.textContent =
            "₹0.00";


        recentSalesBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;"
                >

                    Unable to load sales data.

                </td>

            </tr>

        `;


        topMedicinesBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;"
                >

                    Unable to load sales data.

                </td>

            </tr>

        `;

    }

}


// ==========================================
// UPDATE SALES SUMMARY
// ==========================================

function updateSalesSummary() {

    let sales = 0;

    let gst = 0;

    let soldItems = 0;


    bills.forEach(
        bill => {

            sales +=
                Number(
                    bill.grandTotal || 0
                );


            gst +=
                Number(
                    bill.totalGST || 0
                );


            if (
                Array.isArray(
                    bill.items
                )
            ) {

                bill.items.forEach(
                    item => {

                        soldItems +=
                            Number(
                                item.quantity || 0
                            );

                    }
                );

            }

        }
    );


    totalSales.textContent =
        formatCurrency(sales);


    totalBills.textContent =
        bills.length;


    itemsSold.textContent =
        soldItems;


    totalGST.textContent =
        formatCurrency(gst);

}


// ==========================================
// RECENT SALES - LAST 7 DAYS
// ==========================================

function renderRecentSales() {

    recentSalesBody.innerHTML = "";


    const today =
        new Date();

    today.setHours(
        23,
        59,
        59,
        999
    );


    const sevenDaysAgo =
        new Date();

    sevenDaysAgo.setDate(
        today.getDate() - 6
    );

    sevenDaysAgo.setHours(
        0,
        0,
        0,
        0
    );


    const dailyData = {};


    bills.forEach(
        bill => {

            const billDate =
                new Date(
                    bill.createdAt
                );


            if (
                billDate < sevenDaysAgo ||
                billDate > today
            ) {

                return;

            }


            const dateKey =
                billDate
                    .toISOString()
                    .split("T")[0];


            if (
                !dailyData[dateKey]
            ) {

                dailyData[dateKey] = {

                    bills: 0,

                    items: 0,

                    sales: 0

                };

            }


            dailyData[dateKey].bills++;


            dailyData[dateKey].sales +=
                Number(
                    bill.grandTotal || 0
                );


            if (
                Array.isArray(
                    bill.items
                )
            ) {

                bill.items.forEach(
                    item => {

                        dailyData[dateKey].items +=
                            Number(
                                item.quantity || 0
                            );

                    }
                );

            }

        }
    );


    const dates = [];


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(
                sevenDaysAgo
            );


        date.setDate(
            sevenDaysAgo.getDate() + i
        );


        const key =
            date
                .toISOString()
                .split("T")[0];


        dates.push(key);

    }


    dates.reverse();


    dates.forEach(
        dateKey => {

            const data =
                dailyData[dateKey] ||
                {
                    bills: 0,
                    items: 0,
                    sales: 0
                };


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${formatDate(dateKey)}
                </td>

                <td>
                    ${data.bills}
                </td>

                <td>
                    ${data.items}
                </td>

                <td>
                    ${formatCurrency(
                        data.sales
                    )}
                </td>

            `;


            recentSalesBody.appendChild(
                row
            );

        }
    );

}


// ==========================================
// TOP SELLING MEDICINES
// ==========================================

function renderTopMedicines() {

    topMedicinesBody.innerHTML = "";


    const medicineSales = {};


    bills.forEach(
        bill => {

            if (
                !Array.isArray(
                    bill.items
                )
            ) {

                return;

            }


            bill.items.forEach(
                item => {

                    const id =
                        item.medicineId ||
                        item.medicineName;


                    if (
                        !medicineSales[id]
                    ) {

                        medicineSales[id] = {

                            name:
                                item.medicineName,

                            quantity: 0,

                            amount: 0

                        };

                    }


                    const quantity =
                        Number(
                            item.quantity || 0
                        );


                    const price =
                        Number(
                            item.price || 0
                        );


                    medicineSales[id].quantity +=
                        quantity;


                    medicineSales[id].amount +=
                        quantity * price;

                }
            );

        }
    );


    const topMedicines =
        Object.values(
            medicineSales
        )
        .sort(
            (a, b) =>
                b.quantity -
                a.quantity
        )
        .slice(0, 10);


    if (
        topMedicines.length === 0
    ) {

        topMedicinesBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;"
                >

                    No sales data available.

                </td>

            </tr>

        `;

        return;

    }


    topMedicines.forEach(
        (medicine, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(
                        medicine.name
                    )}
                </td>

                <td>
                    ${medicine.quantity}
                </td>

                <td>
                    ${formatCurrency(
                        medicine.amount
                    )}
                </td>

            `;


            topMedicinesBody.appendChild(
                row
            );

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
// INITIAL LOAD
// ==========================================

async function loadReports() {

    await Promise.all([
        loadMedicines(),
        loadBills()
    ]);

}


loadReports();