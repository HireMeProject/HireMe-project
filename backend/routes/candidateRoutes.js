const express = require('express');
const router = express.Router();
const {verifyCandidate,VerifyToken}=require("../middlewares/Authmiddleware");
const {
    GetAllJobOffers,
    GetJobOfferpById,}=require("../controllers/JobOfferController");
const {GetProfile,CvUploadCtrl}=require("../controllers/CandidateController");
const CvUpload = require("../middlewares/FileUpload");
const {GetMyApplications,CreateApplication}=require("../controllers/ApplicationController");
const {UpdateUser,updateUserCV}=require("../controllers/UserController");
// const {GetCompanyById}=require("../controllers/CompanyController");

router.route("/joboffers").get(GetAllJobOffers);
router.route("/joboffers/:id").get(GetJobOfferpById);
router.route("/joboffers/apply/:id").post(verifyCandidate,CreateApplication);
router.route("/myapplications").get(verifyCandidate,GetMyApplications);
router.route("/profile").get(verifyCandidate,GetProfile);
// router.route("/upload-Cv").post(verifyCandidate,CvUpload,updateUserCV);
router.route("/upload-Cv")
  .post(VerifyToken, CvUpload.single("cv"), CvUploadCtrl);

// router.route("/profile/cv-upload")
//   .post(VerifyToken, CvUpload.single("file"), CvUploadCtrl);
// router.route("/profile/cv-upload")
//   .post(CvUpload.single("file"), addCv)
// router.route("/profile/cv-upload").get(CvUploadCtrl);
// router.route("/company/:id").get(GetCompanyById);



module.exports=router ;
 