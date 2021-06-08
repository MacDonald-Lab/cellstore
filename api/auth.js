import express from 'express'

import passport from 'passport'
import passportLocalSequelize from 'passport-local-sequelize'

import checkLogin from './checkLogin.js'

const authRoutes = (sequelize, app) => {

  // create router function
  const router = express.Router()

  // setup users table
  // TODO move to other model initalization
  const User = passportLocalSequelize.defineUser(sequelize)
  sequelize.sync()

  // initialize passport
  app.use(passport.initialize())
  app.use(passport.session())

  // setup passport local strategy
  passport.use(User.createStrategy())

  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())

  // login route
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return res.status(406).send(err)
      if (info) return res.status(406).send(info)

      req.login(user, err => {
        if (err) return res.status(406).send(err)
        else return res.status(200).send()
      })
    })(req, res, next)
  })

  // logout route
  router.get('/logout', checkLogin, (req, res) => {
    req.logOut()
    res.status(200).send()
  })

  // register route
  // TODO limit registration
  router.post('/register', async (req, res) => {
    await User.register(req.body.username, req.body.password, (err) => {
      if (err) return res.status(406).send({ message: err.message })
      else return res.status(200).send()
    })
  })

  router.get('/user', checkLogin, async (req, res) => {
    if (req.user) return res.send(req.user)
    else return res.status(404).send()
  })

  return router
}

export default authRoutes