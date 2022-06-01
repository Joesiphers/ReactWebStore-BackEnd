const mongoose=require('mongoose');
//const uniqueValidator=require('mongoose-')
const userSchema=new mongoose.Schema({
    userName:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true,minlength:3},
    image:{type:String},
    userInfo:{
        fistName:{type:String},
        lastName:{type:String},        
        number:{type:String},
        secondLine:{type:String},
        suburb:{type:String},
        state:{type:String},
        postcode:{type:String},
        phone:{type:String}, 
      
    },




})
module.exports=mongoose.model('User',userSchema);

