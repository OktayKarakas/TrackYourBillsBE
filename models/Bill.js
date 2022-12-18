const mongoose = require('mongoose')
const BillSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      maxlength: 50,
    },
    totalBill: {
      type: Number,
      required: [true, 'Please provide a totalBill'],
    },
    status: {
      type: String,
      enum: ['paid', 'canceled', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId, // This is the connection to the model
      ref: 'User', // This is the name of the model which will specify the connection model name.Referans alıcağı model'in adı.
      required: [true, 'Please provide a user id'],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Bills', BillSchema)
