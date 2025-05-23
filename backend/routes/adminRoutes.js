const express = require("express");
const router = express.Router();
const {
  addCompany,
  DeleteCompany,
  GetAllCompanies,
  GetCompanyByRecruiterId,
} = require("../controllers/CompanyController");
const {
  verifyAdmin,
  VerifyToken,
  verifyCandidate,
  verifyRecruiter,
} = require("../middlewares/Authmiddleware");
const {
  UpdateUserProfile,
  getAdminProfile,
  GetAllUsers,
  GetUsersByrole,
  DeleteUser,
  ManageUserStatus,
  GetUserProfileById,
} = require("../controllers/UserController");
const userManager = require("../Services/UserManager");
const {GetAllJobOffers}=require("../controllers/JobOfferController");
const {createSubscription,
  updateSubscription,
  getAllActiveSubscriptions,}=require("../controllers/SubscriptionController");

router.route("/admin/companies").get(verifyAdmin, GetAllCompanies);
router.route("/admin/companies").post(verifyAdmin, addCompany);
router.route("/admin/companies/:id").delete(verifyAdmin, DeleteCompany);
router.route("/company-profile/:id").get(verifyAdmin, GetCompanyByRecruiterId);

// router.route("/update-user-status/:id").patch(verifyAdmin, UpdateUserProfile);

router.route("/users").get(verifyAdmin, verifyAdmin, GetAllUsers);
router.route("/users/:role").get(verifyAdmin,GetUsersByrole);
router.route("/profile-admin").get(verifyAdmin, getAdminProfile);
router.route("/user-profile/:id").get(verifyAdmin, GetUserProfileById);
router.route("/user-status/:id").patch(verifyAdmin, ManageUserStatus);
router.route("/users/:id").delete(verifyAdmin, DeleteUser);
router.route("/job-offers").post(verifyAdmin,GetAllJobOffers);
//Subscriptions
router.route("/subscriptions").get(VerifyToken, getAllActiveSubscriptions);
router.route("/subscriptions").post(verifyAdmin, createSubscription);
router.route("/subscriptions").patch(verifyAdmin, updateSubscription);



module.exports = router;
