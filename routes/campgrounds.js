const express = require('express');
const router = express.Router();
const catchAsync=require('../utils/cathAsync')
const Campground = require('../models/campground');
const review = require('../models/review');
const campgroundsController=require('../controllers/campgrounds')
const {isLoggedin,ValidateCampground,isAuthor}=require('../middleware')
const multer  = require('multer')
const {storage} =require('../cloudinary/index')
const upload = multer({ storage })


router.route('/')
    .get(catchAsync(campgroundsController.index))
    .post(isLoggedin,upload.array('image'),ValidateCampground,catchAsync(campgroundsController.createCampground))



router.get('/new',isLoggedin,campgroundsController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundsController.showCampground))
    .put(isLoggedin,isAuthor,upload.array('image'),ValidateCampground,catchAsync(campgroundsController.updateCampground ))
    .delete(isLoggedin,isAuthor,catchAsync(campgroundsController.deleteCampground ))

router.get('/:id/edit',isLoggedin,isAuthor,catchAsync(campgroundsController.renderEditForm))



module.exports =router