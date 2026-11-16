const User=require("../models/User.js");
const bcrypt=require("bcryptjs");
const jwt =require("jsonwebtoken");
const signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }
        if(password.length<8){
            return res.status(400).json({
                success:false,
                message:"password must be at least 8 charectres"
            });
        }
        const existingUser=await User.findOne({email:email.trim().tolowerCase});
        if(existingUser){
            return res.status(409).json({success:false,message:"email already registeres"});
        }
        const hashedpassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,email,password:hashedpassword
        });
        return res.status(201).json({
            success:true,
            message:"User registered sucess",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });
    }catch(error){
        if(error.code === 11000){
            return res.status(409).json({
                success:false,
                message:"email already registered"
            });
        }
        console.log("Signup error:",error.message);
        return res.status(500).json({success:false,message:"internal server error"});
    }
};
const login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"email and password are required"});
        }
        const user=await User.findOne({
            email:email.toLowerCase()
        });
        if(!user){
            return res.status(401).json({
                message:"invalid email or password"
            });
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(402).json({message:"invalid email or password"});
        }
        const token=jwt.sign({
            userId:user._id,role:user.role
        },process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRES_IN ||"1d"
        });
        return res.status(200).json({message:"login successful",token,user:{
            id:user._id,name:user.name,email:user.email,role:user.role
        }});
    }catch(error){
        console.log("login error:",error);
        return res.status(500).json({message:"internal server error"});
    }
};
module.exports={signup,login};