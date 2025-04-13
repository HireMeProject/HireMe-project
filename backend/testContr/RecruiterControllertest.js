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
 * @desc update profile 
 * @route /profile
 * @method post
 * @access private recruiters
 */
// const UpdateProfile=async(req,res)=>{
//     try{
//         const recruiterId=req.user.id;
//         const { name, email, password, birthDate, gender, phoneNumber, address } = req.body;
//         if(password){
//                 const passwordHashed=await bcrypt.hash(password,10);
//                 password=passwordHashed;
//             }
//             const UserToUpdate=await User.findByIdAndUpdate(req.params.id,{
//                 $set:{
//                     name:name,
//                     email:email,
//                     password:password,
//                     phoneNumber:phoneNumber,
//                     address:address,
//                     birthDate:birthDate,
//                     gender:gender,
//                     },
//                 },{new:true,});
//             if(!UserToUpdate){
//                 return res.status(404).json({"status": "error",message:"User does not exist"}); 
//             }
//             // const result=await UserToUpdate.save();
//             return res.status(200).json({"status": "success",message:"User Updated ",UserToUpdate});
//         }
//         catch(error){
//             console.log(error);
//             return res.status(500).json({"status": "error",message: "Server error"});
//         }
// }

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
        
        if (applications.length === 0) {
          return res.status(200).json({ status: "success", message: 'The list is empty' });
        }
    
        return res.status(200).json({ status: "success", applications });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}

/**
 * @desc Get application by job offer id
 * @route /joboffers/:jobofferId/applications 
 * @method get
 * @access public 
 */
const GetApplicationByJobofferId=async(req,res)=>{
    try{
        const {jobID}=req.params;
        // const recruiterId = req.user.id;
    const applications=await Application.find({jobID:jobID});
    if(applications){
        return res.status(200).json({"status": "success",applications});
    }
    if(applications.length==0){
        return res.status(200).json({"status": "success",message:"La liste est vide"});
    }
    return res.status(404).json({"status": "error",message:'candidatures n est pas trouvé'});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({"status": "error",message: "Server error"});
    }
}
/**
 * @desc Get application by id
 * @route /applications/:id
 * @method get
 * @access public 
 */
const GetApplicationById=async(req,res,next)=>{
    try{
        const recruiterId=req.user.id;
    const application=await Application.findOne({_id:req.params.id,});
    if(application){
        return res.status(200).json({"status": "success",application});
    }
    return res.status(404).json({"status": "error",message:'candidature n est pas trouvé'});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({"status": "error",message: "Server error"});
    }
}
/**
 * @desc Update application status
 * @route /applications/:applicationId
 * @method patch
 * @access private
 */
// const updateApplicationStatus=async(req,res)=>{
    // try{
    //     const { jobOfferId, applicationId } = req.params;
    //     const { status } = req.body; 
    //     const recruiterId = req.user.id;
    //     const jobOffer = await JobOffer.findOne({ _id: jobOfferId, recruiterId });
    //     if (!jobOffer) {
    //         return res.status(404).json({ status: "error", message: "Offre d'emploi non trouvée ou non autorisée" });
    //     }
    //     const application = await Application.findOne({ _id: applicationId, jobID: jobOfferId });
    //     if (!application) {
    //         return res.status(404).json({ status: "error", message: "Candidature non trouvée" });
    //     }
    //     application.status = status;
    //     await application.save();
    //     return res.status(200).json({ status: "success", message: "Statut de la candidature mis à jour", application });
//         const { applicationId } = req.params;
//         const { status } = req.body; 
//         const application = await Application.findOne({ _id: applicationId });
//         if (!application) {
//             return res.status(404).json({ status: "error", message: "Candidature non trouvée" });
//         }
//         application.status = status;
//         await application.save();
//         return res.status(200).json({ status: "success", message: "Statut de la candidature mis à jour", application });
       

//      }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({"status": "error",message: "Server error"});    
//     }
// }

/**
 * @desc Delete application
 * @route /:recruiterId/joboffers/:jobofferId/applications/:applicationId
 * @method Delete
 * @access private 
 */


module.exports={
    GetAllApplications,
    GetApplicationByJobofferId,
    GetApplicationById,
    // updateApplicationStatus,
    GetProfile,
    GetCandidateProfile,
    GetListRecruiters,
    // GetMyJobApplications,
}
