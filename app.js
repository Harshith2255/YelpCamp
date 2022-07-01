if (process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}

const express =require('express');
const path=require('path');
const mongoose= require('mongoose');
const ejsMate=require('ejs-mate');
const session =require('express-session')
const methodOverride=require('method-override');
const ExpressError = require('./utils/ExpressError');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local')
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

const userRouter=require('./routes/users');
const campgroundsRouter= require('./routes/campgrounds');
const reviewsRouter=require('./routes/reviews');


const dburl = process.env.db_url || 'mongodb://localhost:27017/YelpCamp'


mongoose.connect(dburl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection:error'));
db.once('open',()=>{
    console.log('database connected');
});

const app=express();

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
 
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());

const secret= process.env.SECRET ||'thisshouldbeasecret'

const store = new MongoStore({
     mongoUrl:dburl,
     secret:secret,
     touchAfter:24*3600
});

store.on('error',function(e){
    console.log('session store error',e)
})

const sessionConfig={
    store,
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next(); 
})



app.get('/',(req,res)=>{
    res.render('home')
})

app.use('/',userRouter);
app.use('/campgrounds',campgroundsRouter);
//merge params to be used here becaus of id `
app.use('/campgrounds/:id/reviews',reviewsRouter); 

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err
    if(!err.message) err.message='Oh No,Something Wet Wrong!'
    res.status(statusCode).render('error',{err})
})

const port =process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`serving on port ${port}`)
}) 