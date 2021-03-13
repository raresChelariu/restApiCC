const RequestObject = require('./RequestObject')

const responseHeaders = {
    'JSON': {'Content-Type': 'application/json; charset=UTF-8'},
    'PLAIN': {'Content-Type': 'text/plain; charset=UTF-8'}
}

const router = {}
const everyRoute = []
const httpVerbs = ['GET', 'POST', 'PUT', 'DELETE']
httpVerbs.forEach(method => {
    router[method] = {}
})
const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
const isHttpVerbAvailable = (req) => {
    let method = (new RequestObject(req)).method
    return httpVerbs.includes(method)
}
const setRouteAction = (httpVerb, path, action) => {
    httpVerb = httpVerb.toUpperCase()
    router[httpVerb][path] = action
}
const getRouteAction = (req) => {
    let reqObj = new RequestObject(req)

    if (reqObj.path.indexOf(':') === -1)
    {
        let perfectMatch = router[reqObj.method][reqObj.path];
        if (undefined !== perfectMatch)
            return perfectMatch
    }

    // TODO Change to match template pattern with COLON (:)

    for (const [path, action] of Object.entries(router[reqObj.method])) {

        if (PathMatchesRegex(path, reqObj.path))
            return action
    }
    return undefined
}
const PathMatchesRegex = (template, path) => {
    template = template + ''
    let paramRegex = new RegExp(':[A-Za-z]+', 'g')
    let regexString = template.replace(paramRegex, '[0-9]+')
    let regex = new RegExp(regexString)
    return regex.test(path)
}
const allRoutes = () => {

    everyRoute.length = 0
    for (const [currMethod, routes] of Object.entries(router)) {
        for (const [currPath, action] of Object.entries(routes)) {
            let obj = {
                path: currPath,
                httpVerb: currMethod
            };
            everyRoute.push(obj)
        }
    }
}
const isActionDefined = (method, path) => {
    return path in router[method];
}

const MethodNotAllowed = (req, serverResponse) => {
    const reqObj = new RequestObject(req)
    serverResponse.writeHead(405, responseHeaders.JSON)
    serverResponse.end({'error': `Http method ${reqObj.method} is not allowed`})
}
const NotImplemented = (req, serverResponse) => {
    serverResponse.writeHead(501, responseHeaders.JSON);
    const reqObj = new RequestObject(req)
    const resultObj = {'error': `No action implemented for given route with method ${reqObj.method} and path ${reqObj.path}`};
    serverResponse.end(JSON.stringify(resultObj))
}
const extractParams = (templatePath, givenPath) => {
    let templatePathTokens = templatePath.split('/')
    let givenPathTokens = givenPath.split('/')
    if (givenPathTokens.length !== templatePathTokens.length)
        return undefined
    let tokenCount = givenPathTokens.length
    let resultObject = {};
    for (let i = 1; i < tokenCount; i++)
    {
        if (templatePathTokens[i].charAt(0) === ':')
        {
            let paramName = templatePathTokens[i].slice(1)
            let paramValue = givenPathTokens[i]
            if (!isNaN(paramValue))
                paramValue = parseInt(paramValue)
            resultObject[paramName] = paramValue
        }
    }
    return resultObject
}
module.exports = {
    isHttpVerbAvailable: isHttpVerbAvailable,
    setRouteAction: setRouteAction,
    getRouteAction: getRouteAction,
    isActionDefined: isActionDefined,
    R: router,
    isFunction: isFunction,
    NotImplemented: NotImplemented,
    MethodNotAllowed: MethodNotAllowed,
    everyRoute: everyRoute,
    updateAllRoutes: allRoutes,
    extractParams : extractParams
}