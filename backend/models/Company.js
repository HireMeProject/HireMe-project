const mongoose=require("mongoose");
const CompanySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    sector:{
        type:String,
        required:true,
        trim:true,
    },
    logo:{
        type: Object,
        default: {
            url: "https://www.pinterest.com/pin/840484349201235047/",
            publicId: null,
        }
    },
    description:{
        type:String,
        default:'',
    },
    employeesNumber:{
        type:String,
        required:true,
    },
    foundedDate:{
        type:Date,
        required:true,
    },
    location:{
        type:String,
        required:true,
    }
    // listRecruiters:[{
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'User' ,
    // }],

}, { timestamps: true });

const Company = mongoose.model('Company', CompanySchema);
module.exports={
    Company,
}