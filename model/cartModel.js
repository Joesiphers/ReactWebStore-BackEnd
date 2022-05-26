const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
    creator:{type:String,required:true},
    items:{types:Array,required:true},
})
module.exports=mongoose.model("cart", cartSchema);