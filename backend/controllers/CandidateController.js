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
module.exports={GetProfile};