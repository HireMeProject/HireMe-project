const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/User");
const { Card } = require("../models/Card");
const { Application } = require("../models/Application");
const { Candidate } = require("../models/Candidate");
const CardManager = require("../Services/CardManager");

/**
 * @desc publier des offres d'emploi
 * @route /posts
 * @method POST
 * @access public
 */
const addCard = async (req, res) => {
  try {
    recruiterId = req.user.id;
    const newCard = await CardManager.PostCard(
        recruiterId,
      req.body,
    );
    return res
      .status(200)
      .json({
        status: "success",
        message: "Card Inserted Successfuly",
        newCard,
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
 * @desc get Cards
 * @route /Cards?category=category&minsalary=minsalary&maxsalary=maxsalary&status=status
 * @method get
 * @access public
 */
const getUserCards = async (req, res) => {
  try {
    const Cards = await CardManager.GetAllCards(req.query);
    return res.status(200).json({ status: "success", Cards });
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
    getUserCards,
    addCard,
}