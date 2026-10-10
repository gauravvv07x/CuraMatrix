const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// OTP STORAGE
// ==========================================

const resetOtps = new Map();

// ==========================================
// BREVO EMAIL CONFIGURATION
// ==========================================

async function sendOtpEmail(recipientEmail, otp) {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;

    if (!apiKey || !senderEmail) {
        throw new Error(
            "Missing BREVO_API_KEY or BREVO_SENDER_EMAIL."
        );
    }

    const response = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
            method: "POST",
            headers: {
                accept: "application/json",
                "api-key": apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: "CuraMatrix",
                    email: senderEmail
                },
                to: [
                    {
                        email: recipientEmail
                    }
                ],
                subject: "CuraMatrix Password Reset OTP",
                textContent:
                    `Your CuraMatrix password reset OTP is ${otp}. ` +
                    "This OTP is valid for 10 minutes. " +
                    "If you did not request a password reset, please ignore this email."
            })
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Brevo API error (${response.status}): ${errorBody}`
        );
    }

    return response.json();
}

// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Username, password and role are required."
            });
        }

        const user = await User.findOne({
            username: username.trim()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "This account is inactive."
            });
        }

        if (user.role !== role) {
            return res.status(403).json({
                success: false,
                message: "Selected role does not match this account."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const token = jwt.sign(
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

        return res.json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                username: user.username,
                fullName: user.fullName,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during login."
        });
    }
});

// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================

router.post("/forgot-password", async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({
                success: false,
                message: "Username and email are required."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            username: username.trim(),
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Username and registered email do not match."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "This account is inactive."
            });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const userId = user._id.toString();

        // Store OTP for 10 minutes
        resetOtps.set(userId, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000,
            attempts: 0,
            verified: false
        });

        // Send OTP to this user's registered email
        try {
            await sendOtpEmail(user.email, otp);
        } catch (emailError) {
            // Remove OTP if the email could not be sent
            resetOtps.delete(userId);
            throw emailError;
        }

        return res.json({
            success: true,
            message: "OTP sent successfully to your registered email."
        });
    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to send OTP. Please try again later."
        });
    }
});

// ==========================================
// VERIFY OTP
// ==========================================

router.post("/verify-reset-otp", async (req, res) => {
    try {
        const { username, email, otp } = req.body;

        if (!username || !email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Username, email and OTP are required."
            });
        }

        const user = await User.findOne({
            username: username.trim(),
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        const userId = user._id.toString();
        const resetData = resetOtps.get(userId);

        if (!resetData) {
            return res.status(400).json({
                success: false,
                message: "OTP not found or expired. Please request a new OTP."
            });
        }

        if (Date.now() > resetData.expiresAt) {
            resetOtps.delete(userId);

            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP."
            });
        }

        if (resetData.verified) {
            return res.status(400).json({
                success: false,
                message: "OTP has already been verified. Continue with password reset."
            });
        }

        resetData.attempts++;

        if (resetData.attempts > 5) {
            resetOtps.delete(userId);

            return res.status(429).json({
                success: false,
                message: "Too many incorrect OTP attempts. Please request a new OTP."
            });
        }

        if (resetData.otp !== otp.toString().trim()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP."
            });
        }

        // OTP verified; create a temporary reset token
        const resetToken = jwt.sign(
            {
                userId,
                purpose: "password-reset"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m"
            }
        );

        resetOtps.set(userId, {
            ...resetData,
            verified: true,
            resetToken
        });

        return res.json({
            success: true,
            message: "OTP verified successfully.",
            resetToken
        });
    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while verifying OTP."
        });
    }
});

// ==========================================
// RESET PASSWORD
// ==========================================

router.post("/reset-password", async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Reset token and new password are required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 6 characters."
            });
        }

        let decoded;

        try {
            decoded = jwt.verify(
                resetToken,
                process.env.JWT_SECRET
            );
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Reset session expired. Please request a new OTP."
            });
        }

        if (decoded.purpose !== "password-reset") {
            return res.status(401).json({
                success: false,
                message: "Invalid password reset request."
            });
        }

        const userId = decoded.userId;
        const resetData = resetOtps.get(userId);

        if (!resetData) {
            return res.status(401).json({
                success: false,
                message: "Password reset session expired."
            });
        }

        if (Date.now() > resetData.expiresAt) {
            resetOtps.delete(userId);

            return res.status(401).json({
                success: false,
                message: "OTP has expired. Please request a new OTP."
            });
        }

        if (
            !resetData.verified ||
            resetData.resetToken !== resetToken
        ) {
            return res.status(401).json({
                success: false,
                message: "OTP verification is required."
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        // Delete OTP/reset information after successful password reset
        resetOtps.delete(userId);

        return res.json({
            success: true,
            message: "Password reset successfully. You can now login."
        });
    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while resetting password."
        });
    }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;