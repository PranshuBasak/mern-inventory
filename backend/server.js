const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const userRoute = require("./routes/useRoutes")
const errorHandler = require("./middleware/errormiddleware");
const cookieParser = require("cookie-parser");


const app = express();


//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(bodyParser.json());



//Routes Middleware

app.use("/api/users", userRoute)


//Routes

app.get("/",(req,res) =>{
    res.send("Home Page")
})

const PORT = process.env.PORT || 5000;

//Error Middleware

app.use(errorHandler);

// connect to db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() =>{
        app.listen(PORT, () =>{
            console.log(`Server running on port http://localhost:${PORT}`);
        })
    })
    .catch((err) => console.error(err))

