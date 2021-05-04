const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({path: "./config.env"});

const connection = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "trackify"
    });
}


module.exports = connection;