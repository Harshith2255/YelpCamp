const express=require('express');
const router=express.Router({mergeParams:true});
const {isLoggedin,ValidateReview,isReviewAuthor} =require('../middleware')
const Campground = require('../models/campground');
const Review=require('../models/review');
const reviewsController=require('../controllers/reviews')

const {campgroundJOISchema,reviewJOISchema}=require('../JoiSchemas.js')


const ExpressError = require('../utils/ExpressError');
const catchAsync=require('../utils/cathAsync')



router.post('/',isLoggedin,ValidateReview,catchAsync(reviewsController.createReview))

router.delete('/:reviewId',isLoggedin,isReviewAuthor,catchAsync(reviewsController.deleteReview))

module.exports=router