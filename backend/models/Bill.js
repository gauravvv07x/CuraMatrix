const mongoose = require("mongoose");


// =====================================================
// BILL ITEM SCHEMA
// =====================================================

const billItemSchema = new mongoose.Schema(
    {
        medicineId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine",
            required: true
        },

        medicineName: {
            type: String,
            required: true
        },

        batchNumber: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        gst: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        _id: false
    }
);


// =====================================================
// BILL SCHEMA
// =====================================================

const billSchema = new mongoose.Schema(
    {
        billId: {
            type: String,
            required: true,
            unique: true
        },

        customerName: {
            type: String,
            required: true,
            trim: true
        },

        customerMobile: {
            type: String,
            trim: true,
            default: ""
        },

        items: {
            type: [billItemSchema],
            required: true
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        totalGST: {
            type: Number,
            required: true,
            min: 0
        },

        grandTotal: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("Bill", billSchema);
    