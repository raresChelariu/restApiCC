const http = require('http')
const router = require('./Router')
const routesDefinitions = require('./routesDefinitions')
_ = require('./DatabaseHelper')
const PORT = 5000

routesDefinitions.init()

http.createServer((req, res) => {
    const requestHandler = router.getRouteAction(req);

    if (false === router.isHttpVerbAvailable(req)) {
        router.MethodNotAllowed(res, req)
        return
    }
    if (undefined === requestHandler) {
        router.NotImplemented(req, res)
        return;
    }
    requestHandler(res, req)

}).listen(PORT)

console.log(`Listening on port ${PORT} ...`)