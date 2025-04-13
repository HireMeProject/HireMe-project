const { User } = require("../models/User");
const { Candidate } = require("../models/Candidate");
const {JobOffer}=require("../models/JobOffer");
const {Application}=require("../models/Application");
const {Category}=require("../models/Category");
const mongoose=require("mongoose")
const joi=require("joi");
const { Recruiter } = require("../models/Recruiter");

class JobOfferManager{
    ValidateJobOffer(obj){
        const schema=joi.object({
            title:joi.string().trim().required().min(2),
            description:joi.string(),
            contractType:joi.string().required(),
            location:joi.string().required().trim(),
            salary:joi.number().positive().precision(2).required(),
            status:joi.string().valid("open","closed"),
            category:joi.string(),
            })
        return schema.validate(obj);
    }
    ValidateUpdateJobOffer(obj){
        const schema=joi.object({
            title:joi.string().trim().min(2),
            description:joi.string(),
            contractType:joi.string(), 
            location:joi.string().trim(),
            salary:joi.number().positive().precision(2),
            status:joi.string().valid("open","closed"),
            category:joi.string(),

            })
        return schema.validate(obj);
    }
    //publier des offres d'emploi 
    async PostJobOffer(jobData,recruiterId){
        const {error}=this.ValidateJobOffer(jobData);
        if(error){
            const errorMessage = error.details[0].message || "Validation failed";
            throw { status: 400, message: errorMessage };
        }
        const category=jobData.category;
            const categoryExist=await Category.findOne({name:category});
        if(!categoryExist){
            throw { status: 404, message: "category doesnt exist" };
        }
        const categoryId=categoryExist._id;
        const recruiter=await Recruiter.findById(recruiterId);
        const companyID=recruiter.companyID.toString();
        const {title, description, contractType, location, salary, publicationDate, status } = jobData;
        const newJobOffer=new JobOffer({companyID,categoryId,title, description, contractType, location, salary, publicationDate, status,recruiterId});
        await newJobOffer.save();
        return newJobOffer;
    }
    //get job offers
    // async GetAllJobOffers(queryData){
    //     const query = {};
        
    //     const { category, minsalary ,maxsalary,status,contractType } = queryData;
    //     let category_id,jobOfferCategory;
    //     if(category){
    //         category_id=await Category.findOne({name:category});
    //         query.categoryId=category_id;
    //     }
    //     if (minsalary) query.salary = { ...query.salary, $gte: minsalary };
    //     if (maxsalary) query.salary = { ...query.salary, $lte: maxsalary };
    //     if (status) query.status = { $regex: status, $options: 'i' };
    //     if (contractType) query.contractType = { $regex: contractType, $options: 'i' };

    //     const jobOffers=await JobOffer.find(query).populate("companyID").populate("categoryId");
    //     if (jobOffers.length === 0) {
    //         // throw { status: 400, message: "This email already exists" };
    //         return "this list is empty";
    //     }
    //     return jobOffers;
    // }
    async GetAllJobOffers(queryData) {
        const query = {};
    
        let { category, minsalary, maxsalary, status, contractType } = queryData;
        const page = parseInt(queryData.page) || 1; // Page actuelle
        const limit = parseInt(queryData.limit) || 5;
        const skip = (page - 1) * limit;
        
        const total = await JobOffer.countDocuments();

        // Parse string to arrays if necessary
        if (typeof category === 'string') category = [category];
        if (typeof status === 'string') status = [status];
        if (typeof contractType === 'string') contractType = [contractType];
    
        // Handle multiple categories
        if (category && category.length > 0) {
            const categories = await Category.find({ name: { $in: category } });
            const categoryIds = categories.map((cat) => cat._id);
            query.categoryId = { $in: categoryIds };
        }
    
        // Salary range
        if (minsalary) query.salary = { ...query.salary, $gte: Number(minsalary) };
        if (maxsalary) query.salary = { ...query.salary, $lte: Number(maxsalary) };
    
        // Status filter (case-insensitive regex or exact match)
        if (status && status.length > 0) {
            query.status = { $in: status.map(s => new RegExp(s, 'i')) };
        }
    
        // Contract type filter
        if (contractType && contractType.length > 0) {
            query.contractType = { $in: contractType.map(type => new RegExp(type, 'i')) };
        }
        console.log("query : ",queryData.page);
        console.log("limit : ",queryData.limit);
        const jobOffers = await JobOffer.find(query)
            .skip(skip)
            .limit(limit)
            .populate("companyID")
            .populate("categoryId");
    
        
    
            return {
                total,
                jobOffers
            };
    }
    
    //Get Job offer by id
    async GetJobOfferById(jobId){
        const jobOffer=await JobOffer.findById(jobId).populate("companyID").populate("categoryId");
        if(!jobOffer){
            throw { status: 404, message: "Job offer not found" };
        }
        // console.log("job offer : ",jobOffer)
        return jobOffer;
    }
    //Get my job offers
    // async GetMyJobOffers(recruiterId,queryData){
    //     const query = {};
    //     const { category, minsalary ,maxsalary,status } = queryData;
    //     if (minsalary) query.salary = { ...query.salary, $gte: minsalary };
    //     if (maxsalary) query.salary = { ...query.salary, $lte: maxsalary };
    //     if (category) query.category = { $regex: category, $options: 'i' };
    //     if (status) query.status = { $regex: status, $options: 'i' };
    //     query.recruiterId = recruiterId;
    //     const jobOffers=await JobOffer.find(query);
    //     if (jobOffers.length === 0) {
    //         /**const category=jobOffers.category;
        
    //         const categoryExist=await Category.findOne({name:category});
    //     if(!categoryExist){
    //         throw { status: 404, message: "category doesnt exist" };
    //     }
    //     const categoryId=categoryExist._id; */
    //         // throw { status: 400, message: "This email already exists" };
    //         return "this list is empty";
    //     }
    //     const myjoboffers={

    //     }
    //     return jobOffers;
    // }
    async GetMyJobOffers(recruiterId, queryData) {
        const query = {};
        const { category, minsalary, maxsalary, status } = queryData;
        let category_id,jobOfferCategory;
        if(category){
            category_id=await Category.findOne({name:category});
            query.categoryId=category_id;
        }

        // Appliquer les filtres de requête
        if (minsalary) query.salary = { ...query.salary, $gte: minsalary };
        if (maxsalary) query.salary = { ...query.salary, $lte: maxsalary };
        // if (category) query.categoryId = { $regex: category, $options: 'i' }; // Utilise `categoryId` car c'est une référence dans `JobOffer`
        if (status) query.status = { $regex: status, $options: 'i' };
        query.recruiterId = recruiterId; // Filtrer par recruteur
        // Récupérer les offres d'emploi en fonction de la requête
        const jobOffers = await JobOffer.find(query);
        // Récupérer et ajouter la catégorie à chaque offre d'emploi
        const jobOffersWithCategory = [];
    
        for (let jobOffer of jobOffers) {
            // Récupérer la catégorie associée à chaque offre d'emploi
            const categoryExist = await Category.findById(jobOffer.categoryId);
    
            if (!categoryExist) {
                throw { status: 404, message: "Category doesn't exist" };
            }
    
            // Ajouter la catégorie aux informations de l'offre d'emploi
            const jobOfferWithCategory = {
                ...jobOffer.toObject(), // Convertir le JobOffer en objet JS simple
                category: categoryExist.name // Ajouter le nom de la catégorie
            };
    
            jobOffersWithCategory.push(jobOfferWithCategory);
        }
    
        return jobOffersWithCategory;
    }
    
    //Update Job offer 
    async UpdateJobOffer(recruiterId, jobId, jobData) {
        console.log("data recu",jobData)
        console.log("job id :",jobId)
        const { error } = this.ValidateUpdateJobOffer(jobData);
        if (error) {
            console.log("eror mesage :",error.details[0].message)
            throw { status: 400, message: error.details[0].message };
        }

        // Vérifier si le recruteur possède bien l'offre d'emploi
        const jobOffers = await JobOffer.find({ recruiterId }).select("_id");
        const isOwner = jobOffers.some(offer => offer._id.toString() === jobId);
        if (!isOwner) {
            throw { status: 403, message: "You can only update your own job offers" };
        }
        const category=jobData.category;
        const {title, description, contractType, location, salary, publicationDate, status } = jobData;

            const categoryExist=await Category.findOne({name:category});
        if(!categoryExist){
            throw { status: 404, message: "category doesnt exist" };
        }
        const categoryId=categoryExist._id;
        let newCategory=await Category.findById(categoryId);
        newCategory=newCategory.name;
        // Mise à jour de l'offre
        const jobOffer = await JobOffer.findByIdAndUpdate(
            jobId,
            { $set: {categoryId,title, description, contractType, location, salary, publicationDate, status } },
            { new: true }
        );
        if (!jobOffer) {
            throw { status: 404, message: "Job offer does not exist" };
        }
        let newJobOffer=jobOffer.toObject();
        //pour retourner le nom de category pas le nom
        newJobOffer.category=newCategory;
        return newJobOffer;
    }
    //Delete job Offer
    async DeleteJobOffer(jobOfferId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            // Vérifier si l'offre d'emploi existe
            const jobOfferToDelete = await JobOffer.findById(jobOfferId).session(session);
            if (!jobOfferToDelete) {
                await session.abortTransaction();
                session.endSession();
                throw { status: 404, message: "Job offer does not exist" };
            }

            // Vérifier si des candidatures sont encore "Approved" ou "Pending"
            const applications = await Application.find({
                jobID: jobOfferId,
                status: { $in: ["Approved", "pending"] }
            }).session(session);

            if (applications.length > 0) {
                // Mettre à jour le statut des candidatures existantes
                await Application.updateMany(
                    { jobID: jobOfferId },
                    { status: "rejected" }
                ).session(session);
            }

            // Supprimer l'offre d'emploi
            await JobOffer.findByIdAndDelete(jobOfferId).session(session);

            await session.commitTransaction();
            session.endSession();

            return { message: "Offre d'emploi supprimée avec succès" };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error.status ? error : { status: 500, message: "Server error" };
        }
    }

}
module.exports=new JobOfferManager();