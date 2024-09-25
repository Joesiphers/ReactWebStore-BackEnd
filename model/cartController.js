const Carts=require('./cartModel')
const User=require('./userModel')
const Products=require('./productModel')

const quantityChange=async (req,res,next)=>{
    const {size,sku,quantity,_id,buyer}=req.body
    //console.log("toChange",size,sku,quantity,)
    let toChangeItem=await Carts.findById(_id)
    console.log(toChangeItem.quantity)
    toChangeItem.quantity+=quantity
    await toChangeItem.save()
    let carts=await Carts.find({buyer:buyer}).populate('pid','price pid')
        //update the price of each item as per product collection's price
        carts.forEach(item=>{
            item.price=item.pid.price
        }
            )
    res.status(200).json(
        carts
    )
}
const getCart=async (req,res,next)=>{
    const user=await User.findOne({email:req.userData.email})
    /* when User do not save the cart[], need to search two collection for 
    user's cart details.
    const user=await User.findOne({email:req.userData.email})
     const cart=await Carts.find({buyer:user})
    */
    const userCart=await Carts.find(
                            {buyer:user})
                            .populate('pid','price pid')
                    //field cart need to be found on another Model
 //   console.log(userCart,"USER carts found")
    //update the price of each item as per product collection's price
    userCart.forEach(item=>{
        item.price=item.pid.price
    }
        )
        //console.log(userCart)
    res.status(200).json(
        //cart
        //message"OK"
        userCart
    )
}

const addItem=async (req,res,next)=>{
    const {pid, sku,selectedSize,quantity }=req.body;
    //console.log(id, sku,selectedSize,"to add item")
    const user=await User.findOne({email:req.userData.email})
    const product=await Products.findOne({pid:pid})
/**following will save two pointers in Users.cart[] and Cart.buyer */
    let newCartData;
    try {
        let record = await Carts.findOne({
            buyer:user.id
            //search this user have items in cart?
        })
        if (!record){ //no record, just add in
            newCartData=new Carts({
                buyer:user._id,
                pid:product._id,
                sku,
                size:selectedSize,
                quantity:quantity
                })
                await newCartData.save()
        }
        else{ 
            if (record.sku!=sku) {   
                //this sku not in cart before->simply save it
                    console.log(user.id,"Have no record of ",sku)
                    newCartData=new Carts({
                    buyer:user._id,
                    pid:product._id,
                    sku,
                    size:selectedSize,
                    quantity})
                    await newCartData.save()
            }
            else {  //if product._id/SPU exist-> check if the same user
               // console.log("found cart",record)
                console.log("buyer, have record",)
                let totalQuantity=record.quantity+quantity
                console.log(typeof(quantity),typeof(record.quantity),parseInt( quantity))
                record.quantity=totalQuantity
                await record.save()
                }
            }
        }
    catch(err){console.log(err)}
    try {
        const userCart=await Carts.find(
            {buyer:user})
            .populate('pid','price pid')
            //field cart need to be found on another Model
        //   console.log(userCart,"USER carts found")
        //update the price of each item as per product collection's price
        userCart.forEach(item=>{
        item.price=item.pid.price
        }
        )
        console.log(userCart)
        res.status(200).json(
        //cart
        //message"OK"
        userCart
        )
        // let saved=await Carts.find({buyer:user.id}).populate('pid', 'price')
        // console.log("saved", saved)
        // await Products.findOne({sku:sku},'price')
        // .then(res=>{
        //     saved.price=res.price
        //     saved.size="L"
        // }
        //     )
        // res.status(200).json(
        //     saved
        //        )
        }
    catch (err){console.log(err)}
}

const search=async (req,res,next)=>{
    const {pid,email, sku}=req.body;
    const user=await User.findOne({email:email})
    let record
    try {
        console.log(sku,pid,user.id)
        record = await Carts.findOne({
            buyer:user.id,
            //sku:sku
        })
        console.log("record",record)
        const buyer=record.buyer
        console.log("=", buyer!=user.id)
    }
        catch{e=>console.log(e)}
    if(record){res.status(200).json({record:record})}
    else{res.status(200).json({message:"no record"})}
}
const removeItem=async (req,res,next)=>{
    const {buyer, sku}=req.body;
    console.log("remove",req.body)
    const user=await User.findOne({_id: buyer})
    console.log("remove",sku,user)
    try{
         await Carts.deleteOne({buyer:user, sku:sku})
    }catch (err){console.log(err)}
    try {
        const userCart=await Carts.find(
            {buyer:user})
            .populate('pid','price pid')
        userCart.forEach(item=>{
        item.price=item.pid.price
        }
        )
        console.log(userCart)
        res.status(200).json(userCart)
    }
        catch (err){console.log(err)}
}
exports.addItem=addItem
exports.getCart=getCart
exports.search=search
exports.quantityChange=quantityChange
exports.removeItem=removeItem