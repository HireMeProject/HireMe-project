// interfaces/IJobOffer.js
class IJobOffer {
     ValidateJobOffer(obj) {
      throw new Error("Method 'validateJobOffer()' must be implemented");
    }
  
     ValidateUpdateJobOffer(obj) {
      throw new Error("Method 'validateUpdateJobOffer()' must be implemented");
    }
  
     async PostJobOffer(jobData, recruiterId) {
      throw new Error("Method 'postJobOffer()' must be implemented");
    }
  
     async GetAllJobOffers(queryData) {
      throw new Error("Method 'getAllJobOffers()' must be implemented");
    }
  
     async GetJobOfferById(jobId) {
      throw new Error("Method 'getJobOfferById()' must be implemented");
    }
  
     async GetMyJobOffers(recruiterId, queryData) {
      throw new Error("Method 'getMyJobOffers()' must be implemented");
    }
  
     async UpdateJobOffer(recruiterId, jobId, jobData) {
      throw new Error("Method 'updateJobOffer()' must be implemented");
    }
  
     async DeleteJobOffer(jobOfferId) {
      throw new Error("Method 'deleteJobOffer()' must be implemented");
    }
  }
  
  module.exports = IJobOffer;