const express=require("express");
const router=express.Router();
const authMiddleware=require("../middleware/authMiddleware.js");
const{createMonitor,getMyMonitors,updateMonitor,deleteMonitor}=require("../controllers/monitorController.js");
router.post("/",authMiddleware,createMonitor);
router.get("/",authMiddleware,getMyMonitors);
router.put("/:id",authMiddleware,updateMonitor);
router.delete("/:id",authMiddleware,deleteMonitor);
module.exports=router;