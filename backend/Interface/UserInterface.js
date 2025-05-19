class IUser {
  ValidateUser(obj) {
    // You can add extra logic here if needed
    throw new Error("Method  must be implemented");
  }

  ValidateRecruiter(obj) {
    throw new Error("Method  must be implemented");
  }

  validateLoginUser(obj) {
    throw new Error("Method  must be implemented");
  }

  ValidateUpdateUser(obj) {
    throw new Error("Method  must be implemented");
  }

  async createUser(userData) {
    throw new Error("Method  must be implemented");
  }

  async registerRecruiter(recruiterData) {
    throw new Error("Method  must be implemented");
  }

  async updateUser(userId, updateData) {
    throw new Error("Method  must be implemented");
  }
  async updateUserCV(userId, updateData) {
    throw new Error("Method  must be implemented");
  }
  async updateRecruiterStatus(userId, status) {
    throw new Error("Method  must be implemented");
  }

  async getAllUsers() {
    throw new Error("Method  must be implemented");
  }
  async getUsersByRole(role) {
    throw new Error("Method  must be implemented");
  }
  async getUserByIdAndRole(userId, role) {
    throw new Error("Method  must be implemented");
  }
  async getUserById(userId,role) {
    throw new Error("Method  must be implemented");
  }
  async deleteUser(userId) {
    throw new Error("Method  must be implemented");
  }
  
}
module.exports = IUser;
