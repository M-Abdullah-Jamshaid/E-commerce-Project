const express = require('express')
const router = express.Router();
const {getProducts,getProductById,deleteProduct,createProduct,updateProduct} = require('../controllers/productController');
const {protect,hasAdminAuthority} = require('../middleware/authMiddleware')

router.get('/',getProducts);
router.get('/:id',getProductById);
router.delete('/:id',protect,hasAdminAuthority,deleteProduct)
router.post('/',protect,hasAdminAuthority,createProduct);
router.put('/:id',protect,hasAdminAuthority,updateProduct);
module.exports = router;