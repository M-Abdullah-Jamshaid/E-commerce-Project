const { register } = require('node:module');
const User = require('../models/User')
const generateToken = require('../utils/generateToken')

const authUser = async (req,res)=>{
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email});
        if(user && (await user.matchPassword(password))){
            res.json({
                _id:user._id,
                name: user.name,
                email: user.email,
                isAdmin : user.isAdmin,
                token : generateToken(user._id),
            })
        }
        else{
            res.status(401).json({message:'Invalid email or password'});
        }
    }catch(e){
        console.error(e);
        res.status(500).json({message:'Server Error'});
    }
}
const registerUser = async(req,res)=>{
    try{
        const{name,email,password} = req.body;
        const userForReg = await User.findOne({email});
        if(userForReg){
            res.status(400).json({message:'User already exists'});
        }else{
            const user = await User.create({name,email,password});
            if(user){
                res.status(201).json({_id:user._id,
                name: user.name,
                email: user.email,
                isAdmin : user.isAdmin,
                token : generateToken(user._id),})
            }
            else{
                res.status(400).json({message:'Invalid user data'});
            }
        }

    }catch(e){
        console.error(e);
        res.status(500).json({message:'Server Error'});
    }
};
const getUserProfile = async (req,res)=>{
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
    }
    res.json(user);
}
module.exports = {authUser,registerUser,getUserProfile}