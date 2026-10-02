// =====================================================
// CURAMATRIX - ADD MEDICINE
// =====================================================

const API_URL = "http://localhost:5000/api/medicines";

const medicineForm =
    document.getElementById("medicineForm");


// =====================================================
// ADD MEDICINE
// =====================================================

if (medicineForm) {

    medicineForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =================================================
            // GET FORM VALUES
            // =================================================

            const medicineName =
                document.getElementById("medicineName").value.trim();

            const category =
                document.getElementById("category").value;

            const manufacturer =
                document.getElementById("manufacturer").value.trim();

            const batchNumber =
                document.getElementById("batchNumber").value.trim();

            const stock =
                Number(document.getElementById("stock").value);

            const minimumStock =
                Number(document.getElementById("minimumStock").value);

            const expiryDate =
                document.getElementById("expiryDate").value;

            const unit =
                document.getElementById("unit").value;

            const mrp =
                Number(document.getElementById("mrp").value);

            const sellingPrice =
                Number(document.getElementById("sellingPrice").value);

            const purchasePrice =
                Number(document.getElementById("purchasePrice").value) || 0;

            const gst =
                Number(document.getElementById("gst").value);

            const description =
                document.getElementById("description").value.trim();


            // =================================================
            // FRONTEND VALIDATION
            // =================================================

            if (sellingPrice > mrp) {

                alert(
                    "Selling Price cannot be greater than MRP."
                );

                return;
            }


            if (minimumStock > stock) {

                const proceed =
                    confirm(
                        "Minimum stock level is greater than current stock. Continue?"
                    );

                if (!proceed) {
                    return;
                }
            }


            // =================================================
            // CREATE DATA
            // =================================================

            const medicineData = {

                medicineName,
                category,
                manufacturer,
                batchNumber,

                stock,

                minimumStock,

                expiryDate,

                unit,

                mrp,

                sellingPrice,

                purchasePrice,

                gst,

                description

            };


            // =================================================
            // DISABLE SUBMIT BUTTON
            // =================================================

            const submitButton =
                medicineForm.querySelector(
                    'button[type="submit"]'
                );

            let originalText = "";

            if (submitButton) {

                originalText =
                    submitButton.textContent;

                submitButton.disabled = true;

                submitButton.textContent =
                    "Saving...";
            }


            // =================================================
            // SEND TO BACKEND
            // =================================================

            try {

                const response =
                    await fetch(API_URL, {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                medicineData
                            )

                    });


                const data =
                    await response.json();


                // =================================================
                // ERROR
                // =================================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    alert(
                        data.message ||
                        "Unable to add medicine."
                    );

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalText;
                    }

                    return;
                }


                // =================================================
                // SUCCESS
                // =================================================

                alert(
                    "Medicine added successfully!"
                );


                medicineForm.reset();


                // =================================================
                // GO TO MEDICINES
                // =================================================

                window.location.href =
                    "../medicines/medicines.html";

            }

            catch (error) {

                console.error(
                    "Add medicine error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalText;
                }

            }

        }
    );

}


// =====================================================
// DARK MODE
// =====================================================

const darkModeBtn =
    document.getElementById("darkModeBtn");

if (darkModeBtn) {

    darkModeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle("dark");

            const dark =
                document.body.classList.contains("dark");

            localStorage.setItem(
                "curaMatrixDarkMode",
                dark
            );

        }
    );

}


if (
    localStorage.getItem(
        "curaMatrixDarkMode"
    ) === "true"
) {

    document.body.classList.add("dark");

}


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById("logoutBtn");

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