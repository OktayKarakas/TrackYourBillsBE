const express = require('express')
const router = express.Router()
const { login, register, updateUser } = require('../controllers/auth')
const rateLimiter = require('express-rate-limit')

const auth = require('../middleware/authentication')
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 100 requests per windowMs
  message:
    'Too many accounts created from this IP, please try again after an hour',
})

router.post('/register', apiLimiter, register)
router.post('/login', apiLimiter, login)
router.patch('/updateUser', auth, updateUser)
module.exports = router
