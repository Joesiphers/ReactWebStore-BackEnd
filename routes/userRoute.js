const express=require('express');
const router=express.Router();
const User=require('../model/userModel');
const mulForm=require('./files')
const {body,check,validationResult}=require('express-validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const checkToken = require('../middleWare/checkToken');
const req = require('express/lib/request');
const tokenSalt="notAbackKey_noWorry";
/*     const token=req.headers.authorization;
    if (!token){
        const error=new Error ("token not found");
        next (error);
    }
    try { 
        const decodedToken=jwt.verify(token, tokenSalt);
        req.userData={email:decodedToken.email};
        console.log("decoded",decodedToken)
    }
    catch(err){
        console.log(err, "token verify fail ");
        const error=new Error ("token Verify Fail");
        return next (error);
    } */
const checkAuth=(req,res,next)=>{
    console.log("checking")
        const token=req.headers.authorization
//    console.log(req.headers, token, "checkauth")
    if (!token){
        const error=new Error("token not found")
            error.code=444
           return next (error)
      }
   try{ const decodedToken=jwt.verify(token,tokenSalt);
    console.log("decode",decodedToken.email)
    req.userData={email:decodedToken.email}
    next()
    //add userData into req. so next function can take the email out.
}
    catch(err){console.log(err);
            const error=new Error("token verify fail")
            error.code=444
            return next (error)
        }
}
const getUser=async (req,res,next)=>{
  //  router.use(checkAuth);
    console.log('req auth',req.userData);
    const email=req.userData.email
     console.log('req.body',email);
   const user=await User.findOne({email:email})
    const userInfo=user.userInfo
    res.status(200).json({
        message:"retrieve user Information successfully",
        userInfo:userInfo
    })    
    console.log(user,"user")
    } ;




const login=async (req,res,next) =>{
    console.log("REQ", req.body);
    const {email,password}=req.body;
    let loginUser;
    try {loginUser=await User.findOne({email:email});}
    catch (err){
       const error =new Error ("can not find user");
       error.code=303
      return next (error);
    }
    
    if (!loginUser){
        error =new Error ("This user/email not registered")
        error.code=301
        return next(error)
    }
    let isPasswordValid;
    try {
        isPasswordValid=await bcrypt.compare(password,loginUser.password);
        if (!isPasswordValid){
            const error =new Error ("invalid password, please try again");
            error.code=305
           return next (error);
        }
    }    
    catch (err){
        const error =new Error ("password error, login faile");
        return next (error);
    }
    let token;
    try {
        token = jwt.sign({
            email:email},
            tokenSalt,
            {expiresIn:"1h"}
        )
    }catch(err){
        const error =new Error ("password error, login faile");
        return next (error);
    }
    const {userName}=loginUser.userName
    res.status(200).json({
        message:"welcom back",
        token:token,
        userName:userName,
    })
}

const singupUser=async (req,res,next)=>{
    console.log("signning",req.body);
//Validation;with express-validation module;
    const error=validationResult(req.body); 
    //work with check in app,js;
    if (!error.isEmpty()){
        let errorMessages=error.errors.map((e)=>{
            return "check:"+e.param+" : "+e.value;});
            const errorMsg=errorMessages.toString();
            console.log("error return",error);
            res.status(402).send(errorMsg); 
           return next( new Error('chek invalid input',402));
    }
    //check email registered?
    const {userName,email,password}=req.body;
    let isRegistered;
    try{isRegistered=await User.findOne({email:email});console.log ("pass")}
    catch(err){
        console.error(err); 
        const error=new Error("registed email");
        return next (error);
        }
    if(isRegistered)   {
        res.json("email already registered")
        return
    }
    //hash password to hash

let hashPassowrd;
    try {hashPassowrd=await bcrypt.hash(password,10)}
    catch(err){
        const error=new Error ("hash password fail.")
        res.json( "internal error,hash password fail,please try again");
        return next(error)
    }
    const newUser=new User({
        userName,email,password:hashPassowrd
    }) ;
    try{  await newUser.save(); console.log("saved new user")
    }
    catch(err){
        console.log("error",err)
        const error=new Error ("save newUser fail.")
        return next(error)

    }
    //create token;
    let token; //create jsonwebtoken for auth;
    try {
        token=jwt.sign(
            {email:newUser.email
            },
            "notAbackKey_noWorry",
            {expiresIn:'1h'}
        )
    }
    catch(err){console.log(err)
        const error=new Error ("JWT Generate token fail.")
        return next(error)

    }
    res.status(200).json({
        message:`welcom new User`,
        email:email,
        userName:userName,
        token:token, //send back a token for auth.
        });
        console.log("success signup")
    }; 
const updateUser=async (req,res,next)=>{
    //update address.
    //console.log(req.userData,req.body,"goupdate")
    const email=req.userData.email;
    console.log(email,"tokenemail",req.body);
    const user=await User.findOne({email:email});
    for (let i in req.body.address){
        user.userInfo[i]=req.body.address[i]
 //       console.log(user.userInfo[i])
    };
    await user.save();
    res.status(200).json({
        message:`User information updated`})
}
const test=async (req,res,next)=>{
    console.log(process.env.T,process.env.test)
    res.status(200).json({
        message:`test successfully`})
}
router.post('/signup',mulForm.single(), singupUser);
router.post('/login',login);
router.post ('/test',test);
router.get('/getUser',getUser);
router.put('/updateUser', updateUser);


module.exports=router;
