const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '83463901Gl',
  database: 'ufc_store'
})

module.exports = pool