const express=require("express");
const mongoose=require("mongoose");
const {User}=require("../models/User");
const {JobOffer}=require("../models/JobOffer");
const {Application}=require("../models/Application");
const {Candidate}=require("../models/Candidate");
const {UpdateUser}=require('./UserController');
const { Recruiter } = require("../models/Recruiter");
const {Company}=require("../models/Company");
const CandidateManager=require("../Services/CandidateManager");
const fs = require("fs");
const path = require("path");
const cloudinary = require('cloudinary').v2;
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage,
  cloudinaryUploadCv,
  cloudinaryRemoveRawFile,
} = require("../utils/cloudinary");
/**
 * @desc get Applications 
 * @route /profile
 * @method get
 * @access private candidate
 */
const GetProfile=async(req,res)=>{
    try{
        const candidateId=req.user.id;
        const candidate= await CandidateManager.GetProfile(candidateId);
        return res.status(200).json({ status: "success", candidate });
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
 const CvUploadCtrl = async (req, res) => {
    try{
        // 1. Validation
    if (!req.file) {
        console.log("ici a file 1");

        return res.status(400).json({ message: "no file provided" });
      }
    
      // 2. Get the path to the image
      const CvPath = path.join(__dirname, `../uploads/${req.file.filename}`);
      console.log("ici a 2 file path : ",CvPath);

      // 3. Upload to cloudinary
      const result = await cloudinaryUploadCv(CvPath);

      // 4. Get the user from DB
      // console.log("ici a 4 req.user.id :",req.user.id);
      const user = await Candidate.findById(req.user.id);
      console.log("user : ",user);
      console.log("user cv  : ",user.cv);

    
      // 5. Delete the old profile photo if exist
      if (user.cv?.publicId !== null) {
        await cloudinaryRemoveRawFile(user.cv.publicId);
      }
      console.log("id public : ",user.cv.publicId)
    
      // 6. Change the profilePhoto field in the DB
      user.cv = {
        url:result.secure_url,

        publicId: result.public_id,
      };
      await user.save();
      const downloadUrl = cloudinary.url(result.public_id, {
        resource_type: 'raw',
        type: 'upload',
        flags: 'attachment',
        secure: true,
        sign_url: false // À activer en production si nécessaire
      });
      // 7. Send response to client
      res.status(200).json({
        message: "your CV uploaded successfully",
        Cv: {  url: result.secure_url,
            downloadUrl: "downloadUrl",
            publicId: result.public_id,
            fileName: `${user.name}_CV${path.extname(req.file.originalname)}`},
      });
    
      // 8. Remvoe image from the server
      fs.unlinkSync(CvPath);
    }
    catch(error){
        console.log(error.message)
        return res.status(600).json({ status: "error", message: error.message });
    }
    
  };
// const CvUploadCtrl=async(req,res)=>{

// try{
//     const  id  = req.user.id;
    
//     const candidate = await Candidate.findById(id);
//     const item=candidate.cv;
//     if (!item.url) {
//       return next(new Error("No item found"));
//     }
//     const file = item.url;
//     const filePath = path.join(__dirname, `../${file}`);
//     res.download(filePath);
// }
//     catch(error){
//         console.log(error.message)
//         return res.status(600).json({ status: "error", message: error.message });
//     }
// }
module.exports={GetProfile,CvUploadCtrl};