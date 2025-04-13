const { required } = require("joi");
const mongoose=require("mongoose");
const ApplicationSchema = new mongoose.Schema({
    jobID: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'JobOffer'
    },
    candidateID:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status:{
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'rejected'],
        default:'pending',
    },
    applicationDate: { type: Date, default: Date.now }, 
},{timestamps:true});
const Application=mongoose.model('Application',ApplicationSchema);
module.exports={
    Application,
}