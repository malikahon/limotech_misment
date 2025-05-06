const { body, param } = require('express-validator');
const fleet_service = require('../../services/fleet')

// this is for validation of inputs in the form
const addFleetValidation = () => {
    return [
        // this checks the car name isn't empty and 4-200 characters
        body('carName')
            .notEmpty().withMessage('Car name cannot be empty.')
            .isLength({ min: 4, max: 200 }).withMessage('Car name must be between 4-200 characters long.'),
        
        body('productionDate')
            .notEmpty().withMessage('Production date time must not be empty')
            .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d\s([01][0-9]|2[0-3]):([0-5][0-9])$/, 'g')
            .withMessage('Invalid date and time format. Please use "DD/MM/YYYY HH:mm" format.'),
        body('carType')
            .notEmpty().withMessage('Car Type cannot be empty.'),
        body('contactPhone')
            .notEmpty().withMessage('Contact phone cannnot be empty.')
            .matches(/^\+998\d{9}$/).withMessage('Invalid phone number format, it must be +998xxxxxxxxx'),
        body('carMiles')
            .notEmpty().withMessage('Car Miles cannot be empty'),
    ];
};

const deleteFleetValidation = () => {
    return [
        param('id').custom(async (id) => {
            const exists = await fleet_service.getById(id);
            if (!exists) {
                throw new Error('Fleet item not found');
            }
        })
    ];
};

const updateFleetValidation = () => {
    return [
        param('id').custom(async (id) => {
            const exists = await fleet_service.getById(id);
            if (!exists) {
                throw new Error('Fleet item could not be found.');
            }
        }),
        body('carName')
            .notEmpty().withMessage('Car name cannot be empty.')
            .isLength({ min: 4, max: 200 }).withMessage('Car name has to be between 4-200 characters long.'),
        body('productionDate')
            .notEmpty().withMessage('Production date time cannot be empty.')
            .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d\s([01][0-9]|2[0-3]):([0-5][0-9])$/, 'g')
            .withMessage('Invalid date and time format. Please use "DD/MM/YYYY HH:mm" format.'),
        body('carType')
            .notEmpty().withMessage('Car type cannot be empty.'),
        body('contactPhone')
            .notEmpty().withMessage('Contact phone # must not be empty')
            .matches(/^\+998\d{9}$/).withMessage('Invalid phone number format, it must be +998xxxxxxxxx'),
        body('carMiles')
            .notEmpty().withMessage('Car Miles cannot be empty'),
    ];
};

module.exports = {
    addFleetValidation,
    updateFleetValidation,
    deleteFleetValidation
};