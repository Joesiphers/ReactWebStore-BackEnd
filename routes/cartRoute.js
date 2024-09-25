const express=require('express');
const cartRouter=express.Router();
const checkAuth=require('../middleWare/checkToken')
const cartController=require('../model/cartController')
/*cartRouter.use((req,res,next)=>{
    console.log("req-body", req.body)
    next()
})*/
cartRouter.get('/search', cartController.search)
cartRouter.use(checkAuth)
cartRouter.get('/get_cart', cartController.getCart)
cartRouter.post('/add_item', cartController.addItem)
cartRouter.post('/quantity_change', cartController.quantityChange)
cartRouter.post('/remove_item', cartController.removeItem)

module.exports=cartRouter;
