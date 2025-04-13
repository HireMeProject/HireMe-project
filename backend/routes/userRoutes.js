const express = require('express');
const router = express.Router();
const userManager=require("../Services/UserManager");
const { UpdateUser,
    GetAllUsers,
    GetUsersByrole,
    GetUserById,
    DeleteUser,
    RegisterRecruiter,
    RegisterUser,
    LoginUser,
    logout,
    profilePhotoUploadCtrl,}=require("../controllers/UserController");
const {verifyAdmin,
    VerifyToken,
    verifyCandidate,
    verifyRecruiter,}=require("../middlewares/Authmiddleware");
const {
    PostJobOffer,
    UpdateJobOffer,
    GetAllJobOffers,
    GetJobOfferpById,
    DeleteJobOffer,
    GetMyJobOffers,}=require("../controllers/JobOfferController");
const JobOfferManager=require("../Services/JobOfferManager");
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
}=require("../controllers/CategoryController");
const photoUpload = require("../middlewares/photoUpload");
const UserManager = require('../Services/UserManager');
const {companyPhotoUploadCtrl}=require("../controllers/CompanyController");

router.route("/signup").post(RegisterUser, userManager.ValidateUser);
router.route("/signuprecruiter").post(RegisterRecruiter, userManager.ValidateRecruiter);
router.route("/login").post(LoginUser, userManager.validateLoginUser);
router.route("/logout").post(logout); 
router.route("/update-profile").patch(VerifyToken,UpdateUser);
router.route("/users").get(verifyAdmin,verifyAdmin,GetAllUsers);
router.route("/users/:role").get(GetUsersByrole);
router.route("/users-profile").get(verifyAdmin,GetUserById);
// router.route("/myprofile").get(VerifyToken,GetUserById);
router.route("/users/:id").post(verifyAdmin,DeleteUser);
router.route("/profile/profile-photo-upload")
  .post(VerifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

  router.route("/mycompany/logo-photo-upload")
  .post(VerifyToken, photoUpload.single("image"), companyPhotoUploadCtrl);
//job offers
router.route("/joboffers").get(GetAllJobOffers);
router.route("/job-offerss").post(verifyRecruiter,PostJobOffer, JobOfferManager.ValidateJobOffer);
router.route("/job-offerss").post(verifyRecruiter,UpdateJobOffer, JobOfferManager.ValidateUpdateJobOffer);
router.route("/job-offerss").post(verifyRecruiter,GetJobOfferpById);
router.route("/job-offerss").post(verifyRecruiter,DeleteJobOffer);
router.route("/job-offerss").post(verifyRecruiter,GetMyJobOffers);
//Categories
router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports=router;