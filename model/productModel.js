const mongoose=require(`mongoose`);

const productSchema=new mongoose.Schema({
    id:{type:Number,required:true},
    sku:{type:Number,required:true},
    title:{type:String,required:true},
    description:{type:String},
    avaliableSizes:{type:Array},
    style:{type:String},
    price:{type:Number,required:true},
    installments:{type:Number},
    currencyID:{type:String},
    currencyFormat:{type:String},
    isFreeShipping:{type:Boolean},
});
module.exports=mongoose.model('products',productSchema);
