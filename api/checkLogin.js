  const checkLogin = (req, res, next) => {
    if (!req.user) return res.status(401).send()
    else return next()
  }

  export default checkLogin