const mongoose=require(`mongoose`);

const productSchema=new mongoose.Schema({
    pid:{type:Number,required:true},
    sku:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String},
    availableSizes:{type:Array},
    size:{type:String,required:true},
    style:{type:String},
    price:{type:Number,required:true},
    installments:{type:Number},
    currencyID:{type:String},
    currencyFormat:{type:String},
    isFreeShipping:{type:Boolean},
    image:{type:String}
});
module.exports=mongoose.model('Products',productSchema);
