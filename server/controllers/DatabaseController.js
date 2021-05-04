const databaseConnection = require('../config/db');
const mysql = require('mysql2/promise');

class Database {

    constructor(table) {
        this.connection = databaseConnection()
        this.table = table;
    }

    async findAll(columns) {

        let query = "";
        for(var col in columns) {
            query += `${col} = '${columns[col]}' AND `;
        }

        console.log(`SELECT * FROM ${this.table} WHERE ${query.trimEnd().slice(0, -3)}`)

        const conn = await this.connection;
        const [rows, fields] = await conn.query(`SELECT * FROM ${this.table} WHERE ${query.trimEnd().slice(0, -3)}`);
        return rows;
    }

    async findOne(columns) {
        let optionsString = "";
        for(var col in columns) {
            optionsString += `${col} = '${columns[col]}' AND `;
        }

        const conn = await this.connection;
        const [rows, fields] = await conn.query(`SELECT * from ${this.table} WHERE ${optionsString.trimEnd().slice(0, -3)}`);
        return rows;
    }

    async findOneById(id, field, join) {
        const conn = await this.connection;
        const [rows, fields] = await conn.query(`SELECT * FROM ${this.table} WHERE ${field.name} = '${field.id}' AND ${join} = ${id}`);
        return rows;
    }

    async findByRange(columns) {
        let optionsString = "";
        for(var col in columns.options) {
            optionsString += `'${columns.options[col]}' AND `;
        }

        const conn = await this.connection;
        const [rows, fields] = await conn.query(`SELECT * FROM ${this.table} WHERE ${columns.field} BETWEEN ${optionsString.trimEnd().slice(0, -3)}`);
        return rows;
    }

    async create(columns) {
        const conn = await this.connection;
        const [rows, fields] = await conn.query(`INSERT INTO ${this.table} SET ?`, columns);
        return rows;
    }

    async update(columns) {
        let setString = "";
        let optionsString = "";
        for(var col in columns.set) {
            setString += `${col} = '${columns.set[col]}' , `;
        }

        for(var col in columns.options) {
            optionsString += `${col} = '${columns.options[col]}' AND `;
        }

        const conn = await this.connection;
        const [rows, fields] = await conn.query(`UPDATE ${this.table} SET ${setString.trimEnd().slice(0, -1)} WHERE ${optionsString.trimEnd().slice(0, -3)}`);
        return rows;
    }

    async delete(columns) {
        let query = "";
        for(var col in columns) {
            query += `${col} = '${columns[col]}' AND `;
        }
        const conn = await this.connection;
        const [rows, fields] = await conn.query(`DELETE FROM ${this.table} WHERE ${query.trimEnd().slice(0, -3)}`);
        return rows;
    }

}

module.exports = Database;