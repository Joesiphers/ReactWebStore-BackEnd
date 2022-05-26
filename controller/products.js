const Products=require('../model/productModel') ;
const getProducts=async (req,res,next)=>{
    console.log("finding products");
    const list=await Products.find();
    res.json(list);
}
exports.getProducts=getProducts;