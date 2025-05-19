const express = require("express");
const mongoose = require("mongoose");
const { Company } = require("../models/Company");
const { Recruiter } = require("../models/Recruiter");
const fs=require("fs");
const path=require("path");
const CompanyManager=require("../Services/CompanyManager");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage
} = require("../utils/cloudinary");
/**
 * @desc add a new company
 * @route /profile
 * @method post
 * @access private admin
 */
const addCompany = async (req, res) => {
  try {
    const { name } = req.body;
    const newCompany=await CompanyManager.addCompany(name);
    return res
      .status(200)
      .json({
        status: "success",
        message: "Company created successfully",
        newCompany,
      });
  } catch (error) {
console.log(error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }
    return res.status(500).json({ status: "error", message: "Server error" });
    }
};
/**
 * @desc remove a company
 * @route company/:id
 * @method delete
 * @access private admin
 */
const DeleteCompany = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status("404")
        .json({ status: "error", message: "Company not found" });
    }
    const recruiter = await Recruiter.findOne({ companyID: req.params.id });
    if (recruiter) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(402)
        .json({
          status: "error",
          message: "cannot delete companies with active users.",
          company,
        });
    }
    await session.commitTransaction();
    session.endSession();
    return res
      .status(200)
      .json({
        status: "success",
        message: "Company deleted successfully",
        company,
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
/**
 * @desc get Companies 
 * @route /companies
 * @method get
 * @access public
 */
const GetAllCompanies=async(req,res)=>{
    try{
        const companies = await Company.find();
        if (companies.length === 0) {
          return res.status(200).json({ status: "success", message: 'The list is empty' });
        }
    
        return res.status(200).json({ status: "success", companies });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}
/**
 * @desc get my company 
 * @route /companies
 * @method get
 * @access public
 */
const GetMyCompany=async(req,res)=>{
  try{
    const recruiterId=req.user.id;
    const company=await Recruiter.findById(recruiterId).populate("companyID");
    if(company){
      return res.status(200).json({ status: "success", message: company });
    }
    
  }
  catch(error){
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server error" });
}
}
/**
 * @desc edit company  
 * @route /companies
 * @method patch
 * @access public
 */
const EditCompany=async(req,res)=>{
  try{
    const recruiterId=req.user.id;
    const company=await CompanyManager.EditCompany(recruiterId,req.body);    
    
    return res.status(200).json({ status: "success", message: company });
  }
  catch(error){
   console.log(error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }
    return res.status(500).json({ status: "error", message: "Server error" });
    }
  }

/**
 * @desc add Emp to company  
 * @route /companies
 * @method post
 * @access public
 */
const addEmployee=async(req,res)=>{
   try{
    const {companyId}=req.params;
    const {email,name,position}=req.body;
    const company=await CompanyManager.addEmployee(name,email,position,companyId);    
    console.log("donnée renvoyés : ",company);
    
    return res.status(200).json({ status: "success", message: company });
  }
  catch(error){
   console.log(error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }
    return res.status(500).json({ status: "error", message: "Server error" });
    }
}

/**-----------------------------------------------
 * @desc    Profile Photo Upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
 const companyPhotoUploadCtrl = async (req, res) => {
    try{
      console.log("in upload logo")
        // 1. Validation
    if (!req.file) {
        console.log("ici a 1");

        return res.status(400).json({ message: "no file provided" });
      }
    
      // 2. Get the path to the image
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
      console.log("ici a 2",imagePath);

      // 3. Upload to cloudinary
      const result = await cloudinaryUploadImage(imagePath);
      console.log("ici a 3");

      // 4. Get the user from DB
      console.log("ici a 4 req.user.id :",req.user.id);
      const companyID = await Recruiter.findById(req.user.id).populate("companyID");
      console.log("companyyy : ",companyID.companyID);
      console.log("company profile pic : ",companyID.companyID.logo);

      const company=await Company.findById(companyID.companyID. _id);
      // 5. Delete the old profile photo if exist
      if (company.logo?.publicId !== null) {
        await cloudinaryRemoveImage(company.logo.publicId);
      }
      console.log("id public : ",company.logo.publicId)
    
      // 6. Change the profilePhoto field in the DB
      company.logo = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      await company.save();
    
      // 7. Send response to client
      res.status(200).json({
        message: "your profile photo uploaded successfully",
        logo: { url: result.secure_url, publicId: result.public_id },
      });
    
      // 8. Remvoe image from the server
      fs.unlinkSync(imagePath);
    }
    catch(error){
        console.log(error.message)
        return res.status(600).json({ status: "error", message: error.message });
    }
    
  };
/**
 * @desc get company members 
 * @route /companies
 * @method get
 * @access public
 */
const GetMembers=async(req,res)=>{
  try{
    const recruiterId=req.user.id;
    const companyID=await Recruiter.findById(recruiterId);
    // const companyID=req.params.companyID;
    console.log("company id in get members : ",companyID.companyID);
    const companyExist=await Company.findById(companyID.companyID);
    if(!companyExist){
      return res.status(404).json({ status: "success", message: "company doesnt exist" });
    }
    const members=await Recruiter.find({companyID:companyID.companyID}).populate("recruiterID");
    if(members){
      return res.status(200).json({ status: "success", message: members });
    }
  }
  catch(error){
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server error" });
}
}
/**-----------------------------------------------
 * @desc    Employee Profile Photo Upload
 * @route   /api/users/profile/profile-photo-upload/:companyName/:indexEmp
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
 const employeeProfilePhotoUploadCtrl = async (req, res) => {
    try{
        // 1. Validation
    if (!req.file) {
        return res.status(400).json({ message: "no file provided" });
      }
    
      // 2. Get the path to the image
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
      console.log("image path : ",imagePath);

      // 3. Upload to cloudinary
      const result = await cloudinaryUploadImage(imagePath);

      //recuperation du company 
      const {name}=req.params;
    const index = parseInt(req.query.index, 10);
    if (isNaN(index)) {
      return res.status(400).json({ message: "Index invalide" });}

      const company=await Company.findOne({name:name});
      if (!company || !company.employeesList || !company.employeesList[index]) {
              console.log("probleme at employés introuvable ");

       return res.status(404).json({ status: "error", message: "Employé introuvable" });
      }
      const employee = company.employeesList[index];
            console.log("image upload index : ",index);
      console.log(" emp index : ",employee);

      // 5. Delete the old profile photo if exist
      if (employee.profilePic?.publicId !== null) {
        await cloudinaryRemoveImage(employee.profilePic.publicId);
      }
      // console.log("id public : ",user.profilePhoto.publicId)
    
      // 6. Change the profilePhoto field in the DB
      employee.profilePic = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      console.log(employee.profilePic.url)
      await company.save();
       fs.unlinkSync(imagePath);
      // 7. Send response to client
      return res.status(200).json({
        message: "your employee profile photo uploaded successfully",
        profilePic: { url: result.secure_url, publicId: result.public_id },
      });
    

    }
    catch(error){
        console.log(error.message)
        return res.status(600).json({ status: "error", message: error.message });
    }
    
  };
  
  
module.exports = {
  addCompany,
  DeleteCompany,
  GetAllCompanies,
  GetMyCompany,
  GetMembers,
  companyPhotoUploadCtrl,
  EditCompany,
  employeeProfilePhotoUploadCtrl,
  addEmployee,
};
