const Orders=require('./orderModel')
const Users=require('./userModel')

const create=async (req,res,netx)=>{
    const user=await Users.findOne({email:req.userData.email})
    const data=req.body
//    console.log("req.body",data)
    try{ 
        const {paymentDetails,items,shippingFee,shippingAddress}=data
        const {firstName,lastName,streetNumber,secondLine,state,
            suburb,postcode,phone}= shippingAddress
        const {status,payer,update_time,id}=paymentDetails
        const order=new Orders(
            {
            buyer:user._id,
            items:items,
            orderTime:update_time,
            deliveryAddress:{
                streetNumber:streetNumber,
                secondLine:secondLine,
                suburb:suburb,
                state,
                postcode,
                phone,
                firstName,
                lastName
            } ,
            shippingFee,
            paymentInfo:{paypalAccount:payer.email_address,
                        status,
                        completeTiime:update_time
                }
            })
            console.log(order,"orderCreated")
        await order.save()
        console.log("saved")
    }
    catch{err=>console.log(err)}
    res.status(200).json({
        "message":"order saved",
        "newOrder":data }
        )
}
const getOrder=async (req,res,next)=>{
    const user=await Users.findOne({email:req.userData.email})
    const orders=await Orders.find({buyer:user._id})
    console.log("found orders", orders)
    res.status(200).json(
        {orders}
    )
}
const search=(req,res,next)=>{
    console.log("=")
    res.status(200).json("Ok")}

exports.search=search
exports.create=create
exports.getOrder=getOrder