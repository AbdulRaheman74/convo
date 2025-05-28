import jwt, { decode } from "jsonwebtoken"

const isAuthenticate=async(req,res,next)=>{
try {
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({message:"User Not Found Authenticate",success:false})

    }
    const deCode= await jwt.verify(token,process.env.SECRET_KEY);
    if(!deCode){
        return res.status(401).json({message:"Invalid",success:false})
        
    }

    req.id=deCode.userId;
    next(); 
} catch (error) {
   console.log(error.message) 
}
}

export default isAuthenticate;