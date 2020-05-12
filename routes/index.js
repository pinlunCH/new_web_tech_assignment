module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `booking` ORDER BY id ASC";

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to tours booking system | View booking",
                booking: result
            });
        });
    },
};