const express = require('express');
const cors=require('cors');
const Mongoose  = require('mongoose');
const app=express();
const multer=require('multer');
const upload = multer({ dest: 'uploads/' })
const csvmodel=require('./model/csvtomodel.js');
const productRoute=require('./routes/productRoute')
const userRoute=require('./routes/userRoute');
const cartRoute=require('./routes/cartRoute')
const orderRoute=require('./routes/orderRoute')
const favorRoute=require('./routes/favorRoute')
const {check}=require('express-validator');
const res = require('express/lib/response');

app.use(cors());
 app.use(express.json() );
//  app.use((req,res,next)=>{
//     res.setHeader('Accept-Control-Allow-Origin','*' );
//     res.setHeader('Access-Control-Allow-Headers','X-Auth-Token,Origin,X-Requested-With','Content-Type','Accept','Authorization')
//     res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
//     next();})

app.use((req,res,next)=>{ 
    console.log("receiver request",req.url," method:",req.method);
    next()});
app.use('/users',[
                    check('email').normalizeEmail().isEmail(),
                    check('password').not().isEmpty().isLength ({min:3}),
                    ],
                    userRoute);

app.post('/product_file', upload.single('file'),
   async function(req,res,next){ 
        console.log("Receive product file:" );
       if(!req.file){console.log("no file ");
            res.status(400).json("no file ");
            return
        }
    const path=req.file.path;
    console.log(path,"path");
    csvmodel.csvjson(path);
    // csvmodel.fastcsvTo(path);
        }    );
app.use('/product',productRoute);
app.use('/cart',cartRoute)
app.use('/order', orderRoute)
app.use('/favor', favorRoute)
app.use((error, req,res,next)=>{ //唯一的要有error在最前面的，对所有的错误的反应。
    if (req.file){fs.unlink(req.file.path,(err)=>{console.log (err)}) };
    if (res.headersSent){ //注意是headers
        //console.log('more error');
       return next (error);
    };
    console.log(error,"app.js");
    res.status(error.code||500).json({message: error.message || 'An unknown error occurred!'})
});

process.env.test="hahaha"
const PORT=process.env.PORT||5000
const pass='TQ6yb5nfakuJkWHy'
const uri = `mongodb+srv://sharp:${pass}@cluster0.zt01z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
try{
    Mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    app.listen(PORT);
    }
catch(err){console.log("mongoDB connection fail",err );
    //app.listen(PORT);
    //app.us('/', 
        res.status(408) .json({message:"mongoose conection fail",
    error:err
        })
    //)
} 
 
