let mysql = require('mysql')

function Db() {
    this.pool = null
    this.init = () => {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: 'mysql',
            database: 'todo'
        })
    }

    this.acquire = (callback) => {
        this.pool.getConnection((err, connection) => {
            callback(err, connection)
        })
    }
}

module.exports = new Db()