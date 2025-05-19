const express = require('express');
const router = express.Router();
const {verifyRecruiter,verifyAcountStatus, VerifyToken,verifySubscriptionRecruiter}=require("../middlewares/Authmiddleware");
const {
    // GetAllApplications,
    // GetApplicationByJobofferId,
    // GetApplicationById,
    // updateApplicationStatus,
    GetCandidateProfile,
    GetProfile,
    GetListRecruiters,}=require("../controllers/RecruiterController");
const {PostJobOffer,
    UpdateJobOffer,
    GetAllJobOffers,
    GetJobOfferpById,
    DeleteJobOffer,
    GetMyJobOffers,
    }=require("../controllers/JobOfferController");
const JobOfferManager=require("../Services/JobOfferManager");
const {
    UpdateApplication,
    GetMyJobApplications,
    GetApplicationById,
}=require("../controllers/ApplicationController");
const {
    createPayment,
    checkPayment,
    cancelPayment,
    createCheckoutSession,
    HandleWebhookEvent,
    verifyPayment,
    GetMyPayments,
} = require('../controllers/PaymentController');
const {
  addCompany,
  DeleteCompany,
  GetAllCompanies,
  GetMyCompany,
  GetMembers,
  EditCompany,
  employeeProfilePhotoUploadCtrl,
  addEmployee,
}=require("../controllers/CompanyController");
const photoUpload = require("../middlewares/photoUpload");

// const { verifyPayment } = require('../Services/PaymentManager');

router.route("/profile").get(verifyRecruiter,verifyAcountStatus,GetProfile);
router.route("/list-recruiters").get(verifyRecruiter,GetListRecruiters);
router.route("/myapplications").get(verifyRecruiter,GetMyJobApplications);
router.route("/myapplications/:id").patch(verifyRecruiter,UpdateApplication);
router.route("/myapplications/:id/profile").get(verifyRecruiter,GetCandidateProfile);
router.route("/myapplications/:id").get(verifyRecruiter,GetApplicationById);
// router.route("/joboffers/:jobofferId/applications").get(verifyRecruiter,GetApplicationByJobofferId);
//router.route("/applications").get(verifyRecruiter,GetAllApplications);

router.route("/joboffer").post(verifyRecruiter,verifySubscriptionRecruiter,PostJobOffer,JobOfferManager.ValidateJobOffer);
router.route("/joboffers").get(GetAllJobOffers);
router.route("/joboffers/:id").get(GetJobOfferpById);
router.route("/myjoboffers").get(verifyRecruiter,GetMyJobOffers);
router.route("/myjoboffers/:id").patch(verifyRecruiter,UpdateJobOffer,JobOfferManager.ValidateUpdateJobOffer);
router.route("/myjoboffers/:id").delete(verifyRecruiter,DeleteJobOffer);

//payment
router.route('/payment/create-checkout-session').post(verifyRecruiter,createCheckoutSession);
router.get('/payment/success',verifyPayment);
router.post('/cancel/:paymentIntentId', cancelPayment);
router.route("/payments").get(verifyRecruiter,GetMyPayments);
router.post('/webhook', express.raw({ type: 'application/json' }),HandleWebhookEvent);
//companies
router.get("/companies",GetAllCompanies );
router.get("/mycompany",verifyRecruiter,GetMyCompany);
router.patch("/mycompany",verifyRecruiter,EditCompany);
router.get("/mycompany-members",VerifyToken,GetMembers );
router.route("/mycompany/addMembers/:companyId").post(verifyRecruiter,addEmployee);
//edit employee profile pic
router.route("/mycompany/:name/employee-photo-upload")
  .post(VerifyToken, photoUpload.single("image"), employeeProfilePhotoUploadCtrl);



module.exports=router 

