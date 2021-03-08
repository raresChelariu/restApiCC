const url = require('url')
const querystring = require('querystring')

const responseHeaders = {
    'JSON': {'Content-Type': 'application/json; charset=UTF-8'},
    'PLAIN': {'Content-Type': 'text/plain; charset=UTF-8'}
}
const requestProcessing = (req) => {
    let parsedUrl = url.parse(req.url);
    return {
        parsedUrl : url.parse(req.url),
        method : req.method,
        params : querystring.parse(parsedUrl.query),
        path : parsedUrl.pathname
    }
}
const router = {}
var everyRoute
const httpVerbs = ['GET', 'POST', 'PUT', 'DELETE']
httpVerbs.forEach(method => {
    router[method] = {}
})
const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
const isHttpVerbAvailable = (method) => {
    return httpVerbs.includes(method)
}
const setRouteAction = (httpVerb, path, action) => {
    httpVerb = httpVerb.toUpperCase()
    router[httpVerb][path] = action
}
const getRouteAction = (httpVerb, path) => {
    return router[httpVerb][path]
}
const allRoutes = () => {
    let obj = {
        path: '',
        httpVerb: ''
    };
    everyRoute = []
    for (const [httpVerb, routes] of Object.entries(router)) {
        obj.httpVerb = httpVerb
        for (const [path, action] of Object.entries(routes)) {
            obj.path = path
            everyRoute.push(obj)
        }
    }
}
const isActionDefined = (method, path) => {
    return path in router[method];
}

const MethodNotAllowed = (req, serverResponse) => {
    serverResponse.writeHead(405, responseHeaders.JSON)
    serverResponse.end({'error': `Http method ${req.method} is not allowed`})
}
const NotImplemented = (req, serverResponse) => {
    serverResponse.writeHead(501, responseHeaders.JSON);
    const reqObj = requestProcessing(req)
    const resultObj = {'error': `No action implemented for given route with method ${reqObj.method} and path ${reqObj.path}`};
    serverResponse.end(JSON.stringify(resultObj))
}
module.exports = {
    isHttpVerbAvailable : isHttpVerbAvailable,
    setRouteAction : setRouteAction,
    getRouteAction : getRouteAction,
    isActionDefined : isActionDefined,
    R : router,
    isFunction : isFunction,
    NotImplemented : NotImplemented,
    MethodNotAllowed : MethodNotAllowed,
    requestProcessing : requestProcessing,
    everyRoute : everyRoute,
    updateAllRoutes : allRoutes
}