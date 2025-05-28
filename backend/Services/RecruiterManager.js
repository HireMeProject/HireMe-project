const { User } = require("../models/User");
const { Candidate } = require("../models/Candidate");
const {JobOffer}=require("../models/JobOffer");
const {Application}=require("../models/Application");
const { Recruiter } = require("../models/Recruiter");
const mongoose=require("mongoose")
const joi=require("joi");
const JobOfferManager=require("../Services/JobOfferManager");
const ApplicationManager=require("../Services/ApplicationManager");
const CandidateManager=require("../Services/CandidateManager");
const IRecruiter = require("../Interface/RecruiterInterface");

class RecruiterManager extends IRecruiter{
    async GetProfile(recruiterId){
        const recruiter=await Recruiter.findById(recruiterId).populate("companyID","name logo").lean();
        const companyLogo=await Recruiter.findById(recruiterId).populate("companyID","logo").lean();
        const user=await User.findById(recruiterId);
        if(recruiter){
            const recruiterProfile = {
                profilePhoto:user.profilePhoto,
                // userId: user._id,  
                name: user.name,    
                email: user.email,  
                phoneNumber: user.phoneNumber,  
                address: user.address,
                birthDate:user.birthDate,  
                gender: user.gender, 
                status: user.status, 
                companyLogo:recruiter.companyID.logo,
                company: recruiter.companyID.name,  
                role: user.role  
            };
            return recruiterProfile;
        }
        throw { status: 404, message: "Recruiter not found" };
    }
    //Get Candidates Profile
    async GetCandidateProfile(query,recruiterId,applicationId){
        console.log("app id in getcandprofile: ",applicationId)
        console.log("recruiter id in getcandprofile: ",recruiterId)
        const application=await ApplicationManager.GetApplicationById(query,recruiterId,applicationId);
                console.log("app0 in getcandprofile: ",application)

        const candidateId=application.candidateID;
        const candidate= await CandidateManager.GetProfile(candidateId);
        if(!candidate){
            throw { status: 404, message: "Candidate Profile not found" };
        }
        return candidate;
    }
    //Get Recruiters List of the same company 
    async GetListRecruiters(recruiterId){
        const companyID=await Recruiter.findById(recruiterId).companyID;
        const recruiters=await Recruiter.find({companyID:companyID}).populate("recruiterID","name email");
        if(!recruiters){
            throw { status: 404, message: " recruiters not found" };
        }
        return recruiters;
    }
}
module.exports= new RecruiterManager();