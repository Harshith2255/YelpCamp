const {campgroundJOISchema,reviewJOISchema}=require('./JoiSchemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review=require('./models/review')



module.exports.isLoggedin = (req,res,next) =>{ 
    if (!req.isAuthenticated()){
    req.session.returnTo=req.originalUrl    
    req.flash('error','you must be signed in');
    return res.redirect('/login')
}
    next();
}

module.exports.ValidateCampground=(req,res,next)=>{
    
    const {error} = campgroundJOISchema.validate(req.body)
    if (error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

module.exports.isAuthor=async (req,res,next)=>{
    const {id}=req.params
    const campground= await Campground.findById(id)
    if(!(req.user.equals(campground.author))){
        req.flash('error','you do not have permission to do that ')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    const {id,reviewId}=req.params;
    const review= await Review.findById(reviewId)
    if(!(req.user.equals(review.author))){
        req.flash('error','you do not have permission to do that ')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.ValidateReview = (req,res,next)=>{
    const {error}=reviewJOISchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }    
}
