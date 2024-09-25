const mongoose=require('mongoose');
const Schema=mongoose.Schema
const cartSchema=new Schema({
    //email from userModel  schema export as "Users"
    buyer:{type:Schema.Types.ObjectId,required:true,ref:"Users"},
    pid:{type:Schema.Types.ObjectId,required:true,ref:"Products"},
    sku:{type:String,required:true},
    quantity:{type:Number,required:true},
    size:{type:String, required:true},
    price:{type:Number}
})
module.exports=mongoose.model("Carts", cartSchema);