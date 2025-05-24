const jwt=require("jsonwebtoken");
const {User}=require("../models/User");
const {Payment}=require("../models/Payment");
const VerifyToken=(req,res,next)=>{
    const authHeader=req.headers.authorization || req.headers.Authorization;
    //Bearer token
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({message:"unauthorized"});
    }
    const token = authHeader.split(" ")[1]; 
    
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            console.log(err.message);
            return res.status(403).json({message:"access forbidden"});
        }
        req.user=decoded.userInfo;    
        next();
    })
}
// Middleware to authenticate JWT for WebSocket connections
const authenticateSocket = (socket, next) => {
    const token = socket.handshake.auth.token;
 
    if (!token) return next(new Error('Authentication error'));
 
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err,decoded) => {
        if(err){
            console.log(err.message);
            return next(new Error('Authentication error'));
        }      
      socket.user = decoded.userInfo;
      next();
    });
  };
const verifyAdmin=(req,res,next)=>{
    VerifyToken(req,res,()=>{
        console.log("role",req.user.role)
    if(req.user.role==="admin"){
        next();
    }
    else{
        return res.status(400).json("Admins only ");
    }})
}
const verifyCandidate=(req,res,next)=>{
    VerifyToken(req,res,()=>{
        console.log("role",req.user.role)
    if(req.user.role==="candidate"){
        
        next();
    }
    else{
        return res.status(400).json("Only Registered Candidates are allowed !");
    }})
}
const verifyRecruiter=(req,res,next)=>{
    VerifyToken(req,res,()=>{
        console.log("role",req.user.role)
    if(req.user.role==="recruiter"){    
        next();
    }
    else{
        return res.status(400).json("Only Registered Recruiters are allowed !");
    }})
}
const verifyRecruiterManager=(req,res,next)=>{
    VerifyToken(req,res,()=>{
        console.log("role",req.user.role)
    if(req.user.role==="recruiter manager"){
        
        next();
    }
    else{
        return res.status(400).json("Only Registered Recruiter Managers are allowed !");
    }})
}
const verifyAcountStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(400).json("User Id needed!");

        const user = await User.findById(userId).select("status");
        if (!user) return res.status(404).json("User not found");
        if (user.status !== "active") return res.status(401).json("Account not active");

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error");
    }
};
const verifySubscriptionRecruiter=async(req,res,next)=>{
    try{
        const userId=req.user.id;
        const paymentDone=await Payment.find({client:userId}).sort({ paymentDate: -1 });; //c est une liste 
console.log("payment done : ",paymentDone[0])
        if(paymentDone[0].status==="Failed"){
            return res.status(401).json({message:"you need to pay first."})
        }
        else if(paymentDone[0].status==="Succeeded"){
            const today = new Date();
            const paymentValid = new Date(paymentDone[0].expiryDate ) > today;
            if (!paymentValid) {
            return res.status(401).json({ message: "Your subscription has expired. Please renew." });
        }
                    console.log("paiement valide")

            next();
        }
        else if(paymentDone[0].status==="Pending"){
            return res.status(400).json({message:"payment status is still pending..."})
        }
        else  if (paymentDone[0].status === "Failed") {
      return res.status(401).json({ message: "payment failed ,  Please retry" });
    }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}
module.exports={
    verifyAdmin,
    VerifyToken,
    verifyCandidate,
    verifyRecruiter,
    verifyAcountStatus,
    verifySubscriptionRecruiter,
    authenticateSocket,
}