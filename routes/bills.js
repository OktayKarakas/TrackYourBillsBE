const express = require('express')
const router = express.Router()
const {
  getAllBills,
  getBill,
  createBill,
  updateBill,
  deleteBill,
  showStats,
} = require('../controllers/bills')

router.get('/', getAllBills)
router.post('/', createBill)
router.get('/stats', showStats)
router.get('/:id', getBill)
router.patch('/:id', updateBill)
router.delete('/:id', deleteBill)

module.exports = router
