// 
const express = require('express')
const fleet_router = require('./fleet')

const router = express.Router()

// registering the child routers
router.use('/fleet', fleet_router)
module.exports = router