const express=require('express');
const orderRouter=express.Router();
const checkAuth=require('../middleWare/checkToken')
const orderController=require('../model/orderController')
/*orderRouter.use((req,res,next)=>{
    console.log("req-body", req.body)
    next()
})*/
orderRouter.get('/search', orderController.search)
orderRouter.use(checkAuth)
orderRouter.get('/get_order', orderController.getOrder)

orderRouter.post('/create', orderController.create)
//
module.exports=orderRouter;

