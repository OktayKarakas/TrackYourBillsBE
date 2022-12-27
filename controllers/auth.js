const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }
  const salt = await bcrypt.genSalt(10)
  const hashPass = await bcrypt.hash(password, salt)
  const user = await User.create({ name, email, password: hashPass })
  const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    },
  )
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      token: token,
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(400).json({ msg: 'User does not exist' })
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  )

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      token: token,
    },
  })
}

const updateUser = async (req, res) => {
  const { email } = req.user
  const user = await User.findOneAndUpdate({ email }, req.body, {
    new: true,
  })
  res.status(200).json({ success: true, data: user })
}

const updateCurrency = async (req, res) => {
  const { currency } = req.user
  const user = await User.findOneAndUpdate({ currency }, req.body, {
    new: true,
  })
  res.status(200).json({ success: true, data: user })
}

module.exports = {
  updateUser,
  register,
  login,
  updateCurrency,
}
