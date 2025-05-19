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
        // required:true,
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
        // required:true,
    },
    foundedDate:{
        type:Date,
        // required:true,
    },
    location:{
        type:String,
        // required:true,
    },
    employeesList:[{
        name:{
            type:String,
        },
        email:{
            type:String,
            unique:true,
        },
        position:{
            type:String,
        },
        profilePic:{
            type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
            publicId: null,
        }
        },
        index:{
            type:Number,
        },
    }]
    // listRecruiters:[{
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'User' ,
    // }],

}, { timestamps: true });

const Company = mongoose.model('Company', CompanySchema);
module.exports={
    Company,
}