const express = require("express");
const mongoose = require("mongoose");
const { Company } = require("../models/Company");
const { Recruiter } = require("../models/Recruiter");
const fs=require("fs");
const path=require("path");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage
} = require("../utils/cloudinary");
class CompanyManager{
    async addCompany(name){
        const company=await Company.findOne({name});
        console.log("name company : ",name)
        if (company) {
            throw { status: 401, message: "Company already exist" };
        } 
        const newCompany=new Company({name});
        const result=await newCompany.save();
        return result;
    }
    //Edit company profile
    async EditCompany(recruiterId,companyData){
        const {sector,description,employeesNumber,foundedDate,location}=companyData;
        //recuperer la company de recruteur
        const company=await Recruiter.findById(recruiterId).select("companyID");
        const companyToEdit=await Company.findByIdAndUpdate(company.companyID,
              {$set:{sector,description,employeesNumber,foundedDate,location}},
              {new:true}
            )
         if(!companyToEdit){
      throw { status: 404, message: "Company not found" };
    }

    return companyToEdit;
    }
    async addEmployee(name,email,position,companyId){
        const company = await Company.findById(companyId);
        if(!company){
            throw { status: 404, message: "Company not found" };
        }
        const newEmployee = { name, email, position,}
        company.employeesList.push(newEmployee);
        await company.save();
        const index=company.employeesList.length - 1;
        console.log("index in addemp : ",index);
        return {
            index,
            newEmployee,
        }

    }

}
module.exports=new CompanyManager();