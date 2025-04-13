// const express=require("express");
// const {User}=require("../models/User");
// const {Recruiter}=require("../models/Recruiter");
// const {Candidate}=require("../models/Candidate");
// const {newRecruiterManager, RecruiterManager}=require("../models/RecruiterManager");
// const bcrypt=require("bcrypt");
// const jwt=require("jsonwebtoken");
// const joi=require('joi');
// const { Company } = require("../models/Company");

// function ValidateUser(obj){
//     const schema=joi.object({
//         name:joi.string().trim().required(),
//         email:joi.string().trim().email().required(),
//         password:joi.string().min(8).required(),
//         phoneNumber:joi.string().required(),
//         address:joi.string().trim(),
//         birthDate:joi.date(),
//         gender:joi.string().valid('female', 'male').required(),
//         role:joi.string().valid('candidate', 'recruiter','recruiter manager').required(),

//     })
//     return schema.validate(obj);
// }
// function validateLoginUser(obj) {
//     const schema = joi.object({
//         email:joi.string().trim().required().email(),
//         password:joi.string().required(),
//         role:joi.string().required().valid('recruiter','candidate', 'admin','recruiter manager'),
//     });
//     return schema.validate(obj);
// }
// function ValidateUpdateUser(obj){
//     const schema=joi.object({
//         name:joi.string().trim(),
//         email:joi.string().trim().email(),
//         password:joi.string().min(8),
//         phoneNumber:joi.string(),
//         address:joi.string().trim(),
//         birthDate:joi.date(),
//         gender:joi.string().valid('female', 'male'),
//     })
//     return schema.validate(obj);
// }
// /**
//  * @desc register User
//  * @route
//  * @method POST
//  * @access public
//  */
// const RegisterUser=async(req,res)=>{
//     const {error}=ValidateUser(req.body);
//     if(error){
//         console.log("error dans backend (1)",error.details[0].message)
//         return res.status(400).json({"status": "error",message:error.details[0].message}); 
//     }
//     try{
//     const { name, email, password, birthDate, gender, phoneNumber, address,role } = req.body;
//     const existingUser = await User.findOne({ email:email });
//     if (existingUser) {        
//         console.log("Erreur dans backend (2) : Email déjà utilisé");
//         return res.status(400).json({"status": "error",message: "This email already exist" })
//     };
//     const existingphonenumber = await User.findOne({ phoneNumber:phoneNumber });
//     if (existingphonenumber) {        
//         console.log("Erreur dans backend (2) : Email déjà utilisé");
//         return res.status(400).json({"status": "error",message: "This phone number already used" })};
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password:hashedPassword, birthDate, gender, phoneNumber, address,role });
//     await newUser.save();
//     if(newUser){
//         const userId=newUser._id;
//         if(role==="Candidate"){
//             const newCandidate=new Candidate({_id:userId});
//             await newCandidate.save();
//         }
//     }

//     return res.status(200).json({"status":"success", message: "User created successfully !" });
//     }
//     catch (err) {
//         console.log("err catch(err)",err.message);
//         res.status(500).json({"status": "error", error: err.message });
//     }
// }
// /**
//  * @desc register Recruiter
//  * @route
//  * @method POST
//  * @access public
//  */
// const RegisterRecruiter=async(req,res)=>{
//     const {error}=ValidateUser(req.body);
//     if(!req.body.company){
//         return res.status(400).json({"status": "error",message:"Company is required"}); 
//     }
//     const companyId=await Company.findOne({name:req.body.company}).select('_id');
//     if(error){
//         console.log("error dans backend (1)",error.details[0].message);
//         return res.status(400).json({"status": "error",message:error.details[0].message}); 
//     }
//     try{
//     const { name, email, password, birthDate, gender, phoneNumber, address,role,companyName } = req.body;
//     const existingUser = await User.findOne({ email:email });
//     if (existingUser) {        
//         console.log("Erreur dans backend (2) : Email déjà utilisé");
//         return res.status(400).json({"status": "error",message: "This email already exist" })
//     };
//     const existingphonenumber = await User.findOne({ phoneNumber:phoneNumber });
//     if (existingphonenumber) {        
//         console.log("Erreur dans backend (2) : Email déjà utilisé");
//         return res.status(400).json({"status": "error",message: "This phone number already used" })};
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password:hashedPassword, birthDate, gender, phoneNumber, address,role,status:'inactive'});
//     await newUser.save();
//     if(newUser){
//         const userId=newUser._id;
//         if(role==="recruiter"){
//             const newRecruiter=new Recruiter({_id:userId,companyID:companyId});
//             await newRecruiter.save();
//         }
//         // else if(role==="recruiter manager"){
//         //     const newRecruiterManager=new RecruiterManager({_id:userId});
//         //     await newRecruiterManager.save();
//         // }
//     }

//     return res.status(200).json({"status":"success", message: "User created successfully !" });
//     }
//     catch (err) {
//         console.log("err catch(err)",err.message);
//         res.status(500).json({"status": "error", error: err.message });
//     }
// }
// /**
//  * @desc Login User
//  * @route 
//  * @method post
//  * @access public 
//  */
// const LoginUser=async(req,res)=>{
//     try {
//         const {error}=validateLoginUser(req.body);
//         if(error){
//             console.log("error dans backend login (1)",error.details[0].message);
//             return res.status(400).json({"status": "error",message:error.details[0].message});
//         }
//         const { email, password,role } = req.body;
//         console.log("role : ",role);

//         const user = await User.findOne({ email:email,role:role });
//         if (!user)  {
//             console.log("User doesnt exist");
//            return res.status(404).json({message:"User doesn't exist"});}

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             console.log("Password doesnt match");
//             return res.status(400).json({ message: "Password Incorrect" });}

//         // Génération du token JWT
//         const token = jwt.sign({userInfo: {
//             id: user._id,
//             role:user.role
//         } }, "SECRET_KEY", { expiresIn: "7d" });

//         return res.status(200).send({
//             token,
//                 id: user._id,
//                 email: user.email,
//                 role:user.role,
//         });
//     } catch (err) {
//         console.log("err catch(err)",err.message);
//         res.status(500).json({ error: err.message });
//     }
// }
// const logout = (req, res) => {
//     try {
//         res.clearCookie('token');
//         res.status(200).json({ success: true, message: "Logout successful" });
//     } catch (error) {
//         console.error('Error logging out user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }
// /**
//  * @desc Update User 
//  * @route /users/:id
//  * @method put
//  * @access private
//  */
// const UpdateUser=async(req,res)=>{
//     try{
//         var { name, email, password, birthDate, gender, phoneNumber, address } = req.body;
//         if(password){
//             const passwordHashed=await bcrypt.hash(password,10);
//             password=passwordHashed;
//         }
//         const UserToUpdate=await User.findByIdAndUpdate(req.params.id,{
//             $set:{
//                 name:name,
//                 email:email,
//                 password:password,
//                 phoneNumber:phoneNumber,
//                 address:address,
//                 birthDate:birthDate,
//                 gender:gender,
//                 },
//             },{new:true,});
//         if(!UserToUpdate){
//             return res.status(404).json({"status": "error",message:"User does not exist"}); 
//         }
//         // const result=await UserToUpdate.save();
//         return res.status(200).json({"status": "success",message:"User Updated ",UserToUpdate});
//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({"status": "error",message: "Server error"});
//     }
// }
// /**
//  * @desc Get All Users
//  * @route /users
//  * @method get
//  * @access private (only admin)
//  */
// const GetAllUsers=async(req,res,next)=>{
//     const users=await User.find().select("-password");
//     if(users.length>0){
//         return res.status(200).json({"status": "success",users});
//     }
//     return res.status(200).json({"status": "success",message:'this list is empty'});
// }
// /**
//  * @desc Get users by role
//  * @route /users/:role
//  * @method get
//  * @access private (only admin)
//  */
// const GetUsersByrole=async(req,res)=>{
//     try{
//         const users=await User.find({role:req.params.role}).select("-password");

//     if(users.length===0){
//         return res.status(200).json({"status": "success",message:'this list is empty'});
//     }
//     return res.status(200).json({"status": "success",users});}
//     catch(error){
//         return res.status(500).json({"status": "error",message: "Server error"});
//     }
// }
// /**
//  * @desc Get users by id
//  * @route /users/:role/:id
//  * @method get
//  * @access private (only admin)
//  */
// const GetUserById=async(req,res,next)=>{
//     try{
//     const user=await User.findOne({_id:req.params.id,role:req.params.role});
//     if(user){
//         return res.status(200).json({"status": "success",user});
//     }
//     return res.status(404).json({"status": "error",message:'user not found'});
//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({"status": "error",message: "Server error"});
//     }
// }
// /**
//  * @desc Add New User
//  * @route /users/add
//  * @method post
//  * @access private (only admin)
//  */
// const InsertUser=async(req,res,next)=>{
//     try{
//         await RegisterUser(req,res,next);
//     }
//     catch(error){
//         return res.status(500).json({"status": "error",message: "Server error"});
//     }
// };
// /**
//  * @desc Delete User
//  * @route /users/:id
//  * @method Delete
//  * @access private (only admin)
//  */
// const DeleteUser=async(req,res,next)=>{
//     try{
//         const UserToDelete= await User.findByIdAndDelete(req.params.id);
//         if(!UserToDelete){
//             return res.status(404).json({"status": "error",message:"User does not exist"}); 
//         }
//         return res.status(200).json({"status": "success",message:"User deleted"}); 
//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({"status": "error",message: "Server error"});
//     }
// };




// module.exports={
//     UpdateUser,
//     GetAllUsers,
//     GetUsersByrole,
//     GetUserById,
//     InsertUser,
//     DeleteUser,
//     ValidateUpdateUser,
//     ValidateUser,
//     validateLoginUser,
//     RegisterRecruiter,
//     RegisterUser,
//     LoginUser,
//     logout,
// }