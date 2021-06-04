import dotenv from 'dotenv'
dotenv.config()

import express from 'express'

import passport from 'passport'
import flash from 'express-flash'
import session from 'express-session'
// import {LocalStrategy} from 'passport-local'
import passportLocalSequelize from 'passport-local-sequelize'
import cors from 'cors'

// initialize(
//   passport,
//   email => users.find(user => user.email === email),
//   id => users.find(user => user.id === id)
// )

// //only in memory, so we'll want to put this into our database
// const users = []


// router.set('view-engine', 'ejs')

const AuthFunction = (seq) => {


  const router = express.Router()

  // router.use(express.urlencoded({ extended: false }))
  router.use(express.json())
  router.use(flash())
  // router.use(cors())
  // router.use(session({
  //   //we'll want to change this passcode in order to make it safer 
  //   secret: 'super_secret_passcode',
  //   resave: false,
  //   saveUninitialized: false
  // }))

  const User = passportLocalSequelize.defineUser(seq)
  seq.sync()

  router.use(passport.initialize())
  router.use(passport.session())

  // passport.use(new LocalStrategy(
  //   (username, password, done) => {
  //     U
  //   }
  // ))

  passport.use(User.createStrategy())

  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())


  const checkLogin = (req, res, next) => {
    if (!req.user) return res.status(401).send()
    else return next()
  }

  // router.use(methodOverride('_method'))

  // router.get('/', checkAuthenticated, (req, res) => {
  //   res.render('authIndex.ejs', { name: req.user.name })
  // })

  // router.get('/login', checkNotAuthenticated, (req, res) => {
  //   res.render('login.ejs')
  // })

  // router.post('/login', (req, res, next) => {

  //   passport.authenticate('basic', 
  //     (err, user, info) => {
  //       if (err) return next(err)
  //       if (!user) return next(info)

  //       req.logIn(user, (err) => {
  //         if (err) return next(err)

  //         return res.redirect
  //       })  
  //     }
  //   ) (req, res, next)

  // }


  // )

  // router.post('/login', passport.authenticate('basic'), (req, res) => {
  //   console.log(req.user)
  //   next()
  // }
  // )


  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return res.status(406).send(err)
      if (info) return res.status(406).send(info)

      req.login(user, err => {
        if (err) return res.status(406).send(err)
        else return res.status(200).send()
      })
    }) (req, res, next)
  })

  router.post('/logout', checkLogin, (req, res) => {
    req.logOut()
    res.status(200).send()
  })

  router.post('/register', async (req, res) => {
    await User.register(req.body.username, req.body.password, (err) => {
      if (err) return res.status(406).send({ message: err.message })
      else return res.status(200).send()
    })
  })


  // router.post('/login', (req, res, next) => {

  //   passport.authenticate('local', (err, user, info) => {
  //     if (err) return next(err)

  //     if (!user) return res.status(404).send('no user')

  //     req.logIn(user, (err) => {
  //       if (err) return next(err)
  //       return res.status.send(200)

  //     })
  //   }) (req, res, next)

  // })

  // router.get('/register', checkNotAuthenticated, (req, res) => {
  //   res.render('register.ejs')
  // })

  // router.post('/register', async (req, res) => {
  //   try {
  //     const hashedPassword = await bcrypt.hash(req.body.password, 10)
  //     users.push({
  //       id: Date.now().toString(),
  //       name: req.body.name,
  //       email: req.body.email,
  //       password: hashedPassword
  //     })
  //     res.status(200).send()
  //   } catch (err) {
  //     res.status(500).send()
  //   }
  // })

  // router.delete('/logout', (req, res) => {
  //   req.logOut()
  //   res.redirect('/login')
  // })

  // function checkAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return next()
  //   }

  //   res.redirect('/login')
  // }

  // function checkNotAuthenticated(req, res, next) {
  //   if (req.isAuthenticated()) {
  //     return res.redirect('/')
  //   }
  //   next()
  // }

  //This is the configuration function
  // function initialize(passport, getUserByEmail, getUserById) {
  //   const authenticateUser = async (email, password, done) => {

  //     const user = getUserByEmail(email)
  //     if (user == null) {
  //       return done(null, false, { message: 'No user with that email' })
  //     }

  //     try {
  //       if (await bcrypt.compare(password, user.password)) {
  //         return done(null, user)
  //       } else {
  //         return done(null, false, { message: 'Password incorrect' })
  //       }
  //     } catch (e) {
  //       return done(e)
  //     }
  //   }

  //   passport.use(new BasicStrategy({ usernameField: 'email' }, authenticateUser))
  //   passport.serializeUser((user, done) => done(null, user.id))
  //   passport.deserializeUser((id, done) => {
  //     return done(null, getUserById(id))
  //   })
  // }

  return router

}
export default AuthFunction