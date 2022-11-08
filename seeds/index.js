const mongoose = require('mongoose');
const cities = require('./indian_cities');
const { places, descriptors } = require('./seedHelpers');
const Care_center = require('../models/care_center');
require('dotenv').config();
const db_url = process.env.DB_URL;

mongoose.connect(db_url,
    (err) => {
        if (err) console.log(err)
        else console.log("mongdb is connected");
    });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Care_center.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 300);
        const price = Math.floor(Math.random() * 20) + 10;
        const care_center = new Care_center({
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] },
            owner: '636a06f5be1ea72f92229099',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dnjnlgovb/image/upload/v1667732710/care_center/q6wghzycvlosgkglknyb.jpg',
                    filename: 'care_center/j5dwd7a5mroa2dfxiy1y',
                },
                {
                    url: 'https://res.cloudinary.com/dnjnlgovb/image/upload/v1667732951/care_center/xzbuugotmze8gbco8woq.jpg',
                    filename: 'care_center/cbj1zdw2zuersg1sirql',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await care_center.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})