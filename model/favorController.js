const mongoose=require('mongoose')
const Users=require('./userModel')
//const Favors=require('./favorModel')
const Products=require('./productModel')
const addToFavor=async (req,res,next)=>{
    console.log("got add", req.body,req.userData)
    const {pid}=req.body
    const {email}=req.userData
    const user=await Users.findOne({email:email})
    await user.favor.push(parseInt(pid))
    await user.save()
    console.log(user,user.favor)
    
res.status(200).json({message:"saved",favorList:user.favor})
}
const removeFromFavor=async (req,res,next)=>{
    const {pid}=req.body
    const {email}=req.userData
    let user=await Users.findOne({email:email})
    const newFavor=await user.favor.filter(i=>i!==pid)
    console.log(user.favor,"removed",newFavor)
    user.favor=newFavor
     await user.save()
     console.log("after remove Favor", user.favor)
     res.status(200).json({message:"saved",favorList:user.favor})
}
const getFavorList=async (req,res,next)=>{
    console.log("searching Favor List")
    const {email}=req.userData
    const user=await Users.findOne({email:email})
    const favorlist=await Users.findOne({email:email},'favor')
    const productList=await Products.find({pid:{$in: user.favor} })
    console.log(favorlist, productList)
    res.status(200).json({message:"list",favorList:productList})

}

exports.addToFavor=addToFavor
exports.removeFromFavor=removeFromFavor
exports.getFavorList=getFavorList