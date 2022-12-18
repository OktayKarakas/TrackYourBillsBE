const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Please authenticate.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
    }
    next()
  } catch {
    return res.status(401).send({ error: 'Please authenticate catch.' })
  }
}

module.exports = auth
