const express=require('express');
const router=express.Router();
const User=require('../model/userModel');
const mulForm=require('./files')
const {body,check,validationResult}=require('express-validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const checkToken = require('../middleWare/checkToken');
const tokenSalt="notAbackKey_noWorry";

const getUser=(req,res,next)=>{
    console.log(req.body);
    res.status(400).json("email ");
}
const login=async (req,res,next) =>{
    console.log("REQ", req.body);
    const {email,password}=req.body;
    let loginUser;
    try {loginUser=await User.findOne({email:email});}
    catch (err){
       const error =new Error ("internal error, faile to check user");
       next (error);
    }
    
    if (!loginUser){
        error =new Error ("This user/email not registered")
        return next(error)
    }
    let isPasswordValid;
    try {
        isPasswordValid=await bcrypt.compare(password,loginUser.password);
        if (!isPasswordValid){
            const error =new Error ("invalid password, please try again");
            next (error);
        }
    }    
    catch (err){
        const error =new Error ("password error, login faile");
        next (error);
    }
    let token;
    try {
        token = await jwt.sign({
            email:email},
            tokenSalt,
            {expiresIn:"1h"}
        )
    }catch(err){
        const error =new Error ("password error, login faile");
        next (error);
    }
    res.status(200).json({
        message:"welcom back",
        email:email,
        token:token
    })
}

const singupUser=async (req,res,next)=>{
    console.log("signning",req.body);
//Validation;with express-validation module;
    const error=validationResult(req.body); //work with check in app,js;
    if (!error.isEmpty()){
        let errorMessages=error.errors.map((e)=>{
            return "check:"+e.param+" : "+e.value;});
            const errorMsg=errorMessages.toString();
            console.log("error return",error);
            res.status(402).send(errorMsg); 
           return next( new Error('chek invalid input',402));
    }
    //check email registered?
    const {name,email,password}=req.body;
    let isRegistered;
    try{isRegistered=await User.findOne({email:email})}
    catch(err){
        console.error(err); 
        const error=new Error("registed email");
        next (error);
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
        name,email,password:hashPassowrd
    }) ;
    try{  await newUser.save();
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
        token:token, //send back a token for auth.
        });
    }; 
const updateUser=async (req,res,next)=>{
    //update address.
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
    const email=req.userData.email;
    console.log(email,"tokenemail",req.body);
    const user=await User.findOne({email:email});
    user.address=JSON.stringify(req.body.address);
    await user.save();
    console.log(user)

    res.json("hi, "+email)
}

//router.use(checkToken);
router.get('/email',getUser);
router.put('/update', updateUser);
router.post('/signup',mulForm.single(), singupUser);
router.post('/login',login);

module.exports=router;
