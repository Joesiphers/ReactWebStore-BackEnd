const express = require('express');
const cors=require('cors');
const Mongoose  = require('mongoose');
const app=express();

app.use(cors());
app.use(express.json() );
app.use((req,res,next)=>{
    res.setHeader('Accept-Control-Allow-Origin','*' );
    res.setHeader('Access-Control-Allow-Headers','X-Auth-Token,Origin,X-Requested-With','Content-Type','Accept','Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    next()
});
app.use((req,res,next)=>{ 
    console.log("receiver request",req.url," method:",req.method,req.body);next()} );
const csvfile=require('./model/csvtomodel.js');
app.get('/csv',csvfile.get);
app.use((req,res,next)=>{
    const error=new Error("wrong",401);
    throw error;
});


app.use((error, req,res,next)=>{

})
const uri = "mongodb+srv://sharp:supersharp@cluster0.zt01z.mongodb.net/webstore?retryWrites=true&w=majority";
try{
    Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(5000);

}catch(err){console.log("mongoDB connection fail",err )
return err}

