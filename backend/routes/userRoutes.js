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
    profilePhotoUploadCtrl,
    getSubscribedRecruitersCount,
    GetAllUsersWithoutQuery,}=require("../controllers/UserController");
const {verifyAdmin,
    VerifyToken,
    verifyCandidate,
    verifyRecruiter,
    authenticateSocket,
verifyAcountStatus}=require("../middlewares/Authmiddleware");
const {
    PostJobOffer,
    UpdateJobOffer,
    GetAllJobOffers,
    GetJobOfferpById,
    DeleteJobOffer,
    GetMyJobOffers,
    SearchJob,}=require("../controllers/JobOfferController");
const JobOfferManager=require("../Services/JobOfferManager");
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
}=require("../controllers/CategoryController");
const {getNotificationsByUser,
    markAsRead,createNotif}=require("../controllers/NotificationController")
const photoUpload = require("../middlewares/photoUpload");
const UserManager = require('../Services/UserManager');
const {companyPhotoUploadCtrl}=require("../controllers/CompanyController");

router.route("/signup").post(RegisterUser, userManager.ValidateUser);
router.route("/signuprecruiter").post(RegisterRecruiter, userManager.ValidateRecruiter);
router.route("/login").post(LoginUser, userManager.validateLoginUser);
router.route("/logout").post(logout); 
router.route("/update-profile").patch(VerifyToken,UpdateUser);
router.route("/users").get(verifyAdmin,GetAllUsers);
router.route("/all-users").get(verifyAdmin,GetAllUsersWithoutQuery);
router.route("/users/:role").get(GetUsersByrole);
router.route("/users-profile/:id").get(VerifyToken,GetUserById);
// router.route("/myprofile").get(VerifyToken,GetUserById);
router.route("/users/:id").post(verifyAdmin,DeleteUser);
router.route("/profile/profile-photo-upload")
  .post(VerifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

router.route("/mycompany/logo-photo-upload")
  .post(VerifyToken, photoUpload.single("image"), companyPhotoUploadCtrl);
router.get("/subscribed-recruiters-count", getSubscribedRecruitersCount);
//job offers
router.route("/joboffers").get(GetAllJobOffers);
router.route("/joboffers-search").get(SearchJob);
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
//notifs

// Créer une notification (ex: pour test ou admin)
router.post("/notifications", VerifyToken, createNotif);

// Récupérer les notifications de l’utilisateur connecté
router.get("/notifications", VerifyToken, getNotificationsByUser);

// Marquer comme lue une notification
router.patch("/notifications/read", VerifyToken, markAsRead);
module.exports=router;