const fs = require('fs')

// access our fleet database
const fleets = require(global.fleet_db)

// methods
const fleet_service = {
    // this is to get all fleet items
    getAll() {
        return fleets
    },
    // this is getting by a certain ID - we need this for update & delete
    getById(id) {
        return fleets.find(t => t.id == id)
    },
    // this is for creation - aka add
    create(req, res) {
        // this generates a random ID for the fleet item
        let new_id = genRandId(4)
        
        const fleet = req.body

        const new_fleet = {
            id: new_id,
            fleet: fleet
        }

        fleets.push(new_fleet)
        
        writeToFile(fleets)
        
        return new_fleet
    },
    // this is for updating
    update(id, updateData){
        // this gets the fleet item with that speciifc ID to update
        const fleetIndex = fleets.findIndex(t => t.id == id)
        
        // gives error if that fleet item was deleted or doesn't exist
        if (fleetIndex === -1) {
            return null
        }

        fleets[fleetIndex].fleet = { ...fleets[fleetIndex].fleet, ...updateData }

        writeToFile(fleets)

        return fleets[fleetIndex]
    },
    // deletes the fleet item
    delete(id) {
        // this gets the ID of the fleet item
        const index = fleets.findIndex(u => u.id == id)
        // before removing it
        fleets.splice(index, 1)
        writeToFile(fleets)
    }
}

// this function overwrites our fleet_db 
let writeToFile = async (users) => {
    await 
        fs.writeFileSync(
            global.fleet_db,
            JSON.stringify(
                users, null, 4
            ),
            'utf8'
        )
}

// this creates a random ID out of numbers
let genRandId = (count) =>{
    let result = ''
    const nums = '0123456789'
    const numsLength = nums.length
    for (let i = 0; i < count; i++) {
        result += nums.charAt(Math.floor(Math.random() * numsLength))
    }
    return result
}

module.exports = fleet_service