const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}

//Register User
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

    //Generate Token 
    const token = generateToken(user._id)

    //Sending Http-Only Cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day,
        sameSite: "none",
        secure: true
    });

    if(user){
        const {_id, name, email, photo , phone , bio} = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token,
        })
    } else{
        res.status(400)
        throw new Error("Invalid user data")
    }
});


//Login User
const loginUser = asyncHandler( async (req, res) =>{
    const {email , password} = req.body;

    //valid request
    if(!email || !password){
        res.status(400);
        throw new Error("Please fill in email and password");
    }
    
    //check if user exist
    const user = await User.findOne({email}) 
    
    if(!user){
        res.status(400);
        throw new Error("User not found, please  signup");
    }
    
    
    //User exist , check password
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    //Generate Token 
    const token = generateToken(user._id)

    
    if(user && passwordIsCorrect){

        //Sending Http-Only Cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), // 1 day,
            sameSite: "none",
            secure: true
        });

        const {_id, name, email, photo , phone , bio} = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token,
        })
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }

})

//Logout User

const logoutUser = asyncHandler(async (req, res) =>{
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // expire cookie
        sameSite: "none",
        secure: true
    });

    return res.status(200).json({
        message: "Successfully Logout"
    })
})


// Get User Data

const getUser = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.user._id);
    if(user){
        const {_id, name, email, photo , phone , bio} = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
        })
    } else{
        res.status(400)
        throw new Error("User Not Found")
    }
})  

//Get login status

const loginStatus = asyncHandler(async (req,res) =>{
    res.send("Login Status")
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
};