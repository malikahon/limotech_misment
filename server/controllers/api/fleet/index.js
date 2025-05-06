// import the service class
const fleet_service = require('../../../services/fleet')

// methods for create, update, delete
const fleet_controller = {
    // we'll need this when we load the main page (to show all the current fleet items)
    getAll(req, res) {
        res.json(fleet_service.getAll())
    },
    // this is for the add button, so we can add a fleet item
    create(req, res) {
        res.status(201).json(
            fleet_service.create(req, res)
        )
    },
    // this is so we can update current fleet items
    update(req, res) {
        const fleet = fleet_service.update(req.params.id, req.body)

        if (fleet) {
            res.json(fleet)
        } 
        else {
            res.status(404).send('Fleet item is not found.')
        }
    },
    // this will delete fleet items via their unique ID
    delete(req, res) {
        const fleet = fleet_service.getById(req.params.id)

        if (fleet) {
            fleet_service.delete(req.params.id)
            res.status(204).send('Fleet item was deleted.')
        } 
        else {
            res.status(404).send('Fleet item could not be found.')
        }
    }
}

module.exports = fleet_controller
