const { User } = require("../models/User");
const { Candidate } = require("../models/Candidate");
const {JobOffer}=require("../models/JobOffer");
const {Application}=require("../models/Application");
const mongoose=require("mongoose")
const joi=require("joi");
const JobOfferManager=require("./JobOfferManager");
const {createNotification}=require("../Services/NotificationManager");
const ApplicationInterface=require("../Interface/ApplicationsInterface");

class ApplicationManager extends ApplicationInterface{
    async CreateApplication(candidateID,jobID){
        const applicationExist=await Application.findOne({jobID,candidateID});
        if(applicationExist){
            throw{status:400,message:"you already aplied to this job"};
        }
        //verifier si le job existe 
        const jobOfferStatus=await JobOffer.findById(jobID);
        if(!jobOfferStatus){
            throw{status:400,message:"Job doesnt exist"};
        }
        // console.log("job status : ",jobOfferStatus);
        //verifier l availability de job offer
        if(jobOfferStatus==="closed"){
            throw { status: 400, message: "you can't apply to a closed job" };
        }
        const candidate=await Candidate.findById(candidateID).populate("candidateId","name");
        const application=new Application({candidateID,jobID});
        const notif=createNotification(jobOfferStatus.recruiterId,"postuler",`${candidate.candidateId.name} a postulé a l'offre d'emploi ${jobOfferStatus.title}`)
        if(!notif){
            throw { status: 400, message: "notif n est pas cree" };
        }
        await application.save();
        return application;
    }
    //GEt My applications candidat
    async GetMyApplications(candidateID,queryData){
         const query = {};
        const { page, limit, status } = queryData;
        const pageQ = parseInt(page) || 1; // Page actuelle
        const limitQ = parseInt(limit) || 5;
        const skip = (pageQ - 1) * limitQ;
        if (status) query.status = { $regex: status, $options: 'i' };
        const applications=await Application.find({candidateID,query}).skip(skip).limit(limitQ);
        if (applications.length === 0) {
            return "this list is empty";
        }
        return applications;
    }
    //user(Admin)
    async GetAllApplications(query,recruiterId){
        const { status } = query;
        if (status) query.status = { $regex: status, $options: 'i' };
        query.recruiterId=recruiterId;
        const applications = await Application.find(query);
    }
    //GEt My applications recruiter
    async GetMyJobApplications(query,recruiterId){
        const { page, limit, status } = query;
        const pageQ = parseInt(page) || 1; // Page actuelle
        const limitQ = parseInt(limit) || 5;
        const skip = (pageQ - 1) * limitQ;
        // Récupérer les offres du recruteur
        const jobOffers = await JobOfferManager.GetMyJobOffers(recruiterId,"");
        // Extraire les IDs des offres
        const jobOfferIds = jobOffers.map(job => job._id.toString());
        // console.log("jobs :" ,jobOfferIds);
        // Construire le filtre
        const filtre = { jobID: { $in: jobOfferIds } };
        // console.log("query :" ,filtre);
        if (status) filtre.status = { $regex: status, $options: "i" };

        // Récupérer les candidatures des offres d'emploi du recruteur
        const applications = await Application.find(filtre)
            .populate("candidateID", "name email").populate("jobID","title").skip(skip).limit(limitQ); // Récupérer nom et email du candidat
         // Vérifier si aucune candidature n'est trouvée

        // if (applications.length === 0) {
        //         return "No applications found." 
        // }
        return applications;
    
    }
    //Recruiter
    async UpdateApplication(query,recruiterId,applicationId,applicationStatus){
        //recuperer la liste de candidature de recruteur
        const myapplications= await this.GetMyJobApplications(query,recruiterId);
        if(!Array.isArray(myapplications)){
            throw {status:404,message:"No application found for your job offers"};
        }
        // console.log("applicationId:",applicationId);
        //filtrer la liste de candidatures de recruteur selon l id de candidature choisit
        const application= myapplications.find(app =>{      
              console.log("app._id:",app._id.toString());
         return app._id.toString()===applicationId});
        // console.log("application::",application);
        if(!application){
            throw {status:404,message:"No application found to update for your job offers"};
        }
        const applicationToUpdate= await Application.findByIdAndUpdate(
            applicationId,
            {$set:{
                status:applicationStatus,
            }},{ new: true });
            // console.log("status app : ",applicationStatus)

        return applicationToUpdate;
    }
    //Recruiter
    async GetApplicationById(query,recruiterId,applicationId){
        //recuperer la liste de candidature de recruteur
        const myapplications= await this.GetMyJobApplications(query,recruiterId);
        if(!Array.isArray(myapplications)){
            throw {status:400,message:"No application found for your job offers"};
        }
        // console.log("applicationId:",applicationId);
        //filtrer la liste de candidatures de recruteur selon l id de candidature choisit
        const application= myapplications.find(app =>{      
            //   console.log("app._id:",app._id.toString());
         return app._id.toString()===applicationId});
        // console.log("application::",application);
        if(!application){
            throw {status:400,message:"No application found to update for your job offers"};
        }
        return application;
    }

}
module.exports=new ApplicationManager();