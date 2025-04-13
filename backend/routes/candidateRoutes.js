const express = require('express');
const router = express.Router();
const {verifyCandidate}=require("../middlewares/Authmiddleware");
const {
    GetAllJobOffers,
    GetJobOfferpById,}=require("../controllers/JobOfferController");
const {GetProfile}=require("../controllers/CandidateController");

const {GetMyApplications,CreateApplication}=require("../controllers/ApplicationController");
router.route("/joboffers").get(GetAllJobOffers);
router.route("/joboffers/:id").get(GetJobOfferpById);
router.route("/joboffers/apply/:id").post(verifyCandidate,CreateApplication);
router.route("/myapplications").get(verifyCandidate,GetMyApplications);
router.route("/profile").get(verifyCandidate,GetProfile);


module.exports=router ;
 