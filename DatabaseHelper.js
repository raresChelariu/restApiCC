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

            conn.end().then(()=>callback(rows))

        }).catch( (err) => {
            console.error('SELECT QUERY ERR : ' + selectQuery)
            console.error(err)
        })
    }).catch((err)=> {
        console.error('GET CONN ERR')
        console.error(err)
    })
}
const executeDMLQuery =  (query) => {

    pool.getConnection().then( async (conn) => {
        const res = await conn.query(query)
        console.log(query + ' ---> ' + res)
        await conn.end()
    }).catch((err) => {
        console.log(err)
    })
}
module.exports = {
    executeSelectQuery : executeSelectQuery,
    executeDMLQuery : executeDMLQuery
}