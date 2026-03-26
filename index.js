require('dotenv').config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride= require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo').default;
const session = require("express-session");
const connectDB = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 5000;



app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));


app.use(session({
    secret: 'nyan cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: process.env.MONGODB_URI}),
    cookie:{maxAge: new Date(Date.now()+(3600000))}
}));



app.use(express.static('public'));

//Templating Engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');


app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));



//connect to DB
connectDB().then(
    app.listen(PORT, ()=>{
        console.log(`App listening on port ${PORT}`)
    }
));



