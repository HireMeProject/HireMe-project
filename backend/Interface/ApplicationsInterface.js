
class ApplicationInterface {
  async CreateApplication(candidateID, jobID) {
    // You can add extra logic here if needed
    throw new Error("Method  must be implemented");
  }

  async GetMyApplications(candidateID) {
    throw new Error("Method  must be implemented");
  }

  async GetAllApplications(query, recruiterId) {
    throw new Error("Method  must be implemented");
  }

  async GetMyJobApplications(query, recruiterId) {
    throw new Error("Method  must be implemented");
  }

  async UpdateApplication(query, recruiterId, applicationId, applicationStatus) {
    throw new Error("Method  must be implemented");
  }

  async GetApplicationById(query, recruiterId, applicationId) {
    throw new Error("Method  must be implemented");
  } 
}

module.exports =ApplicationInterface;
