// express web app instance
const express = require('express')

// parse request body to json
const body_parser = require('body-parser')

// for File IO
const path = require('path')

// make mock database (raw .json file) available globally in app
global.fleet_db = path.join(__dirname, './data/fleet_db.json');

const web_route = require('./routes/web')
const api_route = require('./routes/api');
const cors = require('cors')

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        // credentials: true,
    })
);

app.use('/css', express.static('public/css'))
app.use('/js', express.static('public/js'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api_route); // API routes
app.use('/', web_route); // web routes

// redirect to home page if unknown requests requested
app.use((req, res) => {
    res.redirect('/');
});

const port = 3000;
app.listen(port, () => console.log(`Server running`));