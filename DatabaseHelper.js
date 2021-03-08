const mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "rares",
    password: "yourpassword"
});

export const runSelectQuery = (selectQuery, callback) => {
    con.connect((err) => {
        if (err)
            throw err
        con.query(selectQuery, (err, result, fields) => {
            if (err)
                throw err
            // console.log(result);
            callback(result)
        });
    });
}
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});


