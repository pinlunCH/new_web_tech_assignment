const fs = require('fs');

module.exports = {
    addBookingPage: (req, res) => {
        res.render('add-booking.ejs', {
            title: 'Welcome to tours booking system | Add a new booking',
            message: ''
        });
    },
    addBooking: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let destination	 = req.body.destination;//
        let employee = req.body.employee;//
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = employee + '.' + fileExtension;
        let date = req.body.date;

        let usernameQuery = "SELECT * FROM `booking` WHERE employee_name = '" + employee + "'";

        db.query(usernameQuery, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            // check the filetype before uploading it
            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                // upload the file to the /public/assets/img directory
                uploadedFile.mv(`public/assets/imgs/${image_name}`, (err ) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    // send the player's details to the database
                    let query = "INSERT INTO `booking` (first_name, last_name, destination, image, date, employee_name) VALUES ('" +
                        first_name + "', '" + last_name + "', '" + destination + "','" + image_name + "', '" + date + "',  '" + employee + "')";
                    db.query(query, (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/');
                    });
                });
            } else {
                message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                res.render('add-booking.ejs', {
                    message,
                    title: 'Welcome to tours booking system | Add a new booking'
                });
            }
        });
    },
    editBookingPage: (req, res) => {
        let bookingId = req.params.id;
        let query = "SELECT * FROM `booking` WHERE id = '" + bookingId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-booking.ejs', {
                title: 'Edit booking',
                booking: result[0],
                message: ''
            });
        });
    },
    editBooking: (req, res) => {
        let bookingId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let destination = req.body.destination;
        let date = req.body.date;

        let query = "UPDATE `booking` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `destination` = '" + destination + "', `date` = '" + date + "' WHERE `booking`.`id` = '" + bookingId + "'";
        db.query(query, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteBooking: (req, res) => {
        let bookingId = req.params.id;
        let getImageQuery = 'SELECT image from `booking` WHERE id = "' + bookingId + '"';
        let deletebookingrQuery = 'DELETE FROM `booking` WHERE id = "' + bookingId + '"';//

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/imgs/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deletebookingrQuery, (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};