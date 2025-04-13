const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/User");
const { Subscription } = require("../models/Subscription");
const { Application } = require("../models/Application");
const { Candidate } = require("../models/Candidate");
const SubscriptionManager = require("../Services/SubscriptionManager");

/**
 * @desc publier des offres d'emploi
 * @route /posts
 * @method POST
 * @access public
 */
const createSubscription = async (req, res) => {
  try {
    const newSubscription = await SubscriptionManager.createSubscription(
      req.body,
    );
    return res
      .status(200)
      .json({
        status: "success",
        message: "Subscription Inserted Successfuly",
        newSubscription,
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
 * @desc get Subscriptions
 * @route /Subscriptions?category=category&minsalary=minsalary&maxsalary=maxsalary&status=status
 * @method get
 * @access public
 */
const getAllActiveSubscriptions = async (req, res) => {
  try {
    const Subscriptions = await SubscriptionManager.getAllActiveSubscriptions();
    return res.status(200).json({ status: "success", Subscriptions });
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
 * @desc get Subscriptions
 * @route /Subscriptions?category=category&minsalary=minsalary&maxsalary=maxsalary&status=status
 * @method get
 * @access public
 */
const updateSubscription = async (req, res) => {
    try {
    const subscriptionId=req.params.id;
      const Subscriptions = await SubscriptionManager.getAllActiveSubscriptions(subscriptionId,req.body);
      return res.status(200).json({ status: "success", Subscriptions });
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
module.exports={
    createSubscription,
    updateSubscription,
    getAllActiveSubscriptions,
}