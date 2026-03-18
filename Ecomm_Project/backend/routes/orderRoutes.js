const express = require('express')
const {addOrderItems,getOrderById,getMyOrders,updateOrderToPaid} = require('../controllers/orderController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/',protect,addOrderItems);
router.get('/myorders',protect,getMyOrders);
router.get('/:id',protect,getOrderById);
router.put('/:id/pay',protect,updateOrderToPaid);
module.exports = router;