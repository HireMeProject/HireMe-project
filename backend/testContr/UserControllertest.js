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

































const { User } = require("../models/User");
const { Candidate } = require("../models/Candidate");
const { Recruiter } = require("../models/Recruiter");
const { Company } = require("../models/Company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const IUser = require("../Interface/UserInterface");

class UserManager extends IUser{
  //Valider les données de création d'un utilisateur
  ValidateUser(obj) {
    const schema = joi.object({
      name: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      password: joi.string().min(8).required(),
      phoneNumber: joi.string().required().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male").required(),
      role: joi.string().valid("candidate", "admin", "recruiter").required(),
    });
    return schema.validate(obj);
  }
  ValidateRecruiter(obj) {
    const schema = joi.object({
      name: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      password: joi.string().min(8).required(),
      phoneNumber: joi.string().required().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male").required(),
      role: joi.string().valid("candidate", "recruiter").required(),
      company: joi.string().trim().required(),
    });
    return schema.validate(obj);
  }
  //Valider les données de mise à jour d'un utilisateur
  validateLoginUser(obj) {
    const schema = joi.object({
      email: joi.string().trim().email().required(),
      password: joi.string().required(),
      role: joi.string().required().valid("recruiter", "candidate", "admin"),
    });
    return schema.validate(obj);
  }
  //Valider les données de mide à jour d'un utilisateur
  ValidateUpdateUser(obj) {
    const schema = joi.object({
      name: joi.string().trim(),
      email: joi.string().trim().email(),
      password: joi.string().min(8),
      phoneNumber: joi.string().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male"),
      company: joi.string().trim(),
      status: joi.string().trim(),
      profilePhoto:joi.object(),
      role:joi.string(),
    });
    return schema.validate(obj);
  }
  //Créer un nouveel utilisateur
  async createUser(userData) {
    const { error } = this.ValidateUser(userData);
    if (error) {
      const errorMessage = error.details[0].message || "Validation failed";
      throw { status: 400, message: errorMessage };
    }
    const {
      name,
      email,
      password,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
    } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "This email already exists" };
    }
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw { status: 400, message: "This phone number is already used" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
    if (newUser && role === "candidate") {
      const newCandidate = new Candidate({
        _id: newUser._id,
        candidateId: newUser._id,
      });
      await newCandidate.save();
    }
    return newUser;
  }
  //Create Recruteur
  async registerRecruiter(recruiterData) {
    const { error } = this.ValidateRecruiter(recruiterData);
    if (error) {
      const errorMessage = error.details[0].message || "Validation failed";
      throw { status: 400, message: errorMessage };
    }

    if (!recruiterData.company) {
      throw { status: 400, message: "Company is required" };
    }
    // pour chercher avec lowercase
    const company = await Company.findOne({
      name: { $regex: new RegExp(`^${recruiterData.company}$`, "i") },
    });
    if (!company) {
      throw { status: 401, message: "Company not found" };
    }
    const companyId = company._id;
    const {
      name,
      email,
      password,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
    } = recruiterData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "This email already exist" };
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw { status: 400, message: "This phone number is already used" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
      status: "active",
    });
    await newUser.save();

    if (newUser && role === "recruiter") {
      console.log("comp ID : ",companyId)
      const newRecruiter = new Recruiter({
        _id: newUser._id,
        recruiterID: newUser._id,
        companyID: companyId,
      });
      await newRecruiter.save();
    }

    return newUser;
  }
  // Connexion d'un utilisateur
  async login(userData, secretkey) {
    const { email, password, role } = userData;
    const { error } = this.validateLoginUser({ email, password, role });
    if (error) {
      const errorMessage = error.details[0].message || "login failed";
      throw { status: 400, message: errorMessage };
    }
    const user = await User.findOne({ email, role });
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 400, message: "Incorrect password" };
    }
    const token = jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      secretkey,
      { expiresIn: "7d" }
    );
    return { token, user };
  }
  //Mettre à jour un utilisateur
  async updateUser(userId, updateData) {
    try {
      const {
        company,
        status,
        cv,
        skills,
        ...rest
      } = updateData;
      console.log("data recu : ",updateData)
      const { error } = this.ValidateUpdateUser(rest);
      if (error) {
        console.log("probeleee");
        const errorMessage = error.details[0].message || "Validation failed";
        throw { status: 400, message: errorMessage };
      }
     
      const {name,
        email,
        password,
        birthDate,
        gender,
        phoneNumber,
        address}=rest;
      let companyID;
      let passwordHashed;
      if(password){
        passwordHashed=await bcrypt.hash(password,10);
      }
      if (company) {
        const companyExist = await Company.findOne({ name: company }).select(
          "_id"
        );
        if (!companyExist) {
          throw { status: 400, message: "Company not found" };
        }
         companyID = companyExist._id.toString();
        console.log("company id :",companyID);
        if (!companyID) {
          throw { status: 400, message: "Company not foundd" };
        }
      }
      const user = await User.findById(userId);
      if (!user) {
        throw { status: 400, message: "User not found" };
      }
      console.log("user founded :", user.name);
      // Update the base user information
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            email,
            password:passwordHashed,
            birthDate,
            gender,
            phoneNumber,
            address,
            status,
          },
        },
        { new: true }
      );
      // Update role-specific information
      if (user.role === "candidate") {
        await Candidate.findByIdAndUpdate(
          userId,
          { $set: { cv, skills } },
          { new: true }
        );
      } else if (user.role === "recruiter" && company) {
        await Recruiter.findByIdAndUpdate(
          userId,
          { $set: {companyID:companyID } },
          { new: true }
        );
        console.log("probleme ici");

      } 
      console.log("Données reçues du frontend :", updateData);


      return updatedUser;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while updating the user"
      );
    }
  }
  // async updateRecruiterCompany(userId, company) {
  //     try{

  //     }
  //     catch(error){
  //             throw { status: 400, message: "Incorrect password" };
  // throw new Error(error.message || "An error occurred while updating the user");
  //     }
  // }
  // async updateRecruiterCompany(userId, updatedData) {
  //     try{

  //     }
  //     catch(error){
  //             throw { status: 400, message: "Incorrect password" };
  // throw new Error(error.message || "An error occurred while updating the user");
  //     }
  // }

  async updateRecruiterStatus(userId, status) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: status },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while updating the user"
      );
    }
  }

  //Recuperer tous les utilisateurs
  async getAllUsers() {
    const users = await User.find().select("-password");
    return users;
  }
  //Recuperer tous les utilisateurs par role
  async getUsersByRole(role) {
    const users = await User.find({ role }).select("-password");
    return users;
  }
  // Récupérer un utilisateur par ID et rôle
  async getUserByIdAndRole(userId, role) {
    const user = await User.findOne({ _id: userId, role });
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    return user;
  }
  // Récupérer un utilisateur par ID 
  async getUserById(userId,role) {
    let profile ,userData,data;
    let user=await User.findOne({ _id: userId });
    if(role==="candidate"){
      userData=await Candidate.findById(userId);
      data=[userData.cv,userData.skills]
    }
    else if(role==="recruiter"){
      userData=await Recruiter.findById(userId).populate("companyID","name sector logo").lean();
      data={name:userData.companyID.name,sector:userData.companyID.sector,logo:userData.companyID.logo}

    }
    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    profile={
      profilePhoto:user.profilePhoto,
      userId: user._id,  // ID utilisateur
      name: user.name,    // Nom de l'utilisateur
      email: user.email,  // Email de l'utilisateur
      phoneNumber: user.phoneNumber,  // Numéro de téléphone de l'utilisateur
      address: user.address,  // Adresse de l'utilisateur
      status: user.status, // Statut du recruteur
      data:data, // Nom de la société (peuplé via populate)
      role: user.role,
      gender:user.gender,
    }
    console.log("data : ",profile);
    return profile;
  }

  // Supprimer un utilisateur
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    var recruiter = await Recruiter.findOne({ _id: userId });
    var candidate = await Candidate.findOne({ _id: userId });
    if (recruiter) {
      recruiter = await Recruiter.findByIdAndDelete(userId);
    } else if (candidate) {
      candidate = await Candidate.findByIdAndDelete(userId);
    }
    return user;
  }
}
module.exports = new UserManager();
/**const { User } = require("../models/User");
const { Candidate } = require("../models/Candidate");
const { Recruiter } = require("../models/Recruiter");
const { Company } = require("../models/Company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

class UserManager {
  //Valider les données de création d'un utilisateur
  ValidateUser(obj) {
    const schema = joi.object({
      name: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      password: joi.string().min(8).required(),
      phoneNumber: joi.string().required().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male").required(),
      role: joi.string().valid("candidate", "admin", "recruiter").required(),
    });
    return schema.validate(obj);
  }
  ValidateRecruiter(obj) {
    const schema = joi.object({
      name: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      password: joi.string().min(8).required(),
      phoneNumber: joi.string().required().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male").required(),
      role: joi.string().valid("candidate", "recruiter").required(),
      company: joi.string().trim().required(),
    });
    return schema.validate(obj);
  }
  //Valider les données de mise à jour d'un utilisateur
  validateLoginUser(obj) {
    const schema = joi.object({
      email: joi.string().trim().email().required(),
      password: joi.string().required(),
      role: joi.string().required().valid("recruiter", "candidate", "admin"),
    });
    return schema.validate(obj);
  }
  //Valider les données de mide à jour d'un utilisateur
  ValidateUpdateUser(obj) {
    const schema = joi.object({
      name: joi.string().trim(),
      email: joi.string().trim().email(),
      password: joi.string().min(8),
      phoneNumber: joi.string().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male"),
      company: joi.string().trim(),
      status: joi.string().trim(),
      profilePhoto:joi.object(),
      role:joi.string(),
    });
    return schema.validate(obj);
  }
  //Créer un nouveel utilisateur
  async createUser(userData) {
    const { error } = this.ValidateUser(userData);
    if (error) {
      const errorMessage = error.details[0].message || "Validation failed";
      throw { status: 400, message: errorMessage };
    }
    const {
      name,
      email,
      password,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
    } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "This email already exists" };
    }
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw { status: 400, message: "This phone number is already used" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
    if (newUser && role === "candidate") {
      const newCandidate = new Candidate({
        _id: newUser._id,
        candidateId: newUser._id,
      });
      await newCandidate.save();
    }
    return newUser;
  }
  //Create Recruteur
  async registerRecruiter(recruiterData) {
    const { error } = this.ValidateRecruiter(recruiterData);
    if (error) {
      console.log("ici");
      const errorMessage = error.details[0].message || "Validation failed";
      throw { status: 400, message: errorMessage };
    }

    if (!recruiterData.company) {
      throw { status: 400, message: "Company is required" };
    }
    const company = await Company.findOne({ name: recruiterData.company });
    if (!company) {
      throw { status: 401, message: "Company not found" };
    }
    const companyId = company._id;
    if (!companyId) {
      throw { status: 400, message: "Company not found" };
    }

    const {
      name,
      email,
      password,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
    } = recruiterData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "This email already exist" };
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw { status: 400, message: "This phone number is already used" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
      status: "inactive",
    });
    await newUser.save();

    if (newUser && role === "recruiter") {
      const newRecruiter = new Recruiter({
        _id: newUser._id,
        recruiterID: newUser._id,
        companyID: companyId,
      });
      await newRecruiter.save();
    }

    return newUser;
  }
  // Connexion d'un utilisateur
  async login(userData, secretkey) {
    const { email, password, role } = userData;
    const { error } = this.validateLoginUser({ email, password, role });
    if (error) {
      const errorMessage = error.details[0].message || "login failed";
      throw { status: 400, message: errorMessage };
    }
    const user = await User.findOne({ email, role });
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 400, message: "Incorrect password" };
    }
    const token = jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      secretkey,
      { expiresIn: "7d" }
    );
    return { token, user };
  }
  //Mettre à jour un utilisateur
  async updateUser(userId, updateData) {
    try {
      const {company,cv,skills,...restData}=updateData
      console.log("updateData : ",restData)
      const { error } = this.ValidateUpdateUser(restData);
      if (error) {
        console.log("probeleee");
        const errorMessage = error.details[0].message || "Validation failed";
        throw { status: 400, message: errorMessage };
      }
      const {
        name,
        email,
        password,
        birthDate,
        gender,
        phoneNumber,
        address,
        status,
       
      } = updateData;
      let companyID;
      let passwordHashed;
      if(password){
        passwordHashed=await bcrypt.hash(password,10);
      }
      if (company) {
        const companyExist = await Company.findOne({ name: company }).select(
          "_id"
        );
        if (!companyExist) {
          throw { status: 400, message: "Company not found" };
        }
         companyID = companyExist._id.toString();
        console.log("company id :",companyID);
        if (!companyID) {
          throw { status: 400, message: "Company not foundd" };
        }
      }
      const user = await User.findById(userId);
      if (!user) {
        throw { status: 400, message: "User not found" };
      }
      console.log("user founded :", user.name);
      // Update the base user information
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            email,
            password:passwordHashed,
            birthDate,
            gender,
            phoneNumber,
            address,
            status,
          },
        },
        { new: true }
      );
      let UserUpdatedProfile;
      // Update role-specific information
      if (user.role === "candidate") {
        UserUpdatedProfile= await Candidate.findByIdAndUpdate(
          userId,
          { $set: { cv, skills } },
          { new: true }
        ).populate("candidateId");
        UserUpdatedProfile={
          updatedUser,
          cv:UserUpdatedProfile.cv,
          skills:UserUpdatedProfile.skills,
        }
        
      } else if (user.role === "recruiter" && company) {
        UserUpdatedProfile=await Recruiter.findByIdAndUpdate(
          userId,
          { $set: {companyID:companyID } },
          { new: true }
        );
        console.log("probleme ici");

      } 
      console.log("Données reçues du frontend :", updateData);


      return UserUpdatedProfile;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while updating the user"
      );
    }
  }
  // async updateRecruiterCompany(userId, company) {
  //     try{

  //     }
  //     catch(error){
  //             throw { status: 400, message: "Incorrect password" };
  // throw new Error(error.message || "An error occurred while updating the user");
  //     }
  // }
  // async updateRecruiterCompany(userId, updatedData) {
  //     try{

  //     }
  //     catch(error){
  //             throw { status: 400, message: "Incorrect password" };
  // throw new Error(error.message || "An error occurred while updating the user");
  //     }
  // }

  async updateRecruiterStatus(userId, status) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: status },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while updating the user"
      );
    }
  }

  //Recuperer tous les utilisateurs
  async getAllUsers() {
    const users = await User.find().select("-password");
    return users;
  }
  //Recuperer tous les utilisateurs par role
  async getUsersByRole(role) {
    const users = await User.find({ role }).select("-password");
    return users;
  }
  // Récupérer un utilisateur par ID et rôle
  async getUserByIdAndRole(userId, role) {
    const user = await User.findOne({ _id: userId, role });
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    return user;
  }
  // Récupérer un utilisateur par ID 
  async getUserById(userId,role) {
    let profile ,userData,data;
    let user=await User.findOne({ _id: userId });
    if(role==="candidate"){
      userData=await Candidate.findById(userId);
      data=[userData.cv,userData.skills]
    }
    else if(role==="recruiter"){
      userData=await Recruiter.findById(userId).populate("companyID","name sector logo").lean();
      data={name:userData.companyID.name,sector:userData.companyID.sector,logo:userData.companyID.logo}

    }
    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    profile={
      profilePhoto:user.profilePhoto,
      userId: user._id,  // ID utilisateur
      name: user.name,    // Nom de l'utilisateur
      email: user.email,  // Email de l'utilisateur
      phoneNumber: user.phoneNumber,  // Numéro de téléphone de l'utilisateur
      address: user.address,  // Adresse de l'utilisateur
      status: user.status, // Statut du recruteur
      data:data, // Nom de la société (peuplé via populate)
      role: user.role,
      gender:user.gender,
    }
    console.log("data : ",profile);
    return profile;
  }

  // Supprimer un utilisateur
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    var recruiter = await Recruiter.findOne({ _id: userId });
    var candidate = await Candidate.findOne({ _id: userId });
    if (recruiter) {
      recruiter = await Recruiter.findByIdAndDelete(userId);
    } else if (candidate) {
      candidate = await Candidate.findByIdAndDelete(userId);
    }
    return user;
  }
}
module.exports = new UserManager();
 */