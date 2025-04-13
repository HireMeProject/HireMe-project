const express = require("express");
const mongoose = require("mongoose");
const { Company } = require("../models/Company");
const { Recruiter } = require("../models/Recruiter");
const fs=require("fs");
const path=require("path");
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
    const { name, sector, logo } = req.body;
    const company = await Company.findOne({ name: name });
    if (company) {
      return res
        .status(400)
        .json({ status: "error", message: "Company already exist" });
    } 
    const newCompany=new Company({name,sector,logo});
    const result=await newCompany.save();
    return res
      .status(200)
      .json({
        status: "success",
        message: "Company created successfully",
        newCompany,
      });
  } catch (error) {
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
    const {sector,description,employeesNumber,foundedDate,location}=req.body;
    const company=await Recruiter.findById(recruiterId).select("companyID");    
    
    // const companyID=company.companyID;
    const companyToEdit=await Company.findByIdAndUpdate(company.companyID,
      {$set:{sector,description,employeesNumber,foundedDate,location}},
      {new:true}
    )
    console.log("companyID in get members: ",company.companyID)
    if(!companyToEdit){
      return res.status(404).json({ status: "error", message: "Company not found" });
    }
    return res.status(200).json({ status: "success", message: companyToEdit });
  }
  catch(error){
    console.log(error);
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
module.exports = {
  addCompany,
  DeleteCompany,
  GetAllCompanies,
  GetMyCompany,
  GetMembers,
  companyPhotoUploadCtrl,
  EditCompany,
};
