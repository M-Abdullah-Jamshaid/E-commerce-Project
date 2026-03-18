const Order = require('../models/Order')

const addOrderItems = async(req,res)=>{
    try{
        const{orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;
        if(orderItems && orderItems.length === 0){
            res.status(400).json({
                message: 'No order items'
            });
            return;
        }
        else{
             const newOrder = new Order({
                orderItems,
                user:req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
            });
            const createdOrder = await newOrder.save();
            res.status(201).json(createdOrder);
        }
    }
    catch(e){
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
}
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        
        res.json(orders);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
};
module.exports = {addOrderItems,getMyOrders,getOrderById,updateOrderToPaid};