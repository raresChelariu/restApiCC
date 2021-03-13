const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    database : 'appusers',
    user:'root',
    password: 'rares123',
    connectionLimit: 5
});


const executeSelectQuery = (selectQuery, callback) => {
    pool.getConnection().then( (conn) => {
        conn.query(selectQuery).then( (rows) => {
            callback(rows)
        }).catch( (err) => {
            console.error(err)
        })
    })
}
const executeDMLQuery =  (query) => {
    pool.getConnection().then( async (conn) => {
        const res = await conn.query(query)


    })
}
module.exports = {
    executeSelectQuery : executeSelectQuery,
    executeDMLQuery : executeDMLQuery
}