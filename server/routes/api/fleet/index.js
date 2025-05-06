// validation
const express = require('express');
const { validationResult } = require('express-validator');
const { addFleetValidation, updateFleetValidation, deleteFleetValidation } = require('../../../validators/fleet');

const router = express.Router();
const fleet_controller = require('../../../controllers/api/fleet');

// defining our API routes
router.get('/', (req, res)=>{
    fleet_controller.getAll(req, res);
});

// definition for add
router.post('/', addFleetValidation(), (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    fleet_controller.create(req, res)
})

// definition for update
router.put('/:id', updateFleetValidation(), (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    fleet_controller.update(req, res)
})

// definition for delte
router.delete('/:id', deleteFleetValidation(), (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    fleet_controller.delete(req, res)
})

module.exports = router;