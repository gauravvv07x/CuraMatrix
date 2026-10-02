const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");

const router = express.Router();


// ==========================================
// OTP STORAGE
// ==========================================

const resetOtps = new Map();


// ==========================================
// EMAIL CONFIGURATION
// ==========================================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});


// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const {
            username,
            password,
            role
        } = req.body;


        // ==========================================
        // REQUIRED FIELD VALIDATION
        // ==========================================

        if (!username || !password || !role) {

            return res.status(400).json({
                success: false,
                message:
                    "Username, password and role are required."
            });

        }


        // ==========================================
        // FIND USER
        // ==========================================

        const user =
            await User.findOne({
                username: username.trim()
            });


        if (!user) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid username or password."
            });

        }


        // ==========================================
        // CHECK ACCOUNT STATUS
        // ==========================================

        if (!user.isActive) {

            return res.status(403).json({
                success: false,
                message:
                    "This account is inactive."
            });

        }


        // ==========================================
        // ROLE VERIFICATION
        // ==========================================

        if (user.role !== role) {

            return res.status(403).json({
                success: false,
                message:
                    "Selected role does not match this account."
            });

        }


        // ==========================================
        // PASSWORD VERIFICATION
        // ==========================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid username or password."
            });

        }


        // ==========================================
        // CREATE JWT TOKEN
        // ==========================================

        const token =
            jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        res.json({

            success: true,

            message:
                "Login successful.",

            token,

            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role
            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Server error during login."

        });

    }

});


// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================

router.post(
    "/forgot-password",
    async (req, res) => {

        try {

            const {
                username,
                email
            } = req.body;


            if (!username || !email) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Username and email are required."

                });

            }


            const user =
                await User.findOne({

                    username:
                        username.trim(),

                    email:
                        email.trim().toLowerCase()

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Username and registered email do not match."

                });

            }


            if (!user.isActive) {

                return res.status(403).json({

                    success: false,

                    message:
                        "This account is inactive."

                });

            }


            // Generate 6-digit OTP

            const otp =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                ).toString();


            resetOtps.set(
                user._id.toString(),
                {
                    otp: otp,

                    expiresAt:
                        Date.now() +
                        10 * 60 * 1000,

                    attempts: 0
                }
            );


            await transporter.sendMail({

                from:
                    `"CuraMatrix" <${process.env.EMAIL_USER}>`,

                to:
                    user.email,

                subject:
                    "CuraMatrix Password Reset OTP",

                text:
                    `Your CuraMatrix password reset OTP is ${otp}. This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.`

            });


            res.json({

                success: true,

                message:
                    "OTP sent successfully to your registered email."

            });


        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to send OTP. Please try again later."

            });

        }

    }
);


// ==========================================
// VERIFY OTP
// ==========================================

router.post(
    "/verify-reset-otp",
    async (req, res) => {

        try {

            const {
                username,
                email,
                otp
            } = req.body;


            if (
                !username ||
                !email ||
                !otp
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Username, email and OTP are required."

                });

            }


            const user =
                await User.findOne({

                    username:
                        username.trim(),

                    email:
                        email.trim().toLowerCase()

                });


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User account not found."

                });

            }


            const resetData =
                resetOtps.get(
                    user._id.toString()
                );


            if (!resetData) {

                return res.status(400).json({

                    success: false,

                    message:
                        "OTP not found or expired. Please request a new OTP."

                });

            }


            if (
                Date.now() >
                resetData.expiresAt
            ) {

                resetOtps.delete(
                    user._id.toString()
                );


                return res.status(400).json({

                    success: false,

                    message:
                        "OTP has expired. Please request a new OTP."

                });

            }


            resetData.attempts++;


            if (
                resetData.attempts > 5
            ) {

                resetOtps.delete(
                    user._id.toString()
                );


                return res.status(429).json({

                    success: false,

                    message:
                        "Too many incorrect OTP attempts. Please request a new OTP."

                });

            }


            if (
                resetData.otp !==
                otp.toString().trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid OTP."

                });

            }


            // OTP verified.
            // Create a temporary reset token.

            const resetToken =
                jwt.sign(

                    {
                        userId:
                            user._id.toString(),

                        purpose:
                            "password-reset"

                    },

                    process.env.JWT_SECRET,

                    {
                        expiresIn:
                            "10m"
                    }

                );


            resetOtps.set(
                user._id.toString(),
                {
                    ...resetData,

                    verified: true,

                    resetToken:
                        resetToken
                }
            );


            res.json({

                success: true,

                message:
                    "OTP verified successfully.",

                resetToken:
                    resetToken

            });


        } catch (error) {

            console.error(
                "Verify OTP error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Server error while verifying OTP."

            });

        }

    }
);


// ==========================================
// RESET PASSWORD
// ==========================================

router.post(
    "/reset-password",
    async (req, res) => {

        try {

            const {
                resetToken,
                newPassword
            } = req.body;


            if (
                !resetToken ||
                !newPassword
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Reset token and new password are required."

                });

            }


            if (
                newPassword.length < 6
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "New password must contain at least 6 characters."

                });

            }


            let decoded;


            try {

                decoded =
                    jwt.verify(
                        resetToken,
                        process.env.JWT_SECRET
                    );

            } catch (error) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Reset session expired. Please request a new OTP."

                });

            }


            if (
                decoded.purpose !==
                "password-reset"
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid password reset request."

                });

            }


            const resetData =
                resetOtps.get(
                    decoded.userId
                );


            if (!resetData) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Password reset session expired."

                });

            }


            if (
                !resetData.verified ||
                resetData.resetToken !==
                resetToken
            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "OTP verification is required."

                });

            }


            const user =
                await User.findById(
                    decoded.userId
                );


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User account not found."

                });

            }


            user.password =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            await user.save();


            // Delete OTP/reset information

            resetOtps.delete(
                decoded.userId
            );


            res.json({

                success: true,

                message:
                    "Password reset successfully. You can now login."

            });


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Server error while resetting password."

            });

        }

    }
);


module.exports = router;