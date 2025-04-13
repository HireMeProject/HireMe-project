const { required, ref, number } = require("joi");
const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
  {
    companyID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    contractType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    publicationDate: {
      type: Date,
      default: Date.now,
    },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

const JobOffer = mongoose.model("JobOffer", JobSchema);

module.exports = {
  JobOffer,
};
