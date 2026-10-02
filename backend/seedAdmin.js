const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        const existingAdmin = await User.findOne({
            username: "admin"
        });

        if (existingAdmin) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        const admin = new User({
            username: "admin",
            password: hashedPassword,
            role: "admin",
            fullName: "Administrator",
            isActive: true
        });

        await admin.save();

        console.log("Admin user created successfully.");
        console.log("Username: admin");
        console.log("Password: Admin@123");

        process.exit(0);

    } catch (error) {

        console.error(
            "Error creating admin:",
            error.message
        );

        process.exit(1);
    }
};

createAdmin();