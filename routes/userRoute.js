const express=require('express');
const router=express.Router();
const userController=require('../model/userController')
const mulForm=require('./files')
const checkAuth=require('../middleWare/checkToken')

router.post('/signup',mulForm.single(), userController.singupUser);
router.post('/login',userController.login);
router.post ('/test',userController.test);
router.use(checkAuth)
router.get('/getuser',userController.getUser);
router.put('/update', userController.updateUser);
module.exports=router;
