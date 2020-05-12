const express = require("express");
const app = express();
const fileUpload = require('express-fileupload');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const port = 5000;
const {getHomePage} = require('./routes/index');
const {addBookingPage, addBooking, deleteBooking, editBooking, editBookingPage} = require('./routes/booking');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "tourscompany",
    port: 8889,
    });
    // Connect to MySQL Database
    db.connect((err) => {
    if (err) {
    throw err;
    }
    console.log("Connected to tourscompany DB Successfully");
    });
    
global.db = db;
app.set('port', process.env.port || port); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.get('/', getHomePage);
app.get('/add', addBookingPage);
app.get('/edit/:id', editBookingPage);
app.get('/delete/:id', deleteBooking);
app.post('/add', addBooking);
app.post('/edit/:id', editBooking);
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});