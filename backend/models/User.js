const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "admin",
                "pharmacist",
                "staff"
            ],
            default: "staff"
        },

        fullName: {
            type: String,
            default: ""
        },

        email: {
            type: String,
            default: ""
        },

        mobile: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("User", userSchema);