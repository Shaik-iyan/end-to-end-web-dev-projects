const express=require("express");
const cors=require("cors");
require("dotenv").config();
const connectDb=require("./config/db.js");
const authRoutes=require("./routes/authRoutes.js");
const monitorRoutes=require("./routes/monitorRoutes.js");
const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/monitors",monitorRoutes);
app.get("/",(req,res)=>{
    res.status(200).json({success:true,message:"welcome to devpulse api"});
});
const startServer=async()=>{
    await connectDb();
    const PORT=process.env.PORT || 5000;
    app.listen(PORT,()=>{
    console.log(`devpulse server running on port http://localhost:${PORT}`);
});
};
startServer();