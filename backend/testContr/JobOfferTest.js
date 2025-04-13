const express=require("express");
const mongoose=require("mongoose");
const {User}=require("../models/User");
const {JobOffer}=require("../models/JobOffer");
const {Application}=require("../models/Application");
const {Candidate}=require("../models/Candidate");
const joi=require('joi');

function ValidateJobOffer(obj){
    const schema=joi.object({
        title:joi.string().trim().required().min(2),
        description:joi.string(),
        contractType:joi.string().required(),
        location:joi.string().required().trim(),
        salary:joi.number().positive().precision(2).required(),
        status:joi.string().valid("open","closed"),
        })
    return schema.validate(obj);
}
function ValidateUpdateJobOffer(obj){
    const schema=joi.object({
        title:joi.string().trim().min(2),
        description:joi.string(),
        contractType:joi.string(), 
        location:joi.string().trim(),
        salary:joi.number().positive().precision(2),
        status:joi.string().valid("open","closed"),
        })
    return schema.validate(obj);
}
/**
 * @desc publier des offres d'emploi 
 * @route /posts
 * @method POST
 * @access public
 */
const PostJobOffer=async(req,res)=>{
    const {error}=ValidateJobOffer(req.body);
    console.log("in post job");
    if(error){
        return res.status(400).json({"status": "error",message:error.details[0].message});
    }
    try{
        const {category,title, description, contractType, location, salary, publicationDate, status } = req.body;
        const recruiterId=req.user.id;
        console.log(recruiterId);
        const NewJobOffer=new JobOffer({
            category,recruiterId,title,description,contractType,location,publicationDate,status,salary
        });
        const result=await NewJobOffer.save();
        return res.status(200).json({"status": "success",message:"Job offer Inserted Successfuly",result});
    }   
    catch(error){
        console.log(error);
        return res.status(500).json({"status": "error",message: "Server error"});
    } 
}
/**
 * @desc get joboffers 
 * @route /joboffers?category=category&minsalary=minsalary&maxsalary=maxsalary&status=status
 * @method get
 * @access public
 */
const GetAllJobOffers=async(req,res)=>{
    try{
        const query = {};
        const { category, minsalary ,maxsalary,status } = req.query;
        if (minsalary) query.salary = { ...query.salary, $gte: minsalary };
        if (maxsalary) query.salary = { ...query.salary, $lte: maxsalary };
        if (category) query.category = { $regex: category, $options: 'i' };
        if (status) query.status = { $regex: status, $options: 'i' };
        const jobOffers = await JobOffer.find(query);
        if (jobOffers.length === 0) {
          return res.status(200).json({ status: "success", message: 'The list is empty' });
        }
    
        return res.status(200).json({ status: "success", jobOffers });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}

/**
 * @desc Get Job offer by id
 * @route /joboffers/:id
 * @method get
 * @access public 
 */
const GetJobOfferpById=async(req,res,next)=>{
    try{
    const jobOffer=await JobOffer.findOne({_id:req.params.id});
    if(jobOffer){
        return res.status(200).json({"status": "success",jobOffer});
    }
    return res.status(404).json({"status": "error",message:'Job offer not found'});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({"status": "error",message: "Server error"});
    }
}
/**
 * @desc get my joboffers 
 * @route /joboffers?category=category&minsalary=minsalary&maxsalary=maxsalary&status=status
 * @method get
 * @access public
 */
const GetMyJobOffers=async(req,res)=>{
    try{
        const query = {};
        const recruiterId=req.user.id;
        const { category, minsalary ,maxsalary,status } = req.query;
        if (minsalary) query.salary = { ...query.salary, $gte: minsalary };
        if (maxsalary) query.salary = { ...query.salary, $lte: maxsalary };
        if (category) query.category = { $regex: category, $options: 'i' };
        console.log(query.status)

        if (status) query.status = { $regex: status, $options: 'i' };
        query.recruiterId = recruiterId;
        const jobOffers = await JobOffer.find(query);
        if (jobOffers.length=== 0) {
          return res.status(200).json({ status: "success", message: 'The list is empty' });
        }
    
        return res.status(200).json({ status: "success", jobOffers });
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({ status: "error", message: "Server error" });
    }
}
/**
 * @desc Update Job offer 
 * @route /myjoboffers/:id
 * @method put
 * @access private
 */
const UpdateJobOffer=async(req,res)=>{
    const {error}=ValidateUpdateJobOffer(req.body);
    console.log("in update")
    if(error){
        return res.status(400).json({"status": "error",message:error.details[0].message});
    }
    try{
        const recruiterId=req.user.id;
        const jobOffers = await JobOffer.find({recruiterId:recruiterId}).select("_id");
        const isOwner = jobOffers.some(offer => offer._id.toString() === req.params.id);
        if(!isOwner){
            return res.status(400).json({"status": "error",message:"you can only update your offers "});
        }
    
    const {category,title, description, contractType, location, salary, publicationDate, status } = req.body;
    const jobOffer=await JobOffer.findByIdAndUpdate(req.params.id,{
        $set:{
            category,title,description, contractType, location, salary, publicationDate, status,
        }
    },{new:true,})
    if(!jobOffer){
        return res.status(404).json({"status": "error",message:"job offer does not exist"}); 
        }
        return res.status(200).json({"status": "success",message:"job offer Updated ",jobOffer});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({"status": "error",message: "Server error"});
    }
};
/**
 * @desc Delete Job offer
 * @route /joboffers/:id
 * @method Delete
 * @access private 
 */
const DeleteJobOffer = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const jobOfferId = req.params.id;
        // Vérifier si le Job offer existe
        const jobOfferToDelete = await JobOffer.findById(jobOfferId).session(session);
        if (!jobOfferToDelete) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ status: "error", message: "Job offer does not exist" });
        }
        //verifier s il y a des candidatures ayant statuts acceptés 
        const Applications = await Application.find({ jobID: jobOfferId , status: { $in: ["Approved", "pending"]}}).session(session);
        if (Applications.length > 0) {

         await Application.updateMany(
            { jobID: jobOfferId },
            { status: "rejected" }
        ).session(session);

        }
        // Suppression des candidatures liées à l'offre
        // await Application.deleteMany({jobOfferToDelete},{session});
        // Supprimer le offre d emploi
        await JobOffer.findByIdAndDelete(jobOfferId).session(session);
        
        await session.commitTransaction();
        session.endSession();
        
        return res.status(200).json({ status: "success", message: "Offre d'emploi supprimé avec succès" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      return res.status(500).json({ status: "error", message: "Server error" });
    }
  };
  
module.exports={
    ValidateJobOffer,
    ValidateUpdateJobOffer,
    PostJobOffer,
    UpdateJobOffer,
    GetAllJobOffers,
    GetJobOfferpById,
    DeleteJobOffer,
    GetMyJobOffers,
}
