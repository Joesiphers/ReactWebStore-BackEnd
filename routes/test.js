const response=async (req,res,next)=>{
    console.log("finding products");
    res.json({res:"test"});
}

module.exports=response;