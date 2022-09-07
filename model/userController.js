const express=require('express');
const router=express.Router();
const Users=require('./userModel');
const mulForm=require('../routes/files')
const {body,check,validationResult}=require('express-validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const tokenSalt="notAbackKey_noWorry";
/*     const token=req.headers.authorization;
    if (!token){
        const error=new Error ("token not found");
        next (error);
    }
    try { 
        const decodedToken=jwt.verify(token, tokenSalt);
        req.userdata={email:decodedToken.email};
        console.log("decoded",decodedToken)
    }
    catch(err){
        console.log(err, "token verify fail ");
        const error=new Error ("token Verify Fail");
        return next (error);
    } */

const getUser=async (req,res,next)=>{
  //  router.use(checkAuth);
    console.log('getuser',req.userData);
   try{  const email=req.userData.email
    const user=await Users.findOne({email:email})
   // console.log('req.body',user.userinfo);
    const resp={message:"retrieve user Information successfully",
    userinfo:user.userinfo};
   // console.log(resp,"user")
    res.status(200).json(resp);
}
    catch(err) { 
       return next (err)
    }
    } ;

const login=async (req,res,next) =>{
    console.log("REQ", req.body);
    const {email,password}=req.body;
    let loginUser;
    try {loginUser=await Users.findOne({email:email});}
    catch (err){
       const error =new Error ("can not find user");
       error.code=403
      return next (error);
    }
    
    if (!loginUser){
        error =new Error ("This user/email not registered")
        error.code=401
        return next(error)
    }
    let isPasswordValid;
    try {
        isPasswordValid=await bcrypt.compare(password,loginUser.password);
        if (!isPasswordValid){
            const error =new Error ("invalid password, please try again");
            error.code=405
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
        const error =new Error ("gen token error");
        return next (error);
    }
    const uname=loginUser.username
    console.log(loginUser,"username",uname)
    res.status(200).json({
        message:"welcom back"+uname,
        token:token,
        username:uname,
        email:email
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
    const {username,email,password}=req.body;
    let isRegistered;
    try{isRegistered=await Users.findOne({email:email});
    //console.log ("pass")
        if(isRegistered) {
        const error=new Error("email already registered");
        error.code=440
        return next (error)
    }
}
    catch(err){
        console.error(err); 
        const error=new Error("email check fail");
        error.code=441
        return next (error);
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
        username,email,password:hashPassowrd
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
        username:username,
        token:token, //send back a token for auth.
        });
        console.log("success signup")
    }; 
const updateUser=async (req,res,next)=>{
  //  console.log("go update")
    //update address.
    console.log(req.userdata,"goupdate",req.body.userinfo,)
    const email=req.userdata.email;
   // console.log(email,"tokenemail",req.body);
    const user=await User.findOne({email:email});
    if (!user){throw new Error("user not found")}
    const userinfo=req.body.userinfo
    //console.log(user.username, userinfo,"before asign")
    // if (userinfo.username!=''){
    //     user.username=userinfo.username
    //     console.log(user.username,"update username 1",userinfo.username)
  
    // }else{}
    Object.assign(user.userinfo,userinfo)
       // console.log(i, user[i],req.body.userinfo[i])
    ;
   // console.log(user.userinfo,"after asign",user)
    await user.save();
    //console.log(user.username,"update username",userinfo.username)
    console.log(user)
    res.status(200).json({
        message:`User information updated`})
}
const test=async (req,res,next)=>{
    console.log(process.env.T,process.env.test)
    res.status(200).json({
        message:`test successfully`})
}

exports.login=login
exports.test=test
exports.getUser=getUser
exports.updateUser=updateUser
exports.singupUser=singupUser