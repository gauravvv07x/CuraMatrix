const MEDICINE_API =
    "https://curamatrix-backend.onrender.com/api/medicines";

const BILL_API =
    "https://curamatrix-backend.onrender.com/api/bills";


let medicines = [];
let bills = [];


const $ = (id) =>
    document.getElementById(id);


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function money(value) {

    return `₹${Number(value || 0).toFixed(2)}`;

}


function getDate(value) {

    const date = new Date(value);

    return isNaN(date)
        ? null
        : date;

}


async function getData(url) {

    const response = await fetch(
        url + "?t=" + Date.now(),
        {
            method: "GET",
            cache: "no-store",
            headers: {
                "Accept": "application/json"
            }
        }
    );


    const data =
        await response.json();


    if (
        !response.ok ||
        data.success !== true
    ) {

        throw new Error(
            data.message ||
            `Request failed: ${response.status}`
        );

    }


    return data;

}


async function loadReports() {

    try {

        $("refreshBtn").disabled = true;

        $("refreshBtn").textContent =
            "⏳ Loading...";


        const [
            medicineData,
            billData
        ] = await Promise.all([

            getData(MEDICINE_API),

            getData(BILL_API)

        ]);


        medicines =
            Array.isArray(
                medicineData.medicines
            )
                ? medicineData.medicines
                : [];


        bills =
            Array.isArray(
                billData.bills
            )
                ? billData.bills
                : [];


        renderReports();


    } catch (error) {

        console.error(
            "Reports Error:",
            error
        );


        $("reportMessage").textContent =
            "Unable to load reports: " +
            error.message;


        $("recentSalesBody").innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty"
                >
                    Unable to load sales data
                </td>
            </tr>
        `;


        $("topMedicinesBody").innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="empty"
                >
                    Unable to load medicine data
                </td>
            </tr>
        `;


    } finally {

        $("refreshBtn").disabled = false;

        $("refreshBtn").textContent =
            "🔄 Refresh";

    }

}


function renderReports() {


    const totalSales =
        bills.reduce(
            (sum, bill) =>
                sum +
                Number(
                    bill.grandTotal || 0
                ),
            0
        );


    const totalGST =
        bills.reduce(
            (sum, bill) =>
                sum +
                Number(
                    bill.totalGST || 0
                ),
            0
        );


    const totalItems =
        bills.reduce(
            (sum, bill) => {

                const items =
                    Array.isArray(
                        bill.items
                    )
                        ? bill.items
                        : [];


                return sum +
                    items.reduce(
                        (
                            itemSum,
                            item
                        ) =>
                            itemSum +
                            Number(
                                item.quantity || 0
                            ),
                        0
                    );

            },
            0
        );


    const stockUnits =
        medicines.reduce(
            (sum, medicine) =>
                sum +
                Number(
                    medicine.stock || 0
                ),
            0
        );


    const lowStock =
        medicines.filter(
            (medicine) =>
                Number(
                    medicine.stock || 0
                ) <=
                Number(
                    medicine.minimumStock || 0
                )
        ).length;


    const expired =
        medicines.filter(
            (medicine) => {

                const expiry =
                    getDate(
                        medicine.expiryDate
                    );


                if (!expiry) {
                    return false;
                }


                const today =
                    new Date();

                today.setHours(
                    0,
                    0,
                    0,
                    0
                );


                expiry.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return expiry < today;

            }
        ).length;


    const purchaseValue =
        medicines.reduce(
            (sum, medicine) =>
                sum +
                (
                    Number(
                        medicine.stock || 0
                    ) *
                    Number(
                        medicine.purchasePrice || 0
                    )
                ),
            0
        );


    $("totalSales").textContent =
        money(totalSales);


    $("totalBills").textContent =
        bills.length;


    $("totalItems").textContent =
        totalItems;


    $("totalGST").textContent =
        money(totalGST);


    $("medicineCount").textContent =
        medicines.length;


    $("stockUnits").textContent =
        stockUnits;


    $("lowStock").textContent =
        lowStock;


    $("expired").textContent =
        expired;


    $("purchaseValue").textContent =
        money(purchaseValue);


    renderRecentSales();

    renderTopMedicines();


    $("reportMessage").textContent =
        `Loaded ${medicines.length} medicines and ${bills.length} bills from database.`;

}


function renderRecentSales() {


    const recentSales =
        [...bills]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            )
            .slice(0, 10);


    if (recentSales.length === 0) {

        $("recentSalesBody").innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty"
                >
                    No sales found
                </td>
            </tr>
        `;

        return;

    }


    $("recentSalesBody").innerHTML =
        recentSales.map(
            (bill) => {

                const date =
                    getDate(
                        bill.createdAt
                    );


                const formattedDate =
                    date
                        ? date.toLocaleDateString(
                            "en-IN"
                        )
                        : "-";


                return `
                    <tr>

                        <td>
                            ${escapeHTML(
                                bill.billId
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                bill.customerName
                            )}
                        </td>

                        <td>
                            ${formattedDate}
                        </td>

                        <td>
                            ${money(
                                bill.grandTotal
                            )}
                        </td>

                    </tr>
                `;

            }
        ).join("");

}


function renderTopMedicines() {


    const quantityMap = {};


    bills.forEach(
        (bill) => {

            const items =
                Array.isArray(
                    bill.items
                )
                    ? bill.items
                    : [];


            items.forEach(
                (item) => {

                    const name =
                        item.medicineName ||
                        "Unknown";


                    if (
                        !quantityMap[name]
                    ) {

                        quantityMap[name] =
                            0;

                    }


                    quantityMap[name] +=
                        Number(
                            item.quantity || 0
                        );

                }
            );

        }
    );


    const topMedicines =
        Object.entries(
            quantityMap
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 10);


    if (topMedicines.length === 0) {

        $("topMedicinesBody").innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="empty"
                >
                    No sales data found
                </td>
            </tr>
        `;

        return;

    }


    $("topMedicinesBody").innerHTML =
        topMedicines.map(
            (item, index) => {

                return `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${escapeHTML(
                                item[0]
                            )}
                        </td>

                        <td>
                            ${item[1]}
                        </td>

                    </tr>
                `;

            }
        ).join("");

}


$("refreshBtn").addEventListener(
    "click",
    loadReports
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


loadReports();