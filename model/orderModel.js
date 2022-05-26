const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    creator:{type:String,required:true},
    items:{types:Array,required:true},
    placeDate:{types:String,required:true},
    deliveryAddress:{type:String}
})
module.exports=mongoose.model("order", orderSchema);