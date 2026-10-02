const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// ==========================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ==========================================

dotenv.config();


// ==========================================
// IMPORT ROUTES AFTER DOTENV
// ==========================================

const authRoutes = require("./routes/auth");
const medicineRoutes = require("./routes/medicine");
const billRoutes = require("./routes/bill");
const userRoutes = require("./routes/users");


// ==========================================
// CREATE APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/users", userRoutes);


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "CuraMatrix Backend API is running."
    });

});


// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log(
            "MongoDB Connected:",
            mongoose.connection.host
        );

    })
    .catch((error) => {

        console.error(
            "MongoDB Connection Error:",
            error.message
        );

    });


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});