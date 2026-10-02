const express = require("express");

const Bill = require("../models/Bill");
const Medicine = require("../models/Medicine");

const router = express.Router();


// =====================================================
// GET ALL BILLS
// =====================================================

router.get("/", async (req, res) => {

    try {

        const bills =
            await Bill.find()
                .sort({ createdAt: -1 });

        res.json({
            success: true,
            bills: bills
        });

    }

    catch (error) {

        console.error(
            "Get bills error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while fetching bills."
        });

    }

});


// =====================================================
// CREATE BILL
// =====================================================

router.post("/", async (req, res) => {

    try {

        const {
            customerName,
            customerMobile,
            items
        } = req.body;


        // =============================================
        // VALIDATION
        // =============================================

        if (!customerName) {

            return res.status(400).json({
                success: false,
                message: "Customer name is required."
            });

        }


        if (
            !items ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Please add at least one medicine."
            });

        }


        let subtotal = 0;
        let totalGST = 0;

        const billItems = [];


        // =============================================
        // CHECK MEDICINES AND STOCK
        // =============================================

        for (const item of items) {

            const medicine =
                await Medicine.findById(
                    item.medicineId
                );


            if (!medicine) {

                return res.status(404).json({
                    success: false,
                    message:
                        `Medicine not found: ${item.medicineName}`
                });

            }


            const quantity =
                Number(item.quantity);


            if (
                !Number.isInteger(quantity) ||
                quantity <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Invalid quantity for ${medicine.medicineName}.`
                });

            }


            if (
                quantity >
                medicine.stock
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Only ${medicine.stock} units available for ${medicine.medicineName}.`
                });

            }


            const price =
                Number(medicine.sellingPrice);


            const gstRate =
                Number(medicine.gst) || 0;


            const itemSubtotal =
                price * quantity;


            const gstAmount =
                itemSubtotal *
                gstRate /
                100;


            subtotal += itemSubtotal;

            totalGST += gstAmount;


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
                    price,

                gst:
                    gstRate

            });

        }


        // =============================================
        // GRAND TOTAL
        // =============================================

        const grandTotal =
            subtotal + totalGST;


        // =============================================
        // REDUCE STOCK
        // =============================================

        for (const item of billItems) {

            await Medicine.findByIdAndUpdate(
                item.medicineId,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );

        }


        // =============================================
        // GENERATE BILL ID
        // =============================================

        const billId =
            "CM-" + Date.now();


        // =============================================
        // SAVE BILL
        // =============================================

        const bill =
            new Bill({

                billId,

                customerName,

                customerMobile:
                    customerMobile || "",

                items:
                    billItems,

                subtotal,

                totalGST,

                grandTotal

            });


        const savedBill =
            await bill.save();


        // =============================================
        // RESPONSE
        // =============================================

        res.status(201).json({

            success: true,

            message:
                "Bill generated successfully.",

            bill:
                savedBill

        });

    }

    catch (error) {

        console.error(
            "Create bill error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while generating bill."

        });

    }

});


module.exports = router;