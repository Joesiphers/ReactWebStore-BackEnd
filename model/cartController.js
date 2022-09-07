const Carts=require('./cartModel')
const User=require('./userModel')
const Products=require('./productModel')
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
            
            if (record.sku!=sku) {   //this sku not in cart before->simply save it
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
        let saved=await Carts.find({buyer:user.id}).populate('pid', 'price')
        console.log("saved", saved)
        await Products.findOne({sku:sku},'price')
        .then(res=>{
            saved.price=res.price
            saved.size="L"
        }
            )
        res.status(200).json(
            saved
            // JSON.stringify(
            //     {
            //     pid:saved.pid,
            //     quantity:saved.quantity,
            //     size:saved.size,
            //     sku:saved.sku,
            //     price:p.price
            //     }
            //    ) 
               )
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
exports.addItem=addItem
exports.getCart=getCart
exports.search=search