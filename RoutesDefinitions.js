const router = require('./Router')
const RouterRequest = require("./RouterRequest");
const db = require('./DatabaseHelper')
const queries = require('./dbQueries')
// const querystring = require('querystring')
// const formidable = require('formidable')

const headers = {
    PLAIN: {'Content-Type': 'text/plain; charset=UTF-8'},
    JSON: {'Content-Type': 'application/json; charset=UTF-8'}
}

const init = () => {
    router.updateAllRoutes()
    router.setRouteAction('GET', '/', (res) => {
        res.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'})
        res.end(JSON.stringify(router.everyRoute))
    })
}

/// GET

router.setRouteAction('GET', '/users/:userId/notes/:noteId', (res, req) => {
    const reqObj = new RouterRequest(req)
    const templatePath = '/users/:userId/notes/:noteId'
    const params = router.extractParams(templatePath, reqObj.path)

    res.writeHead(200, headers.PLAIN)
    res.end(JSON.stringify(params))
})
router.setRouteAction('GET', '/users/all', (res) => {
        res.writeHead(200, headers.PLAIN)
        db.executeSelectQuery(queries.Q_SELECT_USERS_ALL, (rows) => {
            res.end(JSON.stringify(rows))
        })
    }
)
router.setRouteAction('GET', '/users/:id', (res, req) => {
        res.writeHead(200, headers.PLAIN)
        const reqObj = new RouterRequest(req)
        const templatePath = '/users/:id'
        const params = router.extractParams(templatePath, reqObj.path)
        db.executeSelectQuery(queries.Q_SELECT_USERS_ID(params.id), (rows) => {
            res.end(JSON.stringify(rows))
        })
    }
)

/// POST

router.setRouteAction('POST', '/users', (res, req) => {
    RouterRequest.extractRequestBody(req).then((reqBody) => {
        if (false === RouterRequest.checkRequestBodyFields(res, reqBody.fields, ['email']))
        {
            return
        }
        let userEmail = reqBody.fields['email']
        db.executeSelectQuery(queries.Q_SELECT_USERS_WITH_EMAIL(userEmail), (rows) => {
            if (rows.length > 0) {
                res.writeHead(409, {'Content-Type': 'text/plain; charset=UTF-8'})
                res.end(JSON.stringify({error: `Resource already exists! Email : ${userEmail}`}))
                return
            }
            db.executeDMLQuery(queries.Q_INSERT_USER(userEmail))
            db.executeSelectQuery(queries.Q_SELECT_USERS_WITH_EMAIL(userEmail), (rows) => {
                res.writeHead(200, {'Content-Type': 'text/json; charset=UTF-8'})
                res.end(JSON.stringify(rows[0]))
            })

        })
    })
})

router.setRouteAction('POST', '/notes', (res, req) => {
    RouterRequest.extractRequestBody(req).then((reqBody) => {
        let fields = reqBody.fields
        if (false === RouterRequest.checkRequestBodyFields(res, fields, ['text', 'email']))
        {
            return;
        }
        let noteText = fields['text']
        let userEmail = fields['email']

        db.executeSelectQuery(queries.Q_SELECT_USERS_WITH_EMAIL(userEmail), (rows) => {
            if (rows === undefined || rows === null || rows.length === 0) {
                res.writeHead(404, headers.JSON)
                res.end(JSON.stringify({error: `Nonexistent email ${userEmail}!`}))
                return
            }
            let userId = parseInt(rows[0].id)
            db.executeDMLQuery(queries.Q_INSERT_NOTE(noteText, userId))
            db.executeSelectQuery(queries.Q_SELECT_NOTE(noteText, userId), (rows) => {
                res.writeHead(200, headers.JSON)
                res.end(JSON.stringify(rows))
            })
        })
    }).catch(
        (err) => {
            res.writeHead(400, headers.JSON)
            res.end(JSON.stringify(err))
        }
    )
})

/// DELETE

router.setRouteAction('DELETE', '/users/:id', (res, req) => {
    const reqObj = new RouterRequest(req)

    const params = router.extractParams('/users/:id', reqObj.path);
    const id = parseInt(params.id)
    if (isNaN(id))
    {
        res.writeHead(400, headers.JSON)
        res.end(JSON.stringify({error : `id must be numeric!`}))
        return
    }
    db.executeSelectQuery(queries.Q_SELECT_USERS_ID(params.id), (rows) => {
        if (rows.length === 0)
        {
            res.writeHead(404, headers.JSON)
            res.end(JSON.stringify({error : `Resource with id ${id} to be deleted is nonexistent!`}))
            return
        }
        db.executeDMLQuery(queries.Q_DELETE_USER(id))
        db.executeDMLQuery(queries.Q_DELETE_NOTES_BY_USER_ID(id))
        res.writeHead(200, headers.JSON)
        res.end(JSON.stringify(rows[0]))
    })
})

router.setRouteAction('DELETE', '/notes/:id', (res, req) => {
    const reqObj = new RouterRequest(req)
    const params = router.extractParams('/notes/:id', reqObj.path);
    if (false === RouterRequest.checkParameterIsNumeric(res, 'id', params.id))
    {
        return
    }
    const noteId = parseInt(params.id, 10)

    db.executeSelectQuery(queries.Q_SELECT_NOTE_BY_ID(noteId), (rows) => {
        if (rows.length === 0)
        {
            res.writeHead(404, headers.JSON)
            res.end(JSON.stringify({error : `Resource with id ${noteId} to be deleted is nonexistent!`}))
            return
        }
        db.executeDMLQuery(queries.Q_DELETE_NOTE(noteId))
        res.writeHead(200, headers.JSON)
        res.end(JSON.stringify(rows[0]))
    })
})

/// PUT

router.setRouteAction('PUT', '/users', (res, req) => {
    RouterRequest.extractRequestBody(req).then((reqBody) => {
        let fields = reqBody.fields
        if (false === RouterRequest.checkRequestBodyFields(res, fields, ['email']))
        {
            return
        }
        let email = fields['email'])
        db.executeSelectQuery(queries.Q_SELECT_USERS_WITH_EMAIL(fields['email']), (rows) => {
            if (rows > 0) {
                res.writeHead(, headers.JSON)
                res.end(JSON.stringify({error : `Resource already exists! Given email: ${email}`}))
            }
            // TODO FINISH THIS
            db.executeDMLQuery(queries.Q_U)
        })
    }).catch((err) => {
        res.writeHead(400, headers.JSON)
        res.end(JSON.stringify(err))
    })
})

module.exports = {
    init: init
}