const express = require("express");
const mongoose = require("mongoose");
const { Application } = require("../models/Application");
const { Candidate } = require("../models/Candidate");
const {JobOffer}=require("../models/JobOffer");
const ApplicationManager=require("../Services/ApplicationManager");
/**
 * @desc add a new application
 * @route /joboffers/:id
 * @method post
 * @access private candidate
 */
const CreateApplication=async(req,res)=>{
    try{
        const candidateID=req.user.id;
        const jobID=req.params.id;
        const application= await ApplicationManager.CreateApplication(candidateID,jobID);
        return res
      .status(200)
      .json({
        status: "success",
        message: "You have successfully applied for the job offer",
        application,
      });
    }
    catch(error){
        console.log(error);
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}
/**
 * @desc Get my application
 * @route /joboffers/:id
 * @method post
 * @access private candidate
 */
const GetMyApplications=async(req,res)=>{
    try{
    const candidateID=req.user.id;
    console.log("candidateID: ",candidateID)
    const applications= await ApplicationManager.GetMyApplications(candidateID,req.query);
    return res
      .status(200)
      .json({
        status: "success",
        applications,
      });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}
/**
 * @desc get My Job Applications 
 * @route /MyApplications?status=status
 * @method get
 * @access private recruiters, recruiter manager
 */
const GetMyJobApplications = async (req, res) => {
    try {
        const recruiterId = req.user.id;
        const applications= await ApplicationManager.GetMyJobApplications(req.query,recruiterId);
        return res.status(200).json({ status: "success", applications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
};
/**
 * @desc get My Job Applications 
 * @route /MyApplications?status=status/:applicationId
 * @method post
 * @access private recruiters, recruiter manager
 */
const UpdateApplication= async(req,res)=>{
    try {
        const recruiterId = req.user.id;
        const applicationId=req.params.id;
        const status=req.body.status;
        const applications= await ApplicationManager.UpdateApplication(req.query,recruiterId,applicationId,status);
        return res.status(200).json({ status: "success", applications });
    } catch (error) {
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
 * 
 */
const GetApplicationById=async(req,res)=>{
    try{
        const recruiterId=req.user.id;
        const application= await ApplicationManager.GetApplicationById("",recruiterId,req.params.id);
        return res.status(200).json({ status: "success", application });
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

module.exports={
    CreateApplication,
    GetMyApplications,
    UpdateApplication,
    GetMyJobApplications,
    GetApplicationById
}
