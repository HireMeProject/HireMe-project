const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/User");
const { JobOffer } = require("../models/JobOffer");
const { Application } = require("../models/Application");
const { Candidate } = require("../models/Candidate");
const JobOfferManager = require("../Services/JobOfferManager");

/**
 * @desc publier des offres d'emploi
 * @route /posts
 * @method POST
 * @access public
 */
const PostJobOffer = async (req, res) => {
  try {
    recruiterId = req.user.id;
    const newJobOffer = await JobOfferManager.PostJobOffer(
      req.body,
      recruiterId
    );
    return res
      .status(200)
      .json({
        status: "success",
        message: "Job offer Inserted Successfuly",
        newJobOffer,
      });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
/**
 * @desc get joboffers
 * @route /joboffers?category=category&minsalary=minsalary&maxsalary=maxsalary&status=status
 * @method get
 * @access public
 */
const GetAllJobOffers = async (req, res) => {
  try {
    const {
      category,
      status,
      contractType,
      minsalary,
      maxsalary,
      page,
      limit,
    } = req.query;
    //transformer en tab si sont des strings
    const parseToArray = (val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    };
    const filters = {
      category: parseToArray(category),
      status: parseToArray(status),
      contractType: parseToArray(contractType),
      minsalary: minsalary ? Number(minsalary) : undefined,
      maxsalary: maxsalary ? Number(maxsalary) : undefined,
      limit:limit,
      page:page
    };
    const jobOffers = await JobOfferManager.GetAllJobOffers(filters);
    return res.status(200).json({ status: "success", jobOffers });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

/**
 * @desc Get Job offer by id
 * @route /joboffers/:id
 * @method get
 * @access public
 */
const GetJobOfferpById = async (req, res, next) => {
  try {
    const jobOffer = await JobOfferManager.GetJobOfferById(req.params.id);
    return res.status(200).json({ status: "success", jobOffer });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
/**
 * @desc get my joboffers
 * @route /joboffers?category=category&minsalary=minsalary&maxsalary=maxsalary&status=status
 * @method get
 * @access public
 */
const GetMyJobOffers = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const jobOffers = await JobOfferManager.GetMyJobOffers(
      recruiterId,
      req.query
    );
    return res.status(200).json({ status: "success", message: jobOffers });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
/**
 * @desc Update Job offer
 * @route /myjoboffers/:id
 * @method put
 * @access private
 */
const UpdateJobOffer = async (req, res) => {
  console.log("id job",req.params.id)

  try {
    const recruiterId = req.user.id;
    const jobOffer = await JobOfferManager.UpdateJobOffer(
      recruiterId,
      req.params.id,
      req.body
    );

    return res
      .status(200)
      .json({ status: "success", message: "job offer Updated ", jobOffer });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res
        .status(error.status)
        .json({ status: "error", message: error.message });
    }
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};
/**
 * @desc Delete Job offer
 * @route /joboffers/:id
 * @method Delete
 * @access private
 */
// const DeleteJobOffer = async (req, res, next) => {

//     try {
//         const jobOfferId = req.params.id;
//         // Vérifier si le Job offer existe
//         const jobOfferToDelete = await JobOfferManager.DeleteJobOffer(jobOfferId);

//         return res.status(200).json({ status: "success", message: jobOfferToDelete });
//     } catch (error) {
//       console.log(error);
//       if (error.status) {
//           return res.status(error.status).json({ status: "error", message: error.message });
//       }

//       return res.status(500).json({ status: "error", message: "Server error" });
//     }
//   };
const DeleteJobOffer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const jobOfferId = req.params.id;
    // Vérifier si le Job offer existe
    const jobOfferToDelete = await JobOffer.findById(jobOfferId).session(
      session
    );
    if (!jobOfferToDelete) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ status: "error", message: "Job offer does not exist" });
    }
    //verifier s il y a des candidatures ayant statuts acceptés
    const Applications = await Application.find({
      jobID: jobOfferId,
      status: { $in: ["Approved", "pending"] },
    }).session(session);
    if (Applications.length > 0) {
      await Application.updateMany(
        { jobID: jobOfferId },
        { status: "rejected" }
      ).session(session);
    }
    // Suppression des candidatures liées à l'offre
    // await Application.deleteMany({jobOfferToDelete},{session});
    // Supprimer le offre d emploi
    await JobOffer.findByIdAndDelete(jobOfferId).session(session);

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({
        status: "success",
        message: "Offre d'emploi supprimé avec succès",
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

module.exports = {
  PostJobOffer,
  UpdateJobOffer,
  GetAllJobOffers,
  GetJobOfferpById,
  DeleteJobOffer,
  GetMyJobOffers,
};
