if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const care_center_routes = require('./routes/care_centers');
const review_routes = require('./routes/reviews');
const user_routes = require('./routes/users');
const flash = require('connect-flash');
const passport = require('passport');
const local_strategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const ExpressError = require('./utilities/ExpressError');
const { on } = require('events');
const MongoDbStore = require('connect-mongo')(session);
const db_url = process.env.DB_URL || 'mongodb://localhost:27017/elderly_care';
const secret = process.env.SECRET || 'elderlycareproject';

const db = mongoose.connection;
mongoose.connect(db_url);
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const store = new MongoDbStore({
    url: db_url,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function (err) {
    console.log('Session store error', e);
})

const sessionConfig = {
    store,
    name: 'cookieforlogin',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local_strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.current_user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) => {
    res.render('home');
});
app.use('/', user_routes)
app.use('/care_center', care_center_routes);
app.use('/care_center/:id/review', review_routes);


//404 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!res.message) {
        res.message = 'Something went wrong :('
    }
    if (err.statusCode == 400) {
        req.flash('error', err.message);
        res.redirect('back');
    } else {
        res.status(statusCode).render('error', { err });
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});