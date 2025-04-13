const express = require("express");
const router = express.Router();
const {
  addCompany,
  DeleteCompany,
  GetAllCompanies,
} = require("../controllers/CompanyController");
const {
  verifyAdmin,
  VerifyToken,
  verifyCandidate,
  verifyRecruiter,
} = require("../middlewares/Authmiddleware");
const {
  UpdateUserProfile,
  GetUserById,
  GetAllUsers,
  GetUsersByrole,
  DeleteUser,
} = require("../controllers/UserController");
const userManager = require("../Services/UserManager");
const {GetAllJobOffers}=require("../controllers/JobOfferController");
const {createSubscription,
  updateSubscription,
  getAllActiveSubscriptions,}=require("../controllers/SubscriptionController");

router.route("/admin/companies").get(verifyAdmin, GetAllCompanies);
router.route("/admin/companies").post(verifyAdmin, addCompany);
router.route("/admin/companies/:id").delete(verifyAdmin, DeleteCompany);
// router.route("/update-user-status/:id").patch(verifyAdmin, UpdateUserProfile);

router.route("/users").get(verifyAdmin, verifyAdmin, GetAllUsers);
router.route("/users/:role").get(verifyAdmin,GetUsersByrole);
router.route("/users-profile/:id").get(verifyAdmin, GetUserById);
router.route("/users/:id").post(verifyAdmin, DeleteUser);
router.route("/job-offers").post(verifyAdmin,GetAllJobOffers);
//Subscriptions
router.route("/subscriptions").get(VerifyToken, getAllActiveSubscriptions);
router.route("/subscriptions").post(verifyAdmin, createSubscription);
router.route("/subscriptions").patch(verifyAdmin, updateSubscription);



module.exports = router;
