const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const userSchme = mongoose.Schema({
    name: {
        type: String,
        required: [true , "Please Add Name"]
    },
    email: {
        type: String,
        required: [true , "Please Add Email"],
        unique: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please give a valid email address'
        ]
    },
    password:{
        type: String,
        required: [true , "Please Add Password"],
        minLength: [6, "Password Must be upto 6 characters"],
        // maxLength: [23, "Password Must not be more than 23 characters"]

    },
    photo:{
        type: String,
        required: [true , "Please Add Photo"],
        default: "https://imgur.com/7ItGocW",
    },
    phone:{
        type: String,
        default: "+123"
    },
    bio:{
        type: String,
        maxLength: [250, "Bio should not be more than 250 words "],
        default: "bio"
    }
},{
    timeStamps: true
})

    //Encrypt Password
    

    userSchme.pre("save", async function(next) {
        if(!this.isModified("password")){
            return next();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(this.password,salt);
        this.password = hashedPass;
    })

const User = mongoose.model("User",userSchme);

module.exports = User;

