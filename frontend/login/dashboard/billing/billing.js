// ==========================================
// CURAMATRIX - BILLING JAVASCRIPT
// SAVE BILL + SEPARATE PRINT BILL
// ==========================================

const MEDICINE_API = "http://localhost:5000/api/medicines";
const BILL_API = "http://localhost:5000/api/bills";

const SHOP_SETTINGS_KEY = "curaMatrixShopSettings";

let medicines = [];
let billItems = [];

let savedBillData = null;


// ==========================================
// DOM ELEMENTS
// ==========================================

const customerNameInput =
    document.getElementById("customerName");

const customerMobileInput =
    document.getElementById("customerMobile");

const billNumberInput =
    document.getElementById("billNumber");

const billDateInput =
    document.getElementById("billDate");

const medicineSelect =
    document.getElementById("medicineSelect");

const quantityInput =
    document.getElementById("quantity");

const gstSelect =
    document.getElementById("gst");

const addToBillBtn =
    document.getElementById("addToBillBtn");

const billItemsBody =
    document.getElementById("billItemsBody");

const subtotalElement =
    document.getElementById("subtotal");

const gstAmountElement =
    document.getElementById("gstAmount");

const grandTotalElement =
    document.getElementById("grandTotal");

const clearBillBtn =
    document.getElementById("clearBillBtn");

const saveBillBtn =
    document.getElementById("saveBillBtn");

const printBillBtn =
    document.getElementById("printBillBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const darkModeBtn =
    document.getElementById("darkModeBtn");


// ==========================================
// PAGE INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    setNewBillHeader();

    loadMedicines();

    if (addToBillBtn) {
        addToBillBtn.addEventListener(
            "click",
            addMedicineToBill
        );
    }

    if (clearBillBtn) {
        clearBillBtn.addEventListener(
            "click",
            clearBill
        );
    }

    if (saveBillBtn) {
        saveBillBtn.addEventListener(
            "click",
            saveBill
        );
    }

    if (printBillBtn) {
        printBillBtn.addEventListener(
            "click",
            printBill
        );
    }

    if (medicineSelect) {
        medicineSelect.addEventListener(
            "change",
            updateGST
        );
    }

    // ======================================
    // LOGOUT
    // ======================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

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


    // ======================================
    // DARK MODE
    // ======================================

    if (darkModeBtn) {

        darkModeBtn.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );

                const isDark =
                    document.body.classList.contains(
                        "dark-mode"
                    );

                localStorage.setItem(
                    "curaMatrixDarkMode",
                    isDark ? "true" : "false"
                );
            }
        );


        if (
            localStorage.getItem(
                "curaMatrixDarkMode"
            ) === "true"
        ) {

            document.body.classList.add(
                "dark-mode"
            );
        }
    }


    renderBill();
});


// ==========================================
// SET NEW BILL NUMBER AND DATE
// ==========================================

function setNewBillHeader() {

    if (billNumberInput) {

        billNumberInput.value =
            "CM-" + Date.now();
    }


    if (billDateInput) {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        billDateInput.value =
            `${year}-${month}-${day}`;
    }
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


        if (!data.success) {

            throw new Error(
                data.message ||
                "Unable to load medicines."
            );
        }


        medicines =
            data.medicines || [];


        populateMedicineDropdown();

    } catch (error) {

        console.error(
            "Load medicines error:",
            error
        );

        alert(
            "Unable to load medicines from MongoDB.\n" +
            "Make sure the backend server is running."
        );
    }
}


// ==========================================
// POPULATE MEDICINE DROPDOWN
// ==========================================

function populateMedicineDropdown() {

    if (!medicineSelect) return;


    medicineSelect.innerHTML = "";


    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Select medicine";

    medicineSelect.appendChild(
        defaultOption
    );


    medicines.forEach(
        medicine => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                medicine._id;

            option.textContent =
                `${medicine.medicineName} | Batch: ${medicine.batchNumber} | Stock: ${medicine.stock}`;

            medicineSelect.appendChild(
                option
            );
        }
    );
}


// ==========================================
// UPDATE GST
// ==========================================

function updateGST() {

    const medicineId =
        medicineSelect.value;


    if (!medicineId) {

        gstSelect.value = "";

        return;
    }


    const medicine =
        medicines.find(
            item =>
                item._id === medicineId
        );


    if (!medicine) return;


    const gstValue =
        String(
            medicine.gst
        );


    let exists = false;


    for (
        const option
        of gstSelect.options
    ) {

        if (
            option.value ===
            gstValue
        ) {

            exists = true;

            break;
        }
    }


    if (!exists) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            gstValue;

        option.textContent =
            gstValue + "%";

        gstSelect.appendChild(
            option
        );
    }


    gstSelect.value =
        gstValue;
}


// ==========================================
// ADD MEDICINE TO BILL
// ==========================================

function addMedicineToBill() {

    const medicineId =
        medicineSelect.value;

    const quantity =
        Number(
            quantityInput.value
        );


    if (!medicineId) {

        alert(
            "Please select a medicine."
        );

        return;
    }


    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Please enter a valid quantity."
        );

        return;
    }


    const medicine =
        medicines.find(
            item =>
                item._id === medicineId
        );


    if (!medicine) {

        alert(
            "Medicine not found."
        );

        return;
    }


    const existingItem =
        billItems.find(
            item =>
                item.medicineId ===
                medicineId
        );


    const alreadyAddedQuantity =
        existingItem
            ? existingItem.quantity
            : 0;


    const remainingStock =
        Number(medicine.stock) -
        alreadyAddedQuantity;


    if (
        quantity >
        remainingStock
    ) {

        alert(
            `Only ${remainingStock} units available for ${medicine.medicineName}.`
        );

        return;
    }


    if (existingItem) {

        existingItem.quantity +=
            quantity;

    } else {

        billItems.push({

            medicineId:
                medicine._id,

            medicineName:
                medicine.medicineName,

            batchNumber:
                medicine.batchNumber,

            quantity:
                quantity,

            price:
                Number(
                    medicine.sellingPrice
                ),

            gst:
                Number(
                    medicine.gst
                ) || 0
        });
    }


    // New changes mean previous
    // saved bill is no longer current.

    savedBillData = null;


    renderBill();


    medicineSelect.value = "";

    quantityInput.value = 1;

    gstSelect.value = "";
}


// ==========================================
// REMOVE ITEM
// ==========================================

function removeItem(medicineId) {

    billItems =
        billItems.filter(
            item =>
                item.medicineId !==
                medicineId
        );


    savedBillData = null;

    renderBill();
}


// ==========================================
// RENDER BILL
// ==========================================

function renderBill() {

    if (!billItemsBody) return;


    billItemsBody.innerHTML = "";


    let subtotal = 0;

    let totalGST = 0;


    if (billItems.length === 0) {

        const row =
            document.createElement(
                "tr"
            );

        row.innerHTML = `

            <td
                colspan="8"
                style="text-align:center;padding:20px;"
            >
                No medicines added to bill
            </td>

        `;

        billItemsBody.appendChild(
            row
        );

    } else {

        billItems.forEach(
            (item, index) => {

                const itemSubtotal =
                    item.price *
                    item.quantity;


                const itemGST =
                    itemSubtotal *
                    item.gst /
                    100;


                const itemTotal =
                    itemSubtotal +
                    itemGST;


                subtotal +=
                    itemSubtotal;


                totalGST +=
                    itemGST;


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.medicineName
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.batchNumber
                        )}
                    </td>

                    <td>
                        ${item.quantity}
                    </td>

                    <td>
                        ₹${item.price.toFixed(2)}
                    </td>

                    <td>
                        ${item.gst}%
                    </td>

                    <td>
                        ₹${itemTotal.toFixed(2)}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="remove-item-btn"
                            onclick="removeItem('${item.medicineId}')"
                        >
                            Remove
                        </button>

                    </td>
                `;


                billItemsBody.appendChild(
                    row
                );
            }
        );
    }


    const grandTotal =
        subtotal +
        totalGST;


    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${subtotal.toFixed(2)}`;
    }


    if (gstAmountElement) {

        gstAmountElement.textContent =
            `₹${totalGST.toFixed(2)}`;
    }


    if (grandTotalElement) {

        grandTotalElement.textContent =
            `₹${grandTotal.toFixed(2)}`;
    }
}


// ==========================================
// CLEAR BILL
// ==========================================

function clearBill() {

    const confirmed =
        confirm(
            "Are you sure you want to clear this bill?"
        );


    if (!confirmed) return;


    billItems = [];

    savedBillData = null;


    if (customerNameInput) {
        customerNameInput.value = "";
    }


    if (customerMobileInput) {
        customerMobileInput.value = "";
    }


    if (medicineSelect) {
        medicineSelect.value = "";
    }


    if (quantityInput) {
        quantityInput.value = 1;
    }


    if (gstSelect) {
        gstSelect.value = "";
    }


    setNewBillHeader();

    renderBill();
}


// ==========================================
// GET SHOP SETTINGS
// ==========================================

function getShopSettings() {

    const defaultSettings = {

        shopName:
            "CuraMatrix Medical Store",

        ownerName:
            "",

        shopMobile:
            "",

        shopEmail:
            "",

        gstNumber:
            "",

        shopAddress:
            "",

        showGST:
            true,

        showAddress:
            true
    };


    try {

        const saved =
            localStorage.getItem(
                SHOP_SETTINGS_KEY
            );


        if (!saved) {

            return defaultSettings;
        }


        return {
            ...defaultSettings,
            ...JSON.parse(saved)
        };

    } catch (error) {

        console.error(
            "Shop settings error:",
            error
        );

        return defaultSettings;
    }
}


// ==========================================
// SAVE BILL
// ==========================================
// IMPORTANT:
// This function ONLY saves the bill.
// It does NOT print.
// ==========================================

async function saveBill() {

    const customerName =
        customerNameInput.value.trim();

    const customerMobile =
        customerMobileInput.value.trim();


    if (!customerName) {

        alert(
            "Please enter customer name."
        );

        customerNameInput.focus();

        return;
    }


    if (billItems.length === 0) {

        alert(
            "Please add at least one medicine."
        );

        return;
    }


    try {

        saveBillBtn.disabled = true;

        saveBillBtn.textContent =
            "Saving...";


        const items =
            billItems.map(
                item => ({

                    medicineId:
                        item.medicineId,

                    medicineName:
                        item.medicineName,

                    quantity:
                        item.quantity
                })
            );


        const response =
            await fetch(
                BILL_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            customerName:
                                customerName,

                            customerMobile:
                                customerMobile,

                            items:
                                items
                        })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to save bill."
            );
        }


        // Store the MongoDB bill response.
        savedBillData =
            data.bill;


        // Use the actual bill number
        // generated by backend.

        if (
            savedBillData &&
            savedBillData.billId
        ) {

            billNumberInput.value =
                savedBillData.billId;
        }


        alert(
            `Bill saved successfully.\nBill No: ${savedBillData.billId}`
        );


        // Reload medicines because
        // stock has changed.

        await loadMedicines();


        // Clear current bill after save.

        billItems = [];

        renderBill();

        setNewBillHeader();


    } catch (error) {

        console.error(
            "Save bill error:",
            error
        );

        alert(
            error.message ||
            "Unable to save bill."
        );

    } finally {

        saveBillBtn.disabled = false;

        saveBillBtn.textContent =
            "Save Bill";
    }
}


// ==========================================
// PRINT BILL
// ==========================================
// IMPORTANT:
// This function ONLY prints.
// It does NOT save to MongoDB.
// ==========================================

function printBill() {

    // --------------------------------------
    // First check if a bill is available.
    // --------------------------------------

    if (
        !savedBillData
    ) {

        alert(
            "Please save the bill first, then click Print Bill."
        );

        return;
    }


    const shop =
        getShopSettings();


    const bill =
        savedBillData;


    const customerName =
        bill.customerName ||
        customerNameInput.value.trim();


    const customerMobile =
        bill.customerMobile ||
        customerMobileInput.value.trim();


    const items =
        bill.items &&
        bill.items.length
            ? bill.items
            : billItems;


    if (
        !items ||
        items.length === 0
    ) {

        alert(
            "There are no items available for printing."
        );

        return;
    }


    const billId =
        bill.billId ||
        billNumberInput.value;


    const billDate =
        bill.createdAt
            ? formatDate(
                bill.createdAt
            )
            : formatDate(
                billDateInput.value
            );


    // --------------------------------------
    // Create print window
    // --------------------------------------

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=420,height=750"
        );


    if (!printWindow) {

        alert(
            "Print window was blocked.\n" +
            "Please allow pop-ups for CuraMatrix."
        );

        return;
    }


    // --------------------------------------
    // Calculate totals
    // --------------------------------------

    let subtotal = 0;

    let totalGST = 0;


    items.forEach(
        item => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;

            const gst =
                Number(item.gst) || 0;


            const itemSubtotal =
                price * quantity;


            const itemGST =
                itemSubtotal *
                gst /
                100;


            subtotal +=
                itemSubtotal;


            totalGST +=
                itemGST;
        }
    );


    // Prefer totals saved by backend.

    if (
        typeof bill.subtotal ===
        "number"
    ) {

        subtotal =
            bill.subtotal;
    }


    if (
        typeof bill.totalGST ===
        "number"
    ) {

        totalGST =
            bill.totalGST;
    }


    let grandTotal =
        subtotal +
        totalGST;


    if (
        typeof bill.grandTotal ===
        "number"
    ) {

        grandTotal =
            bill.grandTotal;
    }


    // --------------------------------------
    // Shop information
    // --------------------------------------

    let shopInfoHTML = "";


    if (shop.ownerName) {

        shopInfoHTML += `
            <div>
                Owner:
                ${escapeHTML(
                    shop.ownerName
                )}
            </div>
        `;
    }


    if (shop.shopMobile) {

        shopInfoHTML += `
            <div>
                Mobile:
                ${escapeHTML(
                    shop.shopMobile
                )}
            </div>
        `;
    }


    if (shop.shopEmail) {

        shopInfoHTML += `
            <div>
                ${escapeHTML(
                    shop.shopEmail
                )}
            </div>
        `;
    }


    if (
        shop.showAddress &&
        shop.shopAddress
    ) {

        shopInfoHTML += `
            <div class="address">
                ${escapeHTML(
                    shop.shopAddress
                )}
            </div>
        `;
    }


    if (
        shop.showGST &&
        shop.gstNumber
    ) {

        shopInfoHTML += `
            <div>
                GSTIN:
                ${escapeHTML(
                    shop.gstNumber
                )}
            </div>
        `;
    }


    // --------------------------------------
    // Medicine rows
    // --------------------------------------

    let itemsHTML = "";


    items.forEach(
        (item, index) => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;

            const gst =
                Number(item.gst) || 0;


            const itemSubtotal =
                price * quantity;


            const itemGST =
                itemSubtotal *
                gst /
                100;


            const itemTotal =
                itemSubtotal +
                itemGST;


            itemsHTML += `

                <tr>

                    <td class="number">
                        ${index + 1}
                    </td>

                    <td class="medicine">

                        <strong>
                            ${escapeHTML(
                                item.medicineName ||
                                "Medicine"
                            )}
                        </strong>

                        <small>
                            Batch:
                            ${escapeHTML(
                                item.batchNumber ||
                                "-"
                            )}
                        </small>

                    </td>

                    <td class="qty">
                        ${quantity}
                    </td>

                    <td class="rate">
                        ₹${price.toFixed(2)}
                    </td>

                    <td class="amount">
                        ₹${itemTotal.toFixed(2)}
                    </td>

                </tr>

                <tr class="gst-row">

                    <td></td>

                    <td colspan="4">
                        GST ${gst}%
                    </td>

                </tr>

            `;
        }
    );


    // --------------------------------------
    // Write print page
    // --------------------------------------

    printWindow.document.open();


    printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>
        ${escapeHTML(billId)}
    </title>


    <style>

        * {
            box-sizing: border-box;
        }


        html,
        body {

            margin: 0;

            padding: 0;

            width: 80mm;

            background: #ffffff;

            color: #000000;
        }


        body {

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            font-size: 10px;
        }


        .bill {

            width: 80mm;

            padding: 4mm;

            margin: 0;
        }


        .shop-header {

            text-align: center;

            padding-bottom: 3mm;

            margin-bottom: 3mm;

            border-bottom:
                1px dashed #000;
        }


        .shop-name {

            font-size: 18px;

            font-weight: bold;

            margin-bottom: 2mm;
        }


        .shop-info {

            font-size: 9px;

            line-height: 1.5;

            word-break: break-word;
        }


        .address {

            margin-top: 1mm;
        }


        .bill-title {

            text-align: center;

            font-size: 14px;

            font-weight: bold;

            margin:
                2mm 0;
        }


        .bill-info {

            padding-bottom: 2mm;

            margin-bottom: 2mm;

            border-bottom:
                1px dashed #000;
        }


        .bill-info-row {

            display: flex;

            justify-content:
                space-between;

            gap: 5px;
        }


        .customer {

            line-height: 1.6;

            margin-bottom: 3mm;
        }


        table {

            width: 100%;

            border-collapse:
                collapse;

            table-layout:
                fixed;
        }


        th {

            padding:
                2mm
                0.5mm;

            border-top:
                1px solid #000;

            border-bottom:
                1px solid #000;

            font-size: 8px;

            text-align: left;
        }


        td {

            padding:
                1.5mm
                0.5mm;

            vertical-align:
                top;

            font-size: 8px;
        }


        .number {

            width: 6%;

            text-align:
                center;
        }


        .medicine {

            width: 38%;
        }


        .medicine strong {

            display: block;

            font-size: 8px;
        }


        .medicine small {

            display: block;

            font-size: 7px;

            margin-top: 1mm;
        }


        .qty {

            width: 11%;

            text-align:
                center;
        }


        .rate {

            width: 20%;

            text-align:
                right;
        }


        .amount {

            width: 25%;

            text-align:
                right;
        }


        .gst-row td {

            padding-top: 0;

            padding-bottom: 1.5mm;

            font-size: 7px;

            font-style: italic;
        }


        .summary {

            border-top:
                1px dashed #000;

            margin-top: 2mm;

            padding-top: 2mm;
        }


        .summary-row {

            display: flex;

            justify-content:
                space-between;

            padding: 1mm 0;
        }


        .grand-total {

            border-top:
                1px solid #000;

            margin-top: 1mm;

            padding-top: 2mm;

            font-size: 13px;

            font-weight: bold;
        }


        .footer {

            text-align: center;

            border-top:
                1px dashed #000;

            margin-top: 4mm;

            padding-top: 3mm;

            font-size: 9px;

            line-height: 1.5;
        }


        @page {

            size: 80mm auto;

            margin: 0;
        }


        @media print {

            html,
            body {

                width: 80mm;

                margin: 0;

                padding: 0;
            }


            .bill {

                width: 80mm;

                margin: 0;

                padding: 4mm;
            }
        }

    </style>

</head>


<body>

    <div class="bill">


        <!-- SHOP INFORMATION -->

        <div class="shop-header">

            <div class="shop-name">

                ${escapeHTML(
                    shop.shopName ||
                    "CuraMatrix Medical Store"
                )}

            </div>


            <div class="shop-info">

                ${shopInfoHTML}

            </div>

        </div>


        <!-- BILL TITLE -->

        <div class="bill-title">

            TAX INVOICE / BILL

        </div>


        <!-- BILL INFORMATION -->

        <div class="bill-info">

            <div class="bill-info-row">

                <span>

                    <strong>
                        Bill No:
                    </strong>

                    ${escapeHTML(
                        billId
                    )}

                </span>


                <span>

                    <strong>
                        Date:
                    </strong>

                    ${escapeHTML(
                        billDate
                    )}

                </span>

            </div>

        </div>


        <!-- CUSTOMER -->

        <div class="customer">

            <div>

                <strong>
                    Customer:
                </strong>

                ${escapeHTML(
                    customerName
                )}

            </div>


            ${
                customerMobile
                    ? `
                        <div>

                            <strong>
                                Mobile:
                            </strong>

                            ${escapeHTML(
                                customerMobile
                            )}

                        </div>
                    `
                    : ""
            }

        </div>


        <!-- ITEMS -->

        <table>

            <thead>

                <tr>

                    <th class="number">
                        #
                    </th>

                    <th class="medicine">
                        Medicine
                    </th>

                    <th class="qty">
                        Qty
                    </th>

                    <th class="rate">
                        Rate
                    </th>

                    <th class="amount">
                        Amount
                    </th>

                </tr>

            </thead>


            <tbody>

                ${itemsHTML}

            </tbody>

        </table>


        <!-- TOTALS -->

        <div class="summary">

            <div class="summary-row">

                <span>
                    Subtotal
                </span>

                <span>
                    ₹${subtotal.toFixed(2)}
                </span>

            </div>


            <div class="summary-row">

                <span>
                    GST
                </span>

                <span>
                    ₹${totalGST.toFixed(2)}
                </span>

            </div>


            <div class="summary-row grand-total">

                <span>
                    Grand Total
                </span>

                <span>
                    ₹${grandTotal.toFixed(2)}
                </span>

            </div>

        </div>


        <!-- FOOTER -->

        <div class="footer">

            <div>
                Thank you for your visit!
            </div>

            <div>
                Powered by CuraMatrix
            </div>

        </div>


    </div>


    <script>

        window.onload = function () {

            setTimeout(
                function () {

                    window.print();

                },
                300
            );

        };


        window.onafterprint = function () {

            setTimeout(
                function () {

                    window.close();

                },
                300
            );

        };

    <\/script>

</body>

</html>

    `);


    printWindow.document.close();
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateValue) {

    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            dateValue
        );
    }


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const year =
        date.getFullYear();


    return `${day}/${month}/${year}`;
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
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