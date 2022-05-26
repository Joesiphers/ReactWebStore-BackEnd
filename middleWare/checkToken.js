const jwt=require('jsonwebtoken');
const tokenSalt="notAbackKey_noWorry";


async function checkToken (req,res,next){
    const token=req.headers.authorization;
    if (!token){
        const error=new Error ("token not found");
        next (error);
    }
    try { 
        const decodedToken=jwt.verify(token, tokenSalt);
        req.userData={email:decodedToken.email};
        console.log("decoded",decodedToken);
        next();
    }
    catch(err){
        console.log(err, "token verify fail ");
        const error=new Error ("token Verify Fail");
        return next (error);
    }
}
module.exports=checkToken;

