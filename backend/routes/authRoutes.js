const express=require("express");
const router=express.Router();
const {signup,login}=require("../controllers/authController.js");
const authMiddleware=require("../middleware/authMiddleware.js");
router.post("/signup",signup);
router.post("/login",login);
router.get("/profile",authMiddleware,(req,res)=>{
    console.log("Profile Route Reached");
    return res.status(200).json({
        message:"Protected route accessd success",
        user:req.user
    });
});
module.exports=router;