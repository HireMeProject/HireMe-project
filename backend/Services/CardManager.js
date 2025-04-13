const {Card} = require('../models/Card');
const {Recruiter}=require("../models/Recruiter");

class CardManager {
   async addCard(recruiterId, cardData) {
    const recruiter= await Recruiter.findById()
    if(recruiterId){
    const newCard=new Card(cardData);
    await newCard.save();
    return newCard;}
    throw { status: 400, message: "id not found" };
}

   async getUserCards(recruiterId) {
    return await Card.find({ user: recruiterId }).select('-cvv');
  }

   async deleteCard(userId, cardId) {
    await User.findByIdAndUpdate(userId, { $pull: { cards: cardId } });
    return await Card.findByIdAndDelete(cardId);
  }
}

module.exports = new CardManager();