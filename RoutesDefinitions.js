const router = require('./Router')
const RequestObject = require("./RequestObject");
const db = require('./DatabaseHelper')
const queries = require('./dbQueries')
const qs = require('querystring')

const init = () => {
    router.updateAllRoutes()
    router.setRouteAction('GET', '/', (res) => {
        res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'})
        res.end(JSON.stringify(router.everyRoute))
    })
}

/// GET

router.setRouteAction('GET', '/users/:userId/notes/:noteId', (res, req) => {
    const reqObj = new RequestObject(req)
    const templatePath = '/users/:userId/notes/:noteId'
    const params = router.extractParams(templatePath, reqObj.path)

    res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'})
    res.end(JSON.stringify(params))
})
router.setRouteAction('GET', '/users/all', (res) => {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'})
        db.executeSelectQuery(queries.Q_SELECT_USERS_ALL, (rows) => {
            res.end(JSON.stringify(rows))
        })
    }
)
router.setRouteAction('GET', '/users/:id', (res, req) => {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'})
        const reqObj = new RequestObject(req)
        const templatePath = '/users/:id'
        const params = router.extractParams(templatePath, reqObj.path)
        db.executeSelectQuery(queries.Q_SELECT_USERS_ID(params.id), (rows) => {
            res.end(JSON.stringify(rows))
        })
    }
)

/// POST

router.setRouteAction('POST', '/users', (res, req) => {
    let requestBody = '';
    req.on('data', (chunk) => {
        requestBody += chunk;
        if (requestBody.length > 1e7) {
            res.writeHead(413, {'Content-Type': 'text/plain; charset=UTF-8'});
            res.end(JSON.stringify({error: 'Request Entity Too Large'}));
        }
    })
    req.on('end', () => {
        let formData = qs.parse(requestBody);
        if (false === formData.hasOwnProperty('email')) {
            res.end(400, {'Content-Type': 'text/plain; charset=UTF-8'})
            res.end(JSON.stringify({error: `Bad request. Incorrect request body : ${requestBody}`}))
        }
        db.executeSelectQuery(queries.Q_SELECT_USERS_WITH_EMAIL(formData.email), (rows) => {
            if (rows.length > 0) {
                res.writeHead(409, {'Content-Type': 'text/plain; charset=UTF-8'})
                res.end(JSON.stringify({error : `Resource already exists! Request body: ${requestBody}`}))
            }
        })

    })
})

/// DELETE

router.setRouteAction('DELETE', '/users/:id', (req, res) => {
    db.executeSelectQuery(queries.Q_DELETE_USER(id), () => {

    })
})

module.exports = {
    init: init
}