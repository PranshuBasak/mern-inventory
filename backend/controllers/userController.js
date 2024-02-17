const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");



const registerUser = asyncHandler( async (req, res) =>{

    const {name , email , password} = req.body;

    //Validation
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill in all required fields")
    }

    if(password.length < 6){
        res.status(400);
        throw new Error("Password must be abouve 5 characters")
    }
    
    //check if user already exist
    const UserExist = await User.findOne({email})
    
    if(UserExist){
        res.status(404);
        throw new Error("Email has already been Used")
    }



    //Create new User
    const user = await User.create({
        name,
        email,
        password,
    })
    if(user){
        const {_id, name, email, photo , phone , bio} = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio
        })
    } else{
        res.status(400)
        throw new Error("Invalid user data")
    }
})



module.exports = {
    registerUser

};