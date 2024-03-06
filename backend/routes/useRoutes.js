const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUser, loginStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');


//Register Route
router.post("/register", registerUser)

//Login Route
router.post("/login", loginUser)

//Login Route
router.get("/logout", logoutUser)

//Get USer Data
router.get("/getuser",protect ,  getUser)

//Checking Login Status
router.get("/loggedin", loginStatus)

module.exports = router;
