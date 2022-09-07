const mongoose=require('mongoose');
//const uniqueValidator=require('mongoose-')
const Schema=mongoose.Schema
const userSchema=new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true,minlength:3},
    image:{type:String},
    cart:[{type:Schema.Types.ObjectId, ref:"Carts"}],
    userinfo:{
        username:{type:String},
        firstName:{type:String},
        lastName:{type:String},        
        streetNumber:{type:String},
        secondLine:{type:String},
        suburb:{type:String},
        state:{type:String},
        postcode:{type:String},
        phone:{type:String}, 
    },

})
module.exports=mongoose.model('Users',userSchema);

