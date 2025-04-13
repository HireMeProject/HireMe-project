const express=require("express");
const mongoose=require("mongoose");
const {User}=require("../models/User");
const {JobOffer}=require("../models/JobOffer");
const {Application}=require("../models/Application");
const {Candidate}=require("../models/Candidate");
const {UpdateUser}=require('./UserController');
const { Recruiter } = require("../models/Recruiter");
const {Company}=require("../models/Company");
const JobOfferManager=require("../Services/JobOfferManager");
const RecruiterManager = require("../Services/RecruiterManager");
const ApplicationManager = require("../Services/ApplicationManager");

/**
 * @desc get Applications 
 * @route /profile
 * @method get
 * @access private recruiters
 */
const GetProfile=async(req,res)=>{
    try{
        const recruiterId=req.user.id;
                const recruiter= await RecruiterManager.GetProfile(recruiterId);
                return res.status(200).json({ status: "success", recruiter });
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
 * @desc get list recruiters 
 * @route /profile
 * @method get
 * @access private recruiters
 */
const GetListRecruiters=async(req,res)=>{
    try{
        const recruiterId=req.user.id;
        if(!recruiterId){
            return res.status(400).json({status:"error",message:"Recruiter id needed"});
        }
        const recruiters= await RecruiterManager.GetListRecruiters(recruiterId);
        return res.status(200).json({ status: "success", recruiters });
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
 * @desc get Applications 
 * @route /profile
 * @method get
 * @access private recruiters
 */
const GetCandidateProfile=async(req,res)=>{
    try{
        const recruiterId=req.user.id;
        const applicationId=req.params.id;
        const candidateProfile=await RecruiterManager.GetCandidateProfile("",recruiterId,applicationId);
                return res.status(200).json({ status: "success", candidateProfile });
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
 * @desc get Applications 
 * @route /Applications?status=status
 * @method get
 * @access private recruiters, recruiter manager
 */
const GetAllApplications=async(req,res)=>{
    try{
        const query = {};
        const recruiterId=req.user.id;
        const applications= await ApplicationManager.GetAllApplications
    
        return res.status(200).json({ status: "success", applications });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}



/**
 * @desc Delete application
 * @route /:recruiterId/joboffers/:jobofferId/applications/:applicationId
 * @method Delete
 * @access private 
 */


module.exports={
    GetProfile,
    GetCandidateProfile,
    GetListRecruiters,
}
