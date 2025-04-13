const mongoose=require("mongoose");
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim:true,
    },
    password: {
        type: String, 
        required: true,
        minlength:8,
    },
    birthDate:{
        type:Date,
        required:true,
    },
    gender: {
        type: String,
        enum:["female","male"], 
        required:true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique:true,
        trim:true,
    },
    address: {
        type: String,
        required: true,
        
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
            publicId: null,
        }
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "recruiter","candidate"],
        default: "candidate",
        required: true,
    },
    status:
    {
        type: String,
        enum:["active","inactive"],
        default: "active",
    }
    ,
},{ timestamps: true });

// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };


const User = mongoose.model('User', userSchema);
module.exports={
    User,
}