const router = require('./Router')


router.setRouteAction('GET', '/users/all', (res, params) => {
    res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'})
    const debugObj = {
        users: [
            {
                id: 1,
                notesNo: 3
            },
            {
                id: 1,
                notesNo: 3
            }
        ]
    }
    res.end(JSON.stringify(debugObj))
})
const init = () => {
    router.updateAllRoutes()
    router.setRouteAction('GET', '/', (res) => {
        res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'})
        res.end(JSON.stringify(router.everyRoute))
    })
}
module.exports = {
    init : init
}