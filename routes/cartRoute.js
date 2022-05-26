const express=require('express');
const router=express.Router();
const Cart=require('../model/userModel');

router.use('cart',decodeToken);
router.post('cart',addItems);
router.delete('cart',removeItems);

const addItems=(req,res,next)=>{

}


