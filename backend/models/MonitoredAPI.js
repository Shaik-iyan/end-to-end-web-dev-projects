const mongoose=require("mongoose");
const { required } = require("zod/mini");
const monitoredAPISchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    method:{
        type:String,default:"GET"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User_2",required:true
    }
},{
    timestamps:true
});
const monitorAPI=mongoose.model("MonitoredAPI",monitoredAPISchema);
module.exports=monitorAPI;