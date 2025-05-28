const { User } = require("../models/User");
const { Candidate } = require("../models/Candidate");
const { Recruiter } = require("../models/Recruiter");
const { Company } = require("../models/Company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const IUser = require("../Interface/UserInterface");
const CompanyManager=require("../Services/CompanyManager");

class UserManager extends IUser{
  //Valider les données de création d'un utilisateur
  ValidateUser(obj) {
    const schema = joi.object({
      name: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      password: joi.string().min(8).required(),
      phoneNumber: joi.string().required().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male").required(),
      role: joi.string().valid("candidate", "admin", "recruiter").required(),
    });
    return schema.validate(obj);
  }
  ValidateRecruiter(obj) {
    const schema = joi.object({
      name: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      password: joi.string().min(8).required(),
      phoneNumber: joi.string().required().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male").required(),
      role: joi.string().valid("candidate", "recruiter").required(),
      company: joi.string().trim().required(),
    });
    return schema.validate(obj);
  }
  //Valider les données de mise à jour d'un utilisateur
  validateLoginUser(obj) {
    const schema = joi.object({
      email: joi.string().trim().email().required(),
      password: joi.string().required(),
      role: joi.string().required().valid("recruiter", "candidate", "admin"),
    });
    return schema.validate(obj);
  }
  //Valider les données de mide à jour d'un utilisateur
  ValidateUpdateUser(obj) {
    const schema = joi.object({
      name: joi.string().trim(),
      email: joi.string().trim().email(),
      password: joi.string().min(8),
      phoneNumber: joi.string().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male"),
      company: joi.string().trim(),
      status: joi.string().trim(),
      profilePhoto:joi.object(),
      role:joi.string(),
    });
    return schema.validate(obj);
  }
  //Créer un nouveel utilisateur
  async createUser(userData) {
    const { error } = this.ValidateUser(userData);
    if (error) {
      const errorMessage = error.details[0].message || "Validation failed";
      throw { status: 400, message: errorMessage };
    }
    const {
      name,
      email,
      password,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
    } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "This email already exists" };
    }
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw { status: 400, message: "This phone number is already used" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
    if (newUser && role === "candidate") {
      const newCandidate = new Candidate({
        _id: newUser._id,
        candidateId: newUser._id,
      });
      await newCandidate.save();
    }
    return newUser;
  }
  //Create Recruteur
  async registerRecruiter(recruiterData) {
    const { error } = this.ValidateRecruiter(recruiterData);
    if (error) {
      const errorMessage = error.details[0].message || "Validation failed";
      throw { status: 400, message: errorMessage };
    }

    if (!recruiterData.company) {
      throw { status: 400, message: "Company is required" };
    }
    // pour chercher avec lowercase
    const company = await Company.findOne({
      name: { $regex: new RegExp(`^${recruiterData.company}$`, "i") },
    });
    if (!company) {
      throw { status: 401, message: "Company not found" };
    }
    const companyId = company._id;
    const {
      name,
      email,
      password,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
    } = recruiterData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "This email already exist" };
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw { status: 400, message: "This phone number is already used" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
      status: "active",
    });
    await newUser.save();

    if (newUser && role === "recruiter") {
      console.log("comp ID : ",companyId)
      const newRecruiter = new Recruiter({
        _id: newUser._id,
        recruiterID: newUser._id,
        companyID: companyId,
      });
      await newRecruiter.save();
    }

    return newUser;
  }
  // Connexion d'un utilisateur
  async login(userData, secretkey) {
    const { email, password, role } = userData;
    const { error } = this.validateLoginUser({ email, password, role });
    if (error) {
      const errorMessage = error.details[0].message || "login failed";
      throw { status: 400, message: errorMessage };
    }
    const user = await User.findOne({ email, role });
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 400, message: "Incorrect password" };
    }
    const token = jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      secretkey,
      { expiresIn: "7d" }
    );
    return { token, user };
  }
    //Gerer User profile status
  async UpdateUserStatus(userId,status){
    const user=await User.findByIdAndUpdate(userId,
      {$set:{
        status,
      }},
      { new: true }
    );
    if(!user){
        throw { status: 404, message: "User not found" };
    }
    return user;

  }
  //Mettre à jour un utilisateur
  async updateUser(userId, updateData) {
    try {
      const {
        company,
        status,
        cv,
        skills,
        ...rest
      } = updateData;
      //console.log("data recu : ",updateData)
      const { error } = this.ValidateUpdateUser(rest);
      if (error) {
        console.log("probeleee");
        const errorMessage = error.details[0].message || "Validation failed";
        throw { status: 400, message: errorMessage };
      }
     
      const {name,
        email,
        password,
        birthDate,
        gender,
        phoneNumber,
        address}=rest;
      let companyID;
      let passwordHashed;
      if(password){
        passwordHashed=await bcrypt.hash(password,10);
      }
             let newCompany;
      if (company) {
        const companyExist = await Company.findOne({ name: company });
 
        if (!companyExist) {
           newCompany=await CompanyManager.addCompany(company);
           console.log("new company : ",newCompany)
          companyID=newCompany._id.toString();
        }
        else{
          newCompany=companyExist;
          companyID = newCompany._id.toString();
        }
         
        console.log("company id :",companyID);
        
      }
      const user = await User.findById(userId);
      if (!user) {
        throw { status: 404, message: "User not found" };
      }
      console.log("user founded :", user.name);
      // Update the base user information
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            email,
            password:passwordHashed,
            birthDate,
            gender,
            phoneNumber,
            address,
            status,
          },
        },
        { new: true }
      );
      // Update role-specific information
            let updatedUserProfile;
      if (user.role === "candidate") {
        await Candidate.findByIdAndUpdate(
          userId,
          { $set: { cv, skills } },
          { new: true }
        );
        updatedUserProfile={
            name,
            email,
            birthDate,
            gender,
            phoneNumber,
            address,
            status,
            cv,
            skills,
            role:"candidate",
        }
      } else if (user.role === "recruiter" && company) {
        await Recruiter.findByIdAndUpdate(
          userId,
          { $set: {companyID:companyID } },
          { new: true }
        );
        console.log("probleme ici");
        updatedUserProfile={
            name,
            email,
            birthDate,
            gender,
            phoneNumber,
            address,
            status,
            company:newCompany.name,
            role:"recruiter",
        }
      } 
      // console.log("Données reçues du frontend :", updateData);

      return updatedUserProfile;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while updating the user"
      );
    }
  }
  // async updateRecruiterCompany(userId, company) {
  //     try{

  //     }
  //     catch(error){
  //             throw { status: 400, message: "Incorrect password" };
  // throw new Error(error.message || "An error occurred while updating the user");
  //     }
  // }
  // async updateRecruiterCompany(userId, updatedData) {
  //     try{

  //     }
  //     catch(error){
  //             throw { status: 400, message: "Incorrect password" };
  // throw new Error(error.message || "An error occurred while updating the user");
  //     }
  // }

  async updateRecruiterStatus(userId, status) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: status },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while updating the user"
      );
    }
  }

  //Recuperer tous les utilisateurs
  async getAllUsers(query) {
    console.log(query)
     const { page, limit, status } = query;
        const pageQ = parseInt(page) || 1; // Page actuelle
        const limitQ = parseInt(limit) || 5;
        const skip = (pageQ - 1) * limitQ;
        const total = await User.countDocuments();
        
        let filtre={};
        if (status) filtre.status = { $regex: status, $options: "i" };
    const users = await User.find(filtre).select("-password").skip(skip).limit(limitQ);
    return {total,users};
      // total,
      
  } 
   async getAllUsersWithoutQuery() {
     
    const users = await User.find().select("-password");
    return users;
      // total,
      
  } 
   /**
  async getAllUsers() {
    
    const users = await User.find().select("-password");
    return users;
  }*/
  //Recuperer tous les utilisateurs par role
  async getUsersByRole(role) {
    const users = await User.find({ role }).select("-password");
    return users;
  }
  // Récupérer un utilisateur par ID et rôle
  async getUserByIdAndRole(userId, role) {
    const user = await User.findOne({ _id: userId, role });
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    return user;
  }
  // Récupérer un utilisateur par ID 
  async getAdminProfile(userId) {
    let profile;
    let user=await User.findOne({ _id: userId });
   
    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    profile={
      profilePhoto:user.profilePhoto,
      // userId: user._id,  // ID utilisateur
      name: user.name,    // Nom de l'utilisateur
      email: user.email,  // Email de l'utilisateur
      phoneNumber: user.phoneNumber,  // Numéro de téléphone de l'utilisateur
      address: user.address,  // Adresse de l'utilisateur
      status: user.status, // Statut du recruteur
      // data:data, // Nom de la société (peuplé via populate)
      birthDate:user.birthDate,
      role: user.role,
      gender:user.gender,
    }
    console.log("data : ",profile);
    return profile;
  }
  async GetUserById(id){
        console.log("userIDDD : ",id)

    const user=await User.findById(id);
    if(!user){
      throw { status: 404, message: "User not found" };
    }
    let userprofile,profile;
    if(user.role==="candidate"){
      userprofile=await Candidate.findById(id).populate("candidateId");
       profile={
        profilePhoto:user.profilePhoto,
                // userId: user._id,  
                name: user.name,    
                email: user.email,  
                phoneNumber: user.phoneNumber,  
                address: user.address,
                birthDate:user.birthDate,  
                gender: user.gender, 
                status: user.status, 
                cv:userprofile.cv,
                skills: userprofile.skills,
                role: user.role  
                 }
    }
    else if(user.role==="recruiter"){
      userprofile=await Recruiter.findById(id).populate("recruiterID").populate("companyID");
      profile={
                profilePhoto:user.profilePhoto,
                // userId: user._id,  
                name: user.name,    
                email: user.email,  
                phoneNumber: user.phoneNumber,  
                address: user.address,
                birthDate:user.birthDate,  
                gender: user.gender, 
                status: user.status, 
                companyLogo:userprofile.companyID.logo,
                company: userprofile.companyID.name,  
                role: user.role  
            };
    }
    
    return profile;
  }

  // Supprimer un utilisateur
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    var recruiter = await Recruiter.findOne({ _id: userId });
    var candidate = await Candidate.findOne({ _id: userId });
    if (recruiter) {
      recruiter = await Recruiter.findByIdAndDelete(userId);
    } else if (candidate) {
      candidate = await Candidate.findByIdAndDelete(userId);
    }
    return user;
  }
}
module.exports = new UserManager();

// const { User } = require("../models/User");
// const { Candidate } = require("../models/Candidate");
// const { Recruiter } = require("../models/Recruiter");
// const { Company } = require("../models/Company");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const joi = require("joi");
// const IUser = require("../Interface/UserInterface");

// class UserManager extends IUser{
//   //Valider les données de création d'un utilisateur
//   ValidateUser(obj) {
//     const schema = joi.object({
//       name: joi.string().trim().required(),
//       email: joi.string().trim().email().required(),
//       password: joi.string().min(8).required(),
//       phoneNumber: joi.string().required().trim(),
//       address: joi.string().trim(),
//       birthDate: joi.date(),
//       gender: joi.string().valid("female", "male").required(),
//       role: joi.string().valid("candidate", "admin", "recruiter").required(),
//     });
//     return schema.validate(obj);
//   }
//   ValidateRecruiter(obj) {
//     const schema = joi.object({
//       name: joi.string().trim().required(),
//       email: joi.string().trim().email().required(),
//       password: joi.string().min(8).required(),
//       phoneNumber: joi.string().required().trim(),
//       address: joi.string().trim(),
//       birthDate: joi.date(),
//       gender: joi.string().valid("female", "male").required(),
//       role: joi.string().valid("candidate", "recruiter").required(),
//       company: joi.string().trim().required(),
//     });
//     return schema.validate(obj);
//   }
//   //Valider les données de mise à jour d'un utilisateur
//   validateLoginUser(obj) {
//     const schema = joi.object({
//       email: joi.string().trim().email().required(),
//       password: joi.string().required(),
//       role: joi.string().required().valid("recruiter", "candidate", "admin"),
//     });
//     return schema.validate(obj);
//   }
//   //Valider les données de mide à jour d'un utilisateur
//   ValidateUpdateUser(obj) {
//     const schema = joi.object({
//       name: joi.string().trim(),
//       email: joi.string().trim().email(),
//       password: joi.string().min(8),
//       phoneNumber: joi.string().trim(),
//       address: joi.string().trim(),
//       birthDate: joi.date(),
//       gender: joi.string().valid("female", "male"),
//       company: joi.string().trim(),
//       status: joi.string().trim(),
//       profilePhoto:joi.object(),
//       role:joi.string(),
//     });
//     return schema.validate(obj);
//   }
//   //Créer un nouveel utilisateur
//   async createUser(userData) {
//     const { error } = this.ValidateUser(userData);
//     if (error) {
//       const errorMessage = error.details[0].message || "Validation failed";
//       throw { status: 400, message: errorMessage };
//     }
//     const {
//       name,
//       email,
//       password,
//       birthDate,
//       gender,
//       phoneNumber,
//       address,
//       role,
//     } = userData;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       throw { status: 400, message: "This email already exists" };
//     }
//     const existingPhoneNumber = await User.findOne({ phoneNumber });
//     if (existingPhoneNumber) {
//       throw { status: 400, message: "This phone number is already used" };
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ ...userData, password: hashedPassword });
//     await newUser.save();
//     if (newUser && role === "candidate") {
//       const newCandidate = new Candidate({
//         _id: newUser._id,
//         candidateId: newUser._id,
//       });
//       await newCandidate.save();
//     }
//     return newUser;
//   }
//   //Create Recruteur
//   async registerRecruiter(recruiterData) {
//     const { error } = this.ValidateRecruiter(recruiterData);
//     if (error) {
//       const errorMessage = error.details[0].message || "Validation failed";
//       throw { status: 400, message: errorMessage };
//     }

//     if (!recruiterData.company) {
//       throw { status: 400, message: "Company is required" };
//     }
//     // pour chercher avec lowercase
//     const company = await Company.findOne({
//       name: { $regex: new RegExp(`^${recruiterData.company}$`, "i") },
//     });
//     if (!company) {
//       throw { status: 401, message: "Company not found" };
//     }
//     const companyId = company._id;
//     const {
//       name,
//       email,
//       password,
//       birthDate,
//       gender,
//       phoneNumber,
//       address,
//       role,
//     } = recruiterData;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       throw { status: 400, message: "This email already exist" };
//     }

//     const existingPhoneNumber = await User.findOne({ phoneNumber });
//     if (existingPhoneNumber) {
//       throw { status: 400, message: "This phone number is already used" };
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       birthDate,
//       gender,
//       phoneNumber,
//       address,
//       role,
//       status: "active",
//     });
//     await newUser.save();

//     if (newUser && role === "recruiter") {
//       console.log("comp ID : ",companyId)
//       const newRecruiter = new Recruiter({
//         _id: newUser._id,
//         recruiterID: newUser._id,
//         companyID: companyId,
//       });
//       await newRecruiter.save();
//     }

//     return newUser;
//   }
//   // Connexion d'un utilisateur
//   async login(userData, secretkey) {
//     const { email, password, role } = userData;
//     const { error } = this.validateLoginUser({ email, password, role });
//     if (error) {
//       const errorMessage = error.details[0].message || "login failed";
//       throw { status: 400, message: errorMessage };
//     }
//     const user = await User.findOne({ email, role });
//     if (!user) {
//       throw { status: 400, message: "User not found" };
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw { status: 400, message: "Incorrect password" };
//     }
//     const token = jwt.sign(
//       {
//         userInfo: {
//           id: user._id,
//           role: user.role,
//         },
//       },
//       secretkey,
//       { expiresIn: "7d" }
//     );
//     return { token, user };
//   }
//   //Mettre à jour un utilisateur
//   async updateUser(userId, updateData) {
//     try {
//       const {
//         company,
//         status,
//         cv,
//         skills,
//         ...rest
//       } = updateData;
//       console.log("data recu : ",updateData)
//       const { error } = this.ValidateUpdateUser(rest);
//       if (error) {
//         console.log("probeleee");
//         const errorMessage = error.details[0].message || "Validation failed";
//         throw { status: 400, message: errorMessage };
//       }
     
//       const {name,
//         email,
//         password,
//         birthDate,
//         gender,
//         phoneNumber,
//         address}=rest;
//       let companyID;
//       let passwordHashed;
//       if(password){
//         passwordHashed=await bcrypt.hash(password,10);
//       }
//       if (company) {
//         const companyExist = await Company.findOne({ name: company }).select(
//           "_id"
//         );
//         if (!companyExist) {
//           throw { status: 400, message: "Company not found" };
//         }
//          companyID = companyExist._id.toString();
//         console.log("company id :",companyID);
//         if (!companyID) {
//           throw { status: 400, message: "Company not foundd" };
//         }
//       }
//       const user = await User.findById(userId);
//       if (!user) {
//         throw { status: 400, message: "User not found" };
//       }
//       console.log("user founded :", user.name);
//       // Update the base user information
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         {
//           $set: {
//             name,
//             email,
//             password:passwordHashed,
//             birthDate,
//             gender,
//             phoneNumber,
//             address,
//             status,
//           },
//         },
//         { new: true }
//       );
//       // Update role-specific information
//       if (user.role === "candidate") {
//         await Candidate.findByIdAndUpdate(
//           userId,
//           { $set:  {skills}  },
//           { new: true }
//         );
//       } else if (user.role === "recruiter" && company) {
//         await Recruiter.findByIdAndUpdate(
//           userId,
//           { $set: {companyID:companyID } },
//           { new: true }
//         );
//         console.log("probleme ici");

//       } 
//       console.log("Données reçues du frontend :", updateData);


//       return updatedUser;
//     } catch (error) {
//       throw new Error(
//         error.message || "An error occurred while updating the user"
//       );
//     }
//   }
// //update cv
//   async updateUserCV(userId, file) {
//     if (!file) {
//       throw { status: 400, message: "No file provided" };
//     }
  
//     const user = await User.findById(userId);
//     const cvData = {
//       name: file.originalname,
//       file: file.path,
//     };
  
//     const updatedCvUser=await Candidate.findByIdAndUpdate(userId, {
//       $set: { cv: cvData },
//     });
//     return updatedCvUser;
//   }
  

//   async updateRecruiterStatus(userId, status) {
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { $set: status },
//         { new: true }
//       );
//       return updatedUser;
//     } catch (error) {
//       throw new Error(
//         error.message || "An error occurred while updating the user"
//       );
//     }
//   }

//   //Recuperer tous les utilisateurs
//   async getAllUsers() {
//     const users = await User.find().select("-password");
//     return users;
//   }
//   //Recuperer tous les utilisateurs par role
//   async getUsersByRole(role) {
//     const users = await User.find({ role }).select("-password");
//     return users;
//   }
//   // Récupérer un utilisateur par ID et rôle
//   async getUserByIdAndRole(userId, role) {
//     const user = await User.findOne({ _id: userId, role });
//     if (!user) {
//       throw { status: 400, message: "User not found" };
//     }
//     return user;
//   }
//   // Récupérer un utilisateur par ID 
//   async getUserById(userId,role) {
//     let profile ,userData,data;
//     let user=await User.findOne({ _id: userId });
//     if(role==="candidate"){
//       userData=await Candidate.findById(userId);
//       data=[userData.cv,userData.skills]
//     }
//     else if(role==="recruiter"){
//       userData=await Recruiter.findById(userId).populate("companyID","name sector logo").lean();
//       data={name:userData.companyID.name,sector:userData.companyID.sector,logo:userData.companyID.logo}

//     }
//     if (!user) {
//       throw { status: 404, message: "User not found" };
//     }
//     profile={
//       profilePhoto:user.profilePhoto,
//       userId: user._id,  // ID utilisateur
//       name: user.name,    // Nom de l'utilisateur
//       email: user.email,  // Email de l'utilisateur
//       phoneNumber: user.phoneNumber,  // Numéro de téléphone de l'utilisateur
//       address: user.address,  // Adresse de l'utilisateur
//       status: user.status, // Statut du recruteur
//       data:data, // Nom de la société (peuplé via populate)
//       role: user.role,
//       gender:user.gender,
//     }
//     console.log("data : ",profile);
//     return profile;
//   }

//   // Supprimer un utilisateur
//   async deleteUser(userId) {
//     const user = await User.findByIdAndDelete(userId);
//     if (!user) {
//       throw { status: 400, message: "User not found" };
//     }
//     var recruiter = await Recruiter.findOne({ _id: userId });
//     var candidate = await Candidate.findOne({ _id: userId });
//     if (recruiter) {
//       recruiter = await Recruiter.findByIdAndDelete(userId);
//     } else if (candidate) {
//       candidate = await Candidate.findByIdAndDelete(userId);
//     }
//     return user;
//   }
// }
// module.exports = new UserManager();
/**const { User } = require("../models/User");
const { Candidate } = require("../models/Candidate");
const { Recruiter } = require("../models/Recruiter");
const { Company } = require("../models/Company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

class UserManager {
  //Valider les données de création d'un utilisateur
  ValidateUser(obj) {
    const schema = joi.object({
      name: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      password: joi.string().min(8).required(),
      phoneNumber: joi.string().required().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male").required(),
      role: joi.string().valid("candidate", "admin", "recruiter").required(),
    });
    return schema.validate(obj);
  }
  ValidateRecruiter(obj) {
    const schema = joi.object({
      name: joi.string().trim().required(),
      email: joi.string().trim().email().required(),
      password: joi.string().min(8).required(),
      phoneNumber: joi.string().required().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male").required(),
      role: joi.string().valid("candidate", "recruiter").required(),
      company: joi.string().trim().required(),
    });
    return schema.validate(obj);
  }
  //Valider les données de mise à jour d'un utilisateur
  validateLoginUser(obj) {
    const schema = joi.object({
      email: joi.string().trim().email().required(),
      password: joi.string().required(),
      role: joi.string().required().valid("recruiter", "candidate", "admin"),
    });
    return schema.validate(obj);
  }
  //Valider les données de mide à jour d'un utilisateur
  ValidateUpdateUser(obj) {
    const schema = joi.object({
      name: joi.string().trim(),
      email: joi.string().trim().email(),
      password: joi.string().min(8),
      phoneNumber: joi.string().trim(),
      address: joi.string().trim(),
      birthDate: joi.date(),
      gender: joi.string().valid("female", "male"),
      company: joi.string().trim(),
      status: joi.string().trim(),
      profilePhoto:joi.object(),
      role:joi.string(),
    });
    return schema.validate(obj);
  }
  //Créer un nouveel utilisateur
  async createUser(userData) {
    const { error } = this.ValidateUser(userData);
    if (error) {
      const errorMessage = error.details[0].message || "Validation failed";
      throw { status: 400, message: errorMessage };
    }
    const {
      name,
      email,
      password,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
    } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "This email already exists" };
    }
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw { status: 400, message: "This phone number is already used" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();
    if (newUser && role === "candidate") {
      const newCandidate = new Candidate({
        _id: newUser._id,
        candidateId: newUser._id,
      });
      await newCandidate.save();
    }
    return newUser;
  }
  //Create Recruteur
  async registerRecruiter(recruiterData) {
    const { error } = this.ValidateRecruiter(recruiterData);
    if (error) {
      console.log("ici");
      const errorMessage = error.details[0].message || "Validation failed";
      throw { status: 400, message: errorMessage };
    }

    if (!recruiterData.company) {
      throw { status: 400, message: "Company is required" };
    }
    const company = await Company.findOne({ name: recruiterData.company });
    if (!company) {
      throw { status: 401, message: "Company not found" };
    }
    const companyId = company._id;
    if (!companyId) {
      throw { status: 400, message: "Company not found" };
    }

    const {
      name,
      email,
      password,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
    } = recruiterData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: "This email already exist" };
    }

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      throw { status: 400, message: "This phone number is already used" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      birthDate,
      gender,
      phoneNumber,
      address,
      role,
      status: "inactive",
    });
    await newUser.save();

    if (newUser && role === "recruiter") {
      const newRecruiter = new Recruiter({
        _id: newUser._id,
        recruiterID: newUser._id,
        companyID: companyId,
      });
      await newRecruiter.save();
    }

    return newUser;
  }
  // Connexion d'un utilisateur
  async login(userData, secretkey) {
    const { email, password, role } = userData;
    const { error } = this.validateLoginUser({ email, password, role });
    if (error) {
      const errorMessage = error.details[0].message || "login failed";
      throw { status: 400, message: errorMessage };
    }
    const user = await User.findOne({ email, role });
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 400, message: "Incorrect password" };
    }
    const token = jwt.sign(
      {
        userInfo: {
          id: user._id,
          role: user.role,
        },
      },
      secretkey,
      { expiresIn: "7d" }
    );
    return { token, user };
  }
  //Mettre à jour un utilisateur
  async updateUser(userId, updateData) {
    try {
      const {company,cv,skills,...restData}=updateData
      console.log("updateData : ",restData)
      const { error } = this.ValidateUpdateUser(restData);
      if (error) {
        console.log("probeleee");
        const errorMessage = error.details[0].message || "Validation failed";
        throw { status: 400, message: errorMessage };
      }
      const {
        name,
        email,
        password,
        birthDate,
        gender,
        phoneNumber,
        address,
        status,
       
      } = updateData;
      let companyID;
      let passwordHashed;
      if(password){
        passwordHashed=await bcrypt.hash(password,10);
      }
      if (company) {
        const companyExist = await Company.findOne({ name: company }).select(
          "_id"
        );
        if (!companyExist) {
          throw { status: 400, message: "Company not found" };
        }
         companyID = companyExist._id.toString();
        console.log("company id :",companyID);
        if (!companyID) {
          throw { status: 400, message: "Company not foundd" };
        }
      }
      const user = await User.findById(userId);
      if (!user) {
        throw { status: 400, message: "User not found" };
      }
      console.log("user founded :", user.name);
      // Update the base user information
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            name,
            email,
            password:passwordHashed,
            birthDate,
            gender,
            phoneNumber,
            address,
            status,
          },
        },
        { new: true }
      );
      let UserUpdatedProfile;
      // Update role-specific information
      if (user.role === "candidate") {
        UserUpdatedProfile= await Candidate.findByIdAndUpdate(
          userId,
          { $set: { cv, skills } },
          { new: true }
        ).populate("candidateId");
        UserUpdatedProfile={
          updatedUser,
          cv:UserUpdatedProfile.cv,
          skills:UserUpdatedProfile.skills,
        }
        
      } else if (user.role === "recruiter" && company) {
        UserUpdatedProfile=await Recruiter.findByIdAndUpdate(
          userId,
          { $set: {companyID:companyID } },
          { new: true }
        );
        console.log("probleme ici");

      } 
      console.log("Données reçues du frontend :", updateData);


      return UserUpdatedProfile;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while updating the user"
      );
    }
  }
  // async updateRecruiterCompany(userId, company) {
  //     try{

  //     }
  //     catch(error){
  //             throw { status: 400, message: "Incorrect password" };
  // throw new Error(error.message || "An error occurred while updating the user");
  //     }
  // }
  // async updateRecruiterCompany(userId, updatedData) {
  //     try{

  //     }
  //     catch(error){
  //             throw { status: 400, message: "Incorrect password" };
  // throw new Error(error.message || "An error occurred while updating the user");
  //     }
  // }

  async updateRecruiterStatus(userId, status) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: status },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while updating the user"
      );
    }
  }

  //Recuperer tous les utilisateurs
  async getAllUsers() {
    const users = await User.find().select("-password");
    return users;
  }
  //Recuperer tous les utilisateurs par role
  async getUsersByRole(role) {
    const users = await User.find({ role }).select("-password");
    return users;
  }
  // Récupérer un utilisateur par ID et rôle
  async getUserByIdAndRole(userId, role) {
    const user = await User.findOne({ _id: userId, role });
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    return user;
  }
  // Récupérer un utilisateur par ID 
  async getUserById(userId,role) {
    let profile ,userData,data;
    let user=await User.findOne({ _id: userId });
    if(role==="candidate"){
      userData=await Candidate.findById(userId);
      data=[userData.cv,userData.skills]
    }
    else if(role==="recruiter"){
      userData=await Recruiter.findById(userId).populate("companyID","name sector logo").lean();
      data={name:userData.companyID.name,sector:userData.companyID.sector,logo:userData.companyID.logo}

    }
    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    profile={
      profilePhoto:user.profilePhoto,
      userId: user._id,  // ID utilisateur
      name: user.name,    // Nom de l'utilisateur
      email: user.email,  // Email de l'utilisateur
      phoneNumber: user.phoneNumber,  // Numéro de téléphone de l'utilisateur
      address: user.address,  // Adresse de l'utilisateur
      status: user.status, // Statut du recruteur
      data:data, // Nom de la société (peuplé via populate)
      role: user.role,
      gender:user.gender,
    }
    console.log("data : ",profile);
    return profile;
  }

  // Supprimer un utilisateur
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw { status: 400, message: "User not found" };
    }
    var recruiter = await Recruiter.findOne({ _id: userId });
    var candidate = await Candidate.findOne({ _id: userId });
    if (recruiter) {
      recruiter = await Recruiter.findByIdAndDelete(userId);
    } else if (candidate) {
      candidate = await Candidate.findByIdAndDelete(userId);
    }
    return user;
  }
}
module.exports = new UserManager();
 */