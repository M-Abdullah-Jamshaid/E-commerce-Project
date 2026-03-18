const { log } = require('node:console')
const Product = require('../models/Product')

const getProducts = async (req,res)=>{
    try{
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};
        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize*(page-1));
        res.json({products,page,pages:Math.ceil(count/pageSize)});
    }catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}
const getProductById = async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message: 'Product not found'});
        }

    }catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}
const deleteProduct = async (req,res)=>{
    try{
        const deletedProduct = await Product.deleteOne({ _id: req.params.id });
        if(deletedProduct){
            res.json(deletedProduct);
        }else{
            res.status(404).json({message: 'Product not found'});
        }
    }   
    catch(e){
        console.error(e);
        res.status(404).json('Bad request Product not found');
    }
}
const createProduct = async (req,res)=>{
    try{
        const {
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
        } = req.body;
        const product = new Product({
            name: name||'Sample Name',
            price: price||0,
            user: req.user._id,
            image: image||'/images/sample.jpg',
            brand: brand||'Sample Brand',
            category: category||'Sample Category',
            countInStock: countInStock||0,
            numReviews: 0,
            description: description||'Sample description',
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    }catch(e){
        console.error(e);
        res.status(500).json({message:'Server Error '});
    }
}
const updateProduct = async (req,res)=>{
        try {
        const {
            name,
            price,
            description,
            image,
            brand,
            category,
            countInStock,
        } = req.body;
        const product = await Product.findById(req.params.id);
        if(product){
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }else {
            res.status(404).json({ message: 'Product not found' });
        }

    }catch(e){
        console.error(e);
        res.status(500).json({message:'Server error'});
    }
}
module.exports = {getProducts,getProductById,deleteProduct,createProduct,updateProduct}