const express=require("express");
const router=express.Router();
const authMiddleware=require("../middleware/authMiddleware.js");
const{createMonitor,getMyMonitors}=require("../controllers/monitorController.js");
router.post("/",authMiddleware,createMonitor);
router.get("/",authMiddleware,getMyMonitors);
module.exports=router;