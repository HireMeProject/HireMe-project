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

class RecruiterManager{
    async GetProfile(recruiterId){
        const recruiter=await Recruiter.findById(recruiterId).populate("companyID","name").lean();
        const companyLogo=await Recruiter.findById(recruiterId).populate("companyID","logo").lean();
        const user=await User.findById(recruiterId);
        if(recruiter){
            const recruiterProfile = {
                profilePhoto:user.profilePhoto,
                // userId: user._id,  
                // // ID utilisateur
                name: user.name,    // Nom de l'utilisateur
                email: user.email,  // Email de l'utilisateur
                phoneNumber: user.phoneNumber,  // Numéro de téléphone de l'utilisateur
                address: user.address,
                birthDate:user.birthDate,  // Adresse de l'utilisateur
                gender: user.gender, // Statut du recruteur
                status: user.status, // Statut du recruteur
                // companyLogo:companyLogo.companyID.logo,
                company: recruiter.companyID.name,  // Nom de la société (peuplé via populate)
                role: user.role  // Rôle du recruteur (par exemple, "recruiter")
            };
            return recruiterProfile;
        }
        throw { status: 404, message: "Recruiter not found" };
    }
    //Get Candidates Profile
    async GetCandidateProfile(query,recruiterId,applicationId){
        const application=await ApplicationManager.GetApplicationById(query,recruiterId,applicationId);
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