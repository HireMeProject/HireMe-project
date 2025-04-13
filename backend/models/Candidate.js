const mongoose=require('mongoose');
const CandidateSchema=new mongoose.Schema({
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cv: { type: String,default:"" },
    skills: { type: [String] }, 
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }] ,
})
const Candidate=mongoose.model('Candidate',CandidateSchema);
module.exports={
    Candidate,
}