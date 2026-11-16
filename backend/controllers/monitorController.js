const MonitoredAPI=require("../models/MonitoredAPI.js");
const createMonitor=async(req,res)=>{
    try{
        const{name,url,method}=req.body;
        if(!name || !url){
            return res.status(400).json({
                message:"Name and URL are required"
            });
        }
        const newAPI=await MonitoredAPI.create({
            name,url,method:method || "GET",
            createdBy:req.user.userId
        });
        res.status(201).json({
            message:"API registred success",
            data:newAPI
        });
    }catch(error){
        console.log("monitor creation error",error.message);
        res.status(500).json({message:"Server error"});
    }
};
const getMyMonitors=async(req,res)=>{
    try{
        const monitors=await MonitoredAPI.find({
            createdBy:req.user.userId
        });
        res.status(200).json({
            message:"your monitored APIs",
            data:monitors
        });
    }catch(error){
        console.log("Get monitors error:",error);
        res.status(500).json({message:"server error"});
    }
};
const updateMonitor=async (req,res)=>{
    try{
        const{name,url,method}=req.body;
        const updatedAPI=await MonitoredAPI.findOneAndUpdate({
            _id:req.params.id,
            createdBy:req.user.userId
        },{name,url,method},{returnDocument:"after",runValidators:true});
        if(!updatedAPI){
            return res.status(404).json({message:"APi not found or you are not authorized to update it"});
        }
        res.status(200).json({message:"API updated success",data:updatedAPI});
    }catch(error){
        console.log("req.user",req.user);
        console.log("params id:",req.params.id);
        console.log("update monitor error",error.message);
        res.status(500).json({message:"Server error"});
    }
};
module.exports={createMonitor,getMyMonitors,updateMonitor};