const mongoose= require('mongoose');
const Campground=require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


mongoose.connect( 'mongodb://localhost:27017/YelpCamp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection:error'));
db.once('open',()=>{
    console.log('database connected');
});

const sample= array => array[Math.floor(Math.random()*array.length)]

const seedDB=async()=>{
    await Campground.deleteMany({});
    for (let i = 0;i<=75;i++ ){
        const random400=Math.floor(Math.random()*400);
        const price=Math.floor(Math.random()*5000)+1000;
        const camp= new Campground({
            author:'62bebce89f932e041a1dace4',
            location:`${cities[random400].city}, ${cities[random400].admin_name}`,
            geometry:{
              type:'Point',
              coordinates:[
                cities[random400].lng,
                cities[random400].lat
              ]
            },
            title:`${sample(descriptors)} ${sample(places)}`,
            images: [
              {
                url: 'https://res.cloudinary.com/dos5rufp3/image/upload/v1656659328/CampFinder/bzi5qj8hds79euvawhxg.jpg',
                filename: 'CampFinder/bzi5qj8hds79euvawhxg'
               
              },
              {
                url: 'https://res.cloudinary.com/dos5rufp3/image/upload/v1656659330/CampFinder/yxf9zhqouizaom3hxhyh.jpg',
                filename: 'CampFinder/yxf9zhqouizaom3hxhyh'
               
              },
              {
                url: 'https://res.cloudinary.com/dos5rufp3/image/upload/v1656659332/CampFinder/iptwmfyzbvuz8gq5cvvw.jpg',
                filename: 'CampFinder/iptwmfyzbvuz8gq5cvvw'
             
              },
              {
                url: 'https://res.cloudinary.com/dos5rufp3/image/upload/v1656659334/CampFinder/fmbacfyhqxqljz1nckmg.jpg',
                filename: 'CampFinder/fmbacfyhqxqljz1nckmg'
               
              },
              {
                url: 'https://res.cloudinary.com/dos5rufp3/image/upload/v1656659338/CampFinder/wszmbbq5m25atycjoo9s.jpg',
                filename: 'CampFinder/wszmbbq5m25atycjoo9s'
               
              }
            ],
            description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias facilis amet non fugiat eligendi voluptas?',
            price  
        })
        await camp.save();    


    }
}

seedDB().then(()=>{
    db.close();
})