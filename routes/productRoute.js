const express=require('express');
const router=express.Router();
const productController=require('../model/productController');
router.get('/:id',productController.getProduct)
router.get('/all',productController.getProduct)

router.post('/create',productController.createDB)
module.exports=router;