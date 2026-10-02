const express = require("express");

const Medicine = require("../models/Medicine");

const router = express.Router();


// =====================================================
// GET ALL MEDICINES
// =====================================================

router.get("/", async (req, res) => {

    try {

        const medicines =
            await Medicine.find().sort({
                createdAt: -1
            });

        res.json({
            success: true,
            medicines: medicines
        });

    }

    catch (error) {

        console.error(
            "Get medicines error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while fetching medicines."
        });

    }

});


// =====================================================
// ADD MEDICINE
// =====================================================

router.post("/", async (req, res) => {

    try {

        const {
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
        } = req.body;


        // ================================
        // VALIDATION
        // ================================

        if (
            !medicineName ||
            !category ||
            !manufacturer ||
            !batchNumber ||
            stock === undefined ||
            minimumStock === undefined ||
            !expiryDate ||
            !unit ||
            mrp === undefined ||
            sellingPrice === undefined ||
            gst === undefined
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });

        }


        // ================================
        // PRICE VALIDATION
        // ================================

        if (Number(sellingPrice) > Number(mrp)) {

            return res.status(400).json({
                success: false,
                message: "Selling Price cannot be greater than MRP."
            });

        }


        // ================================
        // CREATE MEDICINE
        // ================================

        const medicine = new Medicine({

            medicineName,
            category,
            manufacturer,
            batchNumber,

            stock: Number(stock),

            minimumStock: Number(minimumStock),

            expiryDate,

            unit,

            mrp: Number(mrp),

            sellingPrice: Number(sellingPrice),

            purchasePrice: Number(purchasePrice || 0),

            gst: Number(gst),

            description: description || ""

        });


        const savedMedicine =
            await medicine.save();


        // ================================
        // RESPONSE
        // ================================

        res.status(201).json({

            success: true,

            message: "Medicine added successfully.",

            medicine: savedMedicine

        });

    }

    catch (error) {

        console.error(
            "Add medicine error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Server error while adding medicine."

        });

    }

});


// =====================================================
// DELETE MEDICINE
// =====================================================

router.delete("/:id", async (req, res) => {

    try {

        const medicine =
            await Medicine.findByIdAndDelete(
                req.params.id
            );


        if (!medicine) {

            return res.status(404).json({

                success: false,

                message: "Medicine not found."

            });

        }


        res.json({

            success: true,

            message: "Medicine deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "Delete medicine error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Server error while deleting medicine."

        });

    }

});


module.exports = router;