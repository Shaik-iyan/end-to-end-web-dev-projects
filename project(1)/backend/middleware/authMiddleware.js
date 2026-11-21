const jwt =require("jsonwebtoken");
const authMiddleware=(req,res,next)=>{
    try{console.log("authmiddleware atarted");
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({message:"Accesss denied no token provided"});
        }
        const token=authHeader.split(" ")[1];
        const decoded=jwt.verify(
            token,process.env.JWT_SECRET
        );
        req.user=decoded;
        next();
    }catch(error){
        console.log("jwt error",error.name);
        console.log("jwt message",error.message);
        return res.status(401).json({message:"invalid or expired token"});

    }
};
module.exports=authMiddleware;