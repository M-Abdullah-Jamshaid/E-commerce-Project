const express = require('express')
const router = express.Router()
const {chatWithAi} = require('../controllers/chatController')

router.post('/',chatWithAi);
module.exports = chatWithAi;