const Carts=require('./cartModel')
const User=require('./userModel')
const Products=require('./productModel')
const getCart=async (req,res,next)=>{
    console.log("carts found")
    /* when User do not save the cart[], need to search two collection for 
    user's cart details.
    const user=await User.findOne({email:req.userData.email})
     const cart=await Carts.find({buyer:user})
    */
    const userCart=await User.findOne({email:req.userData.email})
                    .populate('cart') //field cart need to be found on another Model
    console.log(userCart,"USER carts found")
    res.status(200).json(
        //cart
        "OK"
    )
}

const addItem=async (req,res,next)=>{
    const {id, sku,selectedSize,quantity }=req.body;
    //console.log(id, sku,selectedSize,"to add item")
    const user=await User.findOne({email:req.userData.email})
    const product=await Products.findOne({id:id})
/**following will save two pointers in Users.cart[] and Cart.buyer */
    try {
        let record = await Carts.findOne({
            spu:product._id
        })
        console.log("no record in cart")
        let newCartData;
        if (!record){    
            newCartData=new Carts({
        buyer:user._id,
        id:product._id,
        sku,
        size:selectedSize,
        quantity
        })}
        else {  //if product._id exist check if the same user
            console.log("got cart",record)
            if (record.buyer===user._id){

            }else{

        }
        }
            try {
                await newCartData.save()
                const saved=await Carts.findOne({sku})
                console.log("saved", saved)
                res.status(200).json(
                    JSON.stringify(
                        {id:saved.id,
                            quantity:saved.quantity,
                            size:saved.size,
                            sku:saved.sku
                        }
                    )
                )
                }
                catch (err){console.log(err)}
                
        

        else {console.log("cart exist")
            res.status(200).json(
                JSON.stringify(record)
            )
        }
    }
/*  when only save one poiter in cart collection
    there is no cart[] in User Model.
    this is not finished code. .. need to add:
    when record existed-> then add quantity

    try {
        let record = await Carts.findOne({
            sku:sku,
            buyer:user
        })
        console.log("got cart",record)
        if (!record){    
            const newCartData=new Carts({
        buyer:user._id,
        id:product._id,
        sku,
        size:selectedSize,
        quantity
    })
            try {
                await newCartData.save()
                const saved=await Carts.findOne({sku})
                console.log("saved", saved)
                res.status(200).json(
                    JSON.stringify(
                        {id:saved.id,
                            quantity:saved.quantity,
                            size:saved.size,
                            sku:saved.sku
                        }
                    )
                )
                }
                catch (err){console.log(err)}
                
        }

        else {console.log("cart exist")
            res.status(200).json(
                JSON.stringify(record)
            )
        }
    } */
    catch(err){console.log(err)}
}

exports.addItem=addItem
exports.getCart=getCart