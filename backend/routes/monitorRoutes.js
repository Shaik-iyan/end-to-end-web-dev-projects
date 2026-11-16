const express=require("express");
const router=express.Router();
const authMiddleware=require("../middleware/authMiddleware.js");
const{createMonitor,getMyMonitors,updateMonitor}=require("../controllers/monitorController.js");
router.post("/",authMiddleware,createMonitor);
router.get("/",authMiddleware,getMyMonitors);
router.put("/:id",authMiddleware,updateMonitor);
module.exports=router;