const express=require('express');
const router=express.Router();
const passport=require('passport');
const { isLoggedin } = require('../middleware');
const User=require('../models/user');
const catchAsync = require('../utils/cathAsync');
const userController=require('../controllers/users')

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.register))

router.route('/login') 
    .get(userController.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,
        failureRedirect:'/login'}),userController.login)

 
router.get('/logout',userController.logout)




module.exports=router;