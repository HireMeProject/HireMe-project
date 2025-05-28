const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {User}=require("../models/User");
const UserManager=require("../Services/UserManager");
const fs = require("fs");
const path = require("path");
const {Payment} =require("../models/Payment");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage
} = require("../utils/cloudinary");
/**
 * @desc register User
 * @route
 * @method POST
 * @access public
 */
const RegisterUser=async (req,res)=>{
    try {
        const newUser = await UserManager.createUser(req.body);
        res.status(200).json({ status: "success", message: "User created successfully", user: newUser });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(500).json({ status: "error", message: error.message });
    }

}
/**
 * @desc register Recruiter
 * @route
 * @method POST
 * @access public
 */
const RegisterRecruiter=async(req,res)=>{
    try {
        const newRecruiter = await UserManager.registerRecruiter(req.body);
        res.status(200).json({ status: "success", message: "Recruiter created successfully", user: newRecruiter });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc Login User
 * @route 
 * @method post
 * @access public 
 */
const LoginUser=async(req,res)=>{
    try {
        const loginResult = await UserManager.login(req.body,process.env.JWT_SECRET_KEY);
        res.status(200).json({ status: "success", ...loginResult });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(400).json({ status: "error", message: error.message });
    }
}
const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
/**
 * @desc Update User 
 * @route /users
 * @method put
 * @access private
 */
const UpdateUser=async(req,res)=>{
    try {
        // if (!req.file) {
        //     console.log("ici a 1");
    
        //     return res.status(400).json({ message: "no file provided" });
        //   }
        const userId=req.user.id;
        console.log("user : ",req.body);
        
        const updatedUser = await UserManager.updateUser(userId, req.body,req.file);
        return res.status(200).json({ status: "success", message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.log("error 500 ",error.message)

        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc Update User 
 * @route /users
 * @method put
 * @access private
 */
const updateUserCV=async(req,res)=>{
    try {
        console.log("req file ",req.file)
        if (!req.file) {
            console.log("ici a 1");
            return res.status(400).json({ message: "no file provided" });
          }
        const userId=req.user.id;
        console.log("user : ",req.body);
        
        const updatedUser = await UserManager.updateUserCV(userId,req.file);
        return res.status(200).json({ status: "success", message: "Cv updated successfully", user: updatedUser });
    } catch (error) {
        console.log("error 500 ",error.message)

        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc manage User status
 * @route /users-profile/:id
 * @method patch
 * @access private admin
 */
const ManageUserStatus=async(req,res)=>{
    try {
        const userId=req.params.id;
        const status=req.body.status;
        console.log("status received : ",req.body)
        console.log("userid: ",userId);
        const updatedUser = await UserManager.UpdateUserStatus(userId, status);
        return res.status(200).json({ status: "success", message: "Status updated successfully", user: updatedUser });
    } catch (error) {
        console.log("error 500 ",error.message)
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc Update User profile
 * @route /users/:id
 * @method patch
 * @access private admin
 */
const UpdateUserProfile=async(req,res)=>{
    try {
        const userId=req.params.id;
        console.log("userid: ",userId);
        const updatedUser = await UserManager.updateUser(userId, req.body);
        return res.status(200).json({ status: "success", message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.log("error 500 ",error.message)
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc Update Recruiter 
 * @route /users/:id
 * @method put
 * @access private
 */
const UpdateRecruiter=async(req,res)=>{
    try {
        const updatedRecruiter = await UserManager.updatedRecruiter(req.params.id, req.body);
        res.status(200).json({ status: "success", message: "User updated successfully", user: updatedRecruiter });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
}

/**
 * @desc Get All Users
 * @route /users
 * @method get
 * @access private (only admin)
 */
const GetAllUsers=async(req,res,next)=>{
    try {
        const users = await UserManager.getAllUsers(req.query);
        return res.status(200).json({ status: "success", users });
    } catch (error) {
        console.log("error fetching all users :",error)
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }}
    //without queries 
    const GetAllUsersWithoutQuery=async(req,res,next)=>{
    try {
        const users = await UserManager.getAllUsersWithoutQuery();
        return res.status(200).json({ status: "success", users });
    } catch (error) {
        console.log("error fetching all users :",error)
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }}
/**
 * @desc Get users by role
 * @route /users/:role
 * @method get
 * @access private (only admin)
 */
const GetUsersByrole=async(req,res)=>{
    try {
        const users = await UserManager.getUsersByRole(req.params.role);
        res.status(200).json({ status: "success", users });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc Get users by id 
 * @route /users/:role/:id
 * @method get
 * @access private (only admin)
 */
const getAdminProfile=async(req,res,next)=>{
    try {
        const id=req.user.id;
        const user = await UserManager.getAdminProfile(id);
        return res.status(200).json({ status: "success", user });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc Get users by id 
 * @route /users/:role/:id
 * @method get
 * @access private (only admin)
 */
const GetUserById=async(req,res,next)=>{
    try {
        const id=req.params.id;
        const user = await UserManager.GetUserById(id);
        return res.status(200).json({ status: "success", user });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc Get  users profile by id
 * @route /user-profile/:id
 * @method get
 * @access private (only admin)
 */
const GetUserProfileById=async(req,res,next)=>{
    try {
        const {id}=req.params.id;
        const user = await UserManager.getUserById(id);
        return res.status(200).json({ status: "success", user });
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        return res.status(500).json({ status: "error", message: error.message });
    }
}
/**
 * @desc Add New User
 * @route /users/add
 * @method post
 * @access private (only admin)
 */
const InsertUser=async(req,res,next)=>{
    try{
        await RegisterUser(req,res,next);
    }
    catch(error){
        return res.status(500).json({"status": "error",message: "Server error"});
    }
};
/**
 * @desc Delete User
 * @route /users/:id
 * @method Delete
 * @access private (only admin)
 */
const DeleteUser=async(req,res,next)=>{
        try {
            const deletedUser = await UserManager.deleteUser(req.params.id);
            res.status(200).json({ status: "success", message: "User deleted successfully", user: deletedUser });
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ status: "error", message: error.message });
            }
            res.status(500).json({ status: "error", message: error.message });
        }
};
/**-----------------------------------------------
 * @desc    Profile Photo Upload
 * @route   /api/users/profile/profile-photo-upload
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
 const profilePhotoUploadCtrl = async (req, res) => {
    try{
        // 1. Validation
    if (!req.file) {
        console.log("ici a 1");

        return res.status(400).json({ message: "no file provided" });
      }
    
      // 2. Get the path to the image
      const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
      console.log("ici a 2",imagePath);

      // 3. Upload to cloudinary
      const result = await cloudinaryUploadImage(imagePath);
      console.log("ici a 3");

      // 4. Get the user from DB
      console.log("ici a 4 req.user.id :",req.user.id);
      const user = await User.findById(req.user.id);
      console.log("user : ",user);
      console.log("user profile pic : ",user.profilePhoto);

    
      // 5. Delete the old profile photo if exist
      if (user.profilePhoto?.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
      }
      console.log("id public : ",user.profilePhoto.publicId)
    
      // 6. Change the profilePhoto field in the DB
      user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      await user.save();
    console.log("user ilg secure-url",result.secure_url);
      // 7. Send response to client
      res.status(200).json({
        message: "your profile photo uploaded successfully",
        profilePhoto: { url: result.secure_url, publicId: result.public_id },
      });
    
      // 8. Remvoe image from the server
      fs.unlinkSync(imagePath);
    }
    catch(error){
        console.log(error.message)
        return res.status(600).json({ status: "error", message: error.message });
    }
    
  };
  /**
   * 
   */
  const getSubscribedRecruitersCount = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $match: { status: "Succeeded" }
      },
      {
        $group: { _id: "$client" }
      },
      {
        $count: "totalSubscribedRecruiters"
      }
    ]);

    const count = result.length > 0 ? result[0].totalSubscribedRecruiters : 0;

    return res.status(200).json({ status: "success",count });
  } catch (error) {
    console.error("Erreur dans getSubscribedRecruitersCount :", error.message);
        return res.status(600).json({ status: "error", message: error.message });
  }
};
  
  



module.exports={
    GetUserById,
    UpdateUser,
    GetAllUsers,
    GetUsersByrole,
    getAdminProfile,
    InsertUser,
    DeleteUser,
    RegisterRecruiter,
    RegisterUser,
    LoginUser,
    logout,
    UpdateUserProfile,
    profilePhotoUploadCtrl,
    updateUserCV,
    ManageUserStatus,
    GetUserProfileById,
    getSubscribedRecruitersCount,
    GetAllUsersWithoutQuery,
}