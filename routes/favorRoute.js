const express=require('express')
const favorRouter=express.Router()
const checkAuth=require('../middleWare/checkToken')
const favorController=require('../model/favorController')

favorRouter.use(checkAuth)
favorRouter.post('/add_to_favor', favorController.addToFavor)
favorRouter.post('/remove_from_favor',favorController.removeFromFavor)
favorRouter.post('/get_favor_list', favorController.getFavorList)

module.exports=favorRouter