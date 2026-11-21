const mongoose=require("mongoose");
const { lowercase } = require("zod");
const { required } = require("zod/mini");
const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,required:true,trim:true
        },email:{
            type:String,
            required:true,unique:true,lowercase:true,trim:true
        },password:{
            type:String,
            required:true},
            role:{type:String,
            enum:["develpoer","admin"],
            default:"develpoer"
        }
    },{timestamps:true}
);
const User=mongoose.model("User_2",userSchema);
module.exports=User;