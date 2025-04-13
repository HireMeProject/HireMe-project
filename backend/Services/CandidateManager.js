const { User } = require("../models/User");
const { Candidate } = require("../models/Candidate");
const {JobOffer}=require("../models/JobOffer");
const {Application}=require("../models/Application");
const { Recruiter } = require("../models/Recruiter");
const mongoose=require("mongoose")
const joi=require("joi");
const JobOfferManager=require("../Services/JobOfferManager");

class CandidateManager{
    async GetProfile(candidateId){
        const candidate=await Candidate.findById(candidateId);
        const user=await User.findById(candidateId);
        if(candidate){
            const candidateProfile = {
                profilePhoto:user.profilePhoto,
                name: user.name,    // Nom de l'utilisateur
                email: user.email,  // Email de l'utilisateur
                phoneNumber: user.phoneNumber,  // Numéro de téléphone de l'utilisateur
                address: user.address,  // Adresse de l'utilisateur
                status: user.status, // Statut du recruteur
                cv:candidate.cv,
                skills: candidate.skills,  
                role: user.role  // Rôle du recruteur
            };
            return candidateProfile;
        }
        throw { status: 404, message: "candidate not found" };
    }
    
}
module.exports=new CandidateManager()