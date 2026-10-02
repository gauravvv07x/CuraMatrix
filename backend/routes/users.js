const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Medicine = require("../models/Medicine");
const Bill = require("../models/Bill");
const router = express.Router();


// GET ALL USERS
router.get("/", async (req, res) => {
    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users: users
        });

    } catch (error) {

        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching users."
        });

    }
});


// ADD USER
router.post("/", async (req, res) => {
    try {

        const {
            username,
            fullName,
            email,
            mobile,
            role,
            password,
            isActive
        } = req.body;


        if (!username || !fullName || !password) {

            return res.status(400).json({
                success: false,
                message: "Username, full name and password are required."
            });

        }


        const existingUser =
            await User.findOne({
                username: username.trim()
            });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Username already exists."
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const newUser = new User({

            username: username.trim(),

            fullName: fullName.trim(),

            email: email || "",

            mobile: mobile || "",

            role: role || "staff",

            password: hashedPassword,

            isActive: isActive !== false

        });


        const savedUser =
            await newUser.save();


        const userResponse =
            savedUser.toObject();

        delete userResponse.password;


        res.status(201).json({

            success: true,

            message: "User added successfully.",

            user: userResponse

        });

    } catch (error) {

        console.error("Add user error:", error);

        res.status(500).json({

            success: false,

            message: "Server error while adding user."

        });

    }
});


// UPDATE USER
router.put("/:id", async (req, res) => {
    try {

        const {
            fullName,
            email,
            mobile,
            role,
            password,
            isActive
        } = req.body;


        const user =
            await User.findById(req.params.id);


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        user.fullName =
            fullName ?? user.fullName;

        user.email =
            email ?? user.email;

        user.mobile =
            mobile ?? user.mobile;

        user.role =
            role ?? user.role;

        user.isActive =
            isActive !== undefined
                ? isActive
                : user.isActive;


        if (password) {

            user.password =
                await bcrypt.hash(
                    password,
                    10
                );

        }


        const updatedUser =
            await user.save();


        const userResponse =
            updatedUser.toObject();

        delete userResponse.password;


        res.json({

            success: true,

            message: "User updated successfully.",

            user: userResponse

        });

    } catch (error) {

        console.error("Update user error:", error);

        res.status(500).json({

            success: false,

            message: "Server error while updating user."

        });

    }
});


// DELETE USER
router.delete("/:id", async (req, res) => {
    try {

        const user =
            await User.findById(req.params.id);


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        // Do not allow deletion
        // of the only Administrator

        if (user.role === "admin") {

            const adminCount =
                await User.countDocuments({
                    role: "admin"
                });


            if (adminCount <= 1) {

                return res.status(400).json({

                    success: false,

                    message:
                        "The last Administrator cannot be deleted."

                });

            }

        }


        await User.findByIdAndDelete(
            req.params.id
        );


        res.json({

            success: true,

            message: "User deleted successfully."

        });

    } catch (error) {

        console.error("Delete user error:", error);

        res.status(500).json({

            success: false,

            message: "Server error while deleting user."

        });

    }
});


// RESET DATABASE
// Deletes all medicines, bills, and non-admin users.
// Admin account(s) are kept.
// Admin password must be verified first.

router.post("/reset-database", async (req, res) => {
    try {

        const { adminPassword } = req.body;

        if (!adminPassword) {
            return res.status(400).json({
                success: false,
                message: "Admin password is required."
            });
        }

        // Find an Administrator account
        const adminUser = await User.findOne({
            role: "admin",
            isActive: true
        });

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: "Active Administrator account not found."
            });
        }

        // Verify admin password
        const passwordMatch = await bcrypt.compare(
            adminPassword,
            adminUser.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Administrator password."
            });
        }

        // Delete all medicines
        const medicineResult =
            await Medicine.deleteMany({});

        // Delete all bills
        const billResult =
            await Bill.deleteMany({});

        // Delete all non-admin users
        const userResult =
            await User.deleteMany({
                role: { $ne: "admin" }
            });

        res.json({
            success: true,
            message: "Database reset successfully.",
            deleted: {
                medicines: medicineResult.deletedCount,
                bills: billResult.deletedCount,
                users: userResult.deletedCount
            }
        });

    } catch (error) {

        console.error(
            "Reset database error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error while resetting database."
        });
    }
});


module.exports = router;
