import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

import bcrypt from 'bcrypt'
import passport from 'passport'
import flash from 'express-flash'
import session from 'express-session'
import methodOverride from 'method-override'
import passportLocal from 'passport-local'

const LocalStrategy = passportLocal.Strategy
//import cookieParser from 'cookie-parser'
//import session from 'express-session'
//import connectMultiparty from 'connect-multiparty'
//import User from './user.js'

initialize(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

//only in memory, so we'll want to put this into our database
const users = []


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
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  //we'll want to change this passcode in order to make it safer 
  secret: 'super_secret_passcode',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('authIndex.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

//This is the configuration function
function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}


app.listen(4000)