const mongoose=require("mongoose");
const RecruiterSchema = new mongoose.Schema({
    recruiterID: {
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required: true,
    },
    companyID:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Company',
        required: true,
    },
    jobOffers: [
        { type: mongoose.Schema.Types.ObjectId, 
        ref: 'JobOffer' }]
   
}, { timestamps: true });

const Recruiter = mongoose.model('Recruiter', RecruiterSchema);
module.exports={
    Recruiter,
}