const http = require('http')
const router = require('./Router')
const routesDefinitions = require('./routesDefinitions')

const PORT = 5000

routesDefinitions.init()

http.createServer((req, res) => {

    let reqObj = router.requestProcessing(req);

    const requestHandler = router.getRouteAction(reqObj.method, reqObj.path);

    if (false === router.isHttpVerbAvailable(reqObj.method)) {
        router.MethodNotAllowed(res, reqObj.method)
        return
    }
    if (undefined === requestHandler) {
        router.NotImplemented(req, res)
        return;
    }
    requestHandler(res, reqObj.params)
}).listen(PORT)

console.log(`Listening on port ${PORT} ...`)