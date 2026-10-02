const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
    {
        medicineName: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        manufacturer: {
            type: String,
            required: true,
            trim: true
        },

        batchNumber: {
            type: String,
            required: true,
            trim: true
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        minimumStock: {
            type: Number,
            required: true,
            min: 0
        },

        expiryDate: {
            type: Date,
            required: true
        },

        unit: {
            type: String,
            required: true,
            trim: true
        },

        mrp: {
            type: Number,
            required: true,
            min: 0
        },

        sellingPrice: {
            type: Number,
            required: true,
            min: 0
        },

        purchasePrice: {
            type: Number,
            default: 0,
            min: 0
        },

        gst: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Medicine", medicineSchema);