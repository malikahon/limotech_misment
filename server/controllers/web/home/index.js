// import the service class
const fleet_service = require('../../../services/fleet')

// these are the different pages we'll have, and we're showing how to get there via the file path
const home_controller = {
    // this is the main landing page with the dataset
    index: async (req, res) =>{
        res.render('home');
    },
    // this is for the add form
    add: async (req, res) =>{
        res.render('home/add_update', { mode: 'Add' });
    },
    // this is for the update form
    update: async (req, res) =>{
        const fleetData = await fleet_service.getById(req.params.id);
        res.render('home/add_update', { mode: 'Update', fleetData: fleetData });
    }
};

module.exports = home_controller;