const mongoose=require('mongoose')
const Schema=mongoose.Schema
const favorSchema= new Schema({
    favorList:{type:Array},
    user:{type: Schema.Types.ObjectId,required:true, ref:'Users'}
})
module.exports=mongoose.model('Favors', favorSchema)