const Bill = require('../models/Bill')
const mongoose = require('mongoose')
const moment = require('moment')
const getAllBills = async (req, res) => {
  const { search, status, sort } = req.query
  const queryObject = {
    createdBy: req.user.userId,
  }
  if (search) {
    queryObject.company = { $regex: search, $options: 'i' }
  }
  if (status && status !== 'all') {
    queryObject.status = status
  }

  let result = Bill.find(queryObject)

  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }

  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }

  if (sort === 'a-z') {
    result = result.sort('position')
  }

  if (sort === 'z-a') {
    result = result.sort('-position')
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const bills = await result

  const totalBills = await Job.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalBills / limit)
  res.json({ bills, totalBills, numOfPages })
}

const getBill = async (req, res) => {
  const bill = await Bill.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  })

  if (!bill) {
    return res.status(404).json({ message: 'Job not found' })
  }

  res.json({ bill })
}

const createBill = async (req, res) => {
  req.body.createdBy = req.user.userId //req.user.userId,auth'da oluşturulan user objesinin içindeki userId.
  //(login ve register olurken jwt'de sign atarken aldığımı id'ye verdiğimiz isim ortak olmak zorunda her yerde.).userId ismi de req.user'dan geliyor,middleware auth'da oluşturulan.
  const bill = await Bill.create(req.body)
  res.json({ bill })
}

const updateBill = async (req, res) => {
  const bill = await Bill.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.userId,
    }, //filter
    req.body, // ne update olucak ? değeri.
    { new: true, runValidators: true }, //options'lar
  )
  if (!bill) {
    return res.status(404).json({ message: 'Job not found' })
  }

  res.json({ bill })
}

const deleteBill = async (req, res) => {
  const bill = await Bill.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.userId,
  }) // filter
  if (!bill) {
    return res.status(404).json({ message: 'Job not found' })
  }
  res.json({ bill })
}

const showStats = async (req, res) => {
  let stats = await Bill.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } }, //filter
    { $group: { _id: '$status', count: { $sum: 1 } } }, //group by status
  ])

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    paid: stats.paid || 0,
    canceled: stats.canceled || 0,
  }

  res.json({ defaultStats })
}

//'paid', 'canceled', 'pending'

module.exports = {
  getAllBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
  showStats,
}
