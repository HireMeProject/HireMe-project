const express=require("express");
const mongoose=require("mongoose");
const {User}=require("../models/User");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const joi=require('joi');
function ValidateUser(obj){
    const schema=joi.object({
        name:joi.string().trim().required(),
        email:joi.string().trim().email().required(),
        password:joi.string().min(8).required(),
        phoneNumber:joi.string().required(),
        address:joi.string().trim(),
        birthDate:joi.date(),
        gender:joi.string().valid('female', 'male').required(),
        role:joi.string().valid('candidate', 'admin', 'employer').required(),

    })
    return schema.validate(obj);
}
function validateLoginUser(obj) {
    const schema = joi.object({
        email:joi.string().trim().required().email(),
        password:joi.string().required(),
        role:joi.string().required().valid('employer','candidate', 'admin'),
    });
    return schema.validate(obj);
}
/**
 * @desc register User
 * @route
 * @method POST
 * @access public
 */
const RegisterUser=async(req,res)=>{
    const {error}=ValidateUser(req.body);
    if(error){
        console.log("error dans backend (1)",error.details[0].message)
        return res.status(400).json({"status": "error",message:error.details[0].message}); 
    }
    try{
    const { name, email, password, birthDate, gender, phoneNumber, address,role } = req.body;
    const existingUser = await User.findOne({ email:email });
    if (existingUser) {        
        console.log("Erreur dans backend (2) : Email déjà utilisé");
        return res.status(400).json({"status": "error",message: "This email already exist" })
    };
    const existingphonenumber = await User.findOne({ phoneNumber:phoneNumber });
    if (existingphonenumber) {        
        console.log("Erreur dans backend (2) : Email déjà utilisé");
        return res.status(400).json({"status": "error",message: "This phone number already used" })};
    const newUser = new User({ name, email, password, birthDate, gender, phoneNumber, address,role });
    await newUser.save();
    res.status(200).json({"status":"success", message: "User created successfully !" });
    }
    catch (err) {
        console.log("err catch(err)",err.message);
        res.status(500).json({"status": "error", error: err.message });
    }
}
/**
 * @desc Login User
 * @route 
 * @method post
 * @access public 
 */
const LoginUser=async(req,res)=>{
    try {
        const {error}=validateLoginUser(req.body);
        if(error){
            console.log("error dans backend login (1)",error.details[0].message);
            return res.status(400).json({"status": "error",message:error.details[0].message});
        }
        const { email, password,role } = req.body;
        console.log("role : ",role);

        const user = await User.findOne({ email:email,role:role });
        if (!user)  {
            console.log("User doesnt exist");
           return res.status(404).json({message:"User doesn't exist"});}

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Password doesnt match");
            return res.status(400).json({ message: "Password Incorrect" });}

        // Génération du token JWT
        const token = jwt.sign({userInfo: {
            id: user._id,
            role:user.role
        } }, "SECRET_KEY", { expiresIn: "7d" });

        return res.status(200).send({
            token,
                id: user._id,
                email: user.email,
                role:user.role,
        });
    } catch (err) {
        console.log("err catch(err)",err.message);
        res.status(500).json({ error: err.message });
    }
}
const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = {
    RegisterUser,
    LoginUser,
    ValidateUser,
    validateLoginUser,
    logout,

}