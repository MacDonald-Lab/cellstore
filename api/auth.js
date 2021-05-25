// import dotenv from 'dotenv';
// dotenv.config()

import express from 'express'
//import passport from 'passport'
//import cookieParser from 'cookie-parser'
//import session from 'express-session'
//import connectMultiparty from 'connect-multiparty'
//import User from './user.js'

const app = express();


// app.use(express.urlencoded({ extended: true }));
// app.use(connectMultiparty());
// app.use(cookieParser());
// app.use(session({
//     secret: 'super-secret',
//     resave: true,
//     saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
   res.render('authIndex.ejs')
})

app.listen(4000)