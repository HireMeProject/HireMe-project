class IRecruiter{
    async GetProfile(recruiterId){
        // You can add extra logic here if needed
        throw new Error("Method  must be implemented");
      }
    
      async GetCandidateProfile(query,recruiterId,applicationId){
        throw new Error("Method  must be implemented");
      }
    
      async GetListRecruiters(recruiterId){
        throw new Error("Method  must be implemented");
      }
    
      
}
module.exports=IRecruiter;