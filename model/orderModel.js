const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    buyer:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Users'},
    items:{type:Array,required:true},
    orderTime:{type:String,required:true},
    deliveryAddress:{type:Object,required:true},
    shippingFee:{type:Number,required:true},
    paymentInfo:{type:Object}

})
module.exports=mongoose.model("order", orderSchema);