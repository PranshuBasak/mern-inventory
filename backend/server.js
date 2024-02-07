const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();


const app = express();

const PORT = process.env.PORT || 5000;

// connect to db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() =>{
        app.listen(PORT, () =>{
            console.log(`Server running on port http://localhost:${PORT}`);
        })
    })
    .catch((err) => console.error(err))

