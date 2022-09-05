const Products=require('./productModel') ;
const toDB=require('../controller/addcsvtodb')
const getProduct=async (req,res,next)=>{
    const id=req.params.id
    console.log("finding products",id);
    let list;
    if (id==='all'){
        list=await Products.find();
        console.log("finding all")
        res.status(200).json(list);  

    }else if (typeof(parseInt(id)==='number'))
        {list=await Products.findOne({id:parseInt(id)})
        console.log("finding",id,list)
        res.status(200).json(list);  
    }else{
    res.status(400).json("wrong product request");  

}
    
    
}
const createDB=async (req,res,next)=>{
    console.log("create",req)
    const productsArray=req.body.products
    console.log("create",productsArray)
    //const productsArray=await JSON.parse(products)
    console.log(productsArray)
    toDB.objArraytodb(productsArray)
    res.status(200).json("created")
}
exports.getProduct=getProduct;
exports.createDB=createDB