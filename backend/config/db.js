const mysql = require("mysql2");

const connection = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "Deepakpandey@@@123",

    database: "projectforge"

});

connection.connect((err) => {

    if (err) {

        console.log("Database Connection Failed");
        console.log(err);

        return;

    }

    console.log("MySQL Connected");

});

module.exports = connection;