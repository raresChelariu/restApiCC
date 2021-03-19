const router = require('./Router')
const RouterRequest = require("./RouterRequest");
const db = require('./DatabaseHelper')
const queries = require('./dbQueries')

const headers = {
    PLAIN: {'Content-Type': 'text/plain; charset=UTF-8'},
    JSON: {'Content-Type': 'application/json; charset=UTF-8'}
}

const init = () => {
    router.updateAllRoutes()
    router.setRouteAction('GET', '/', (res) => {
        res.writeHead(200, headers.JSON)
        res.end(JSON.stringify(router.everyRoute))
    })
}

/// GET

router.setRouteAction('GET', '/users/:userid/notes/:maxnotes', (res, req) => {
    const reqObj = new RouterRequest(req)
    const params = router.extractParams('/users/:userid/notes/:maxnotes', reqObj.path)
    const userid = parseInt(params['userid'], 10)
    const maxnotes = parseInt(params['maxnotes'], 10)

    db.executeSelectQuery(queries.Q_SELECT_NOTE_BY_USERID(userid), (rows) => {
        const maxNoNotes = rows.length > maxnotes ? maxnotes : rows.length

        res.writeHead(200, headers.JSON)
        res.end(JSON.stringify(rows.slice(0, maxNoNotes)))
    })
})
router.setRouteAction('GET', '/users/all', (res) => {
        db.executeSelectQuery(queries.Q_SELECT_USERS_ALL, (rows) => {
            res.writeHead(200, headers.JSON)
            res.end(JSON.stringify(rows))
        })
    }
)
router.setRouteAction('GET', '/notes/all', (res) => {
        db.executeSelectQuery(queries.Q_SELECT_NOTES_ALL, (rows) => {
            res.writeHead(200, headers.JSON)
            res.end(JSON.stringify(rows))
        })
    }
)
router.setRouteAction('GET', '/users/:id', (res, req) => {
    const reqObj = new RouterRequest(req)
    const params = router.extractParams('/users/:id', reqObj.path)

    const id = parseInt(params.id, 10)
    db.executeSelectQuery(queries.Q_SELECT_USERS_ID(id), (rows) => {
        res.writeHead(200, headers.JSON)
        res.end(JSON.stringify(rows[0]))
    })
})

/// POST

router.setRouteAction('POST', '/users', (res, req) => {
    RouterRequest.extractRequestBody(req).then((reqBody) => {
        if (false === RouterRequest.checkRequestBodyFields(res, reqBody.fields, ['email'])) {
            return
        }
        let userEmail = reqBody.fields['email']
        db.executeSelectQuery(queries.Q_SELECT_USERS_BY_EMAIL(userEmail), (rows) => {
            if (rows.length > 0) {
                res.writeHead(409, headers.JSON)
                res.end(JSON.stringify({error: `Resource already exists! Email : ${userEmail}`}))
                return
            }
            db.executeDMLQuery(queries.Q_INSERT_USER(userEmail))
            db.executeSelectQuery(queries.Q_SELECT_USERS_BY_EMAIL(userEmail), (rows) => {
                res.writeHead(200, headers.JSON)
                res.end(JSON.stringify(rows[0]))
            })

        })
    })
})

router.setRouteAction('POST', '/notes', (res, req) => {
    RouterRequest.extractRequestBody(req).then((reqBody) => {
        let fields = reqBody.fields
        if (false === RouterRequest.checkRequestBodyFields(res, fields, ['text', 'email'])) {
            return;
        }
        let noteText = fields['text']
        let userEmail = fields['email']

        db.executeSelectQuery(queries.Q_SELECT_USERS_BY_EMAIL(userEmail), (rows) => {
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

    db.executeSelectQuery(queries.Q_SELECT_USERS_ID(params.id), (rows) => {
        if (rows.length === 0) {
            res.writeHead(404, headers.JSON)
            res.end(JSON.stringify({error: `Resource with id ${id} to be deleted is nonexistent!`}))
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
    if (false === RouterRequest.checkParameterIsNumeric(res, 'id', params.id)) {
        return
    }
    const noteId = parseInt(params.id, 10)

    db.executeSelectQuery(queries.Q_SELECT_NOTE_BY_ID(noteId), (rows) => {
        if (rows.length === 0) {
            res.writeHead(404, headers.JSON)
            res.end(JSON.stringify({error: `Resource with id ${noteId} to be deleted is nonexistent!`}))
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
        if (false === RouterRequest.checkRequestBodyFields(res, fields, ['email', 'id'])) {
            return
        }
        let email = fields['email']
        db.executeSelectQuery(queries.Q_SELECT_USERS_BY_EMAIL(fields['email']), (rows) => {
            if (rows[0].id === reqBody.fields.id)
            {
                res.writeHead(200, headers.JSON)
                res.end(JSON.stringify(reqBody.fields))
                return
            }
            db.executeDMLQuery(queries.Q_UPDATE_USER(reqBody.fields['id'], reqBody.fields['email']))
            db.executeSelectQuery(queries.Q_SELECT_USERS_BY_EMAIL(reqBody.fields['email']), (rows) => {
                res.writeHead(201, headers.JSON)
                res.end(JSON.stringify(rows[0]))
            })
        })
        // let email = fields['email']
        // db.executeSelectQuery(queries.Q_SELECT_USERS_BY_EMAIL(fields['email']), (rows) => {
        //     if (rows > 0) {
        //         res.writeHead(200, headers.JSON)
        //         res.end(JSON.stringify(rows[0]))
        //         return
        //     }
        //     db.executeDMLQuery(queries.Q_INSERT_USER(email))
        //     db.executeSelectQuery(queries.Q_SELECT_USERS_BY_EMAIL(email), (rows) => {
        //         res.writeHead(201, headers.JSON)
        //         res.end(JSON.stringify(rows[0]))
        //     })
        // })
    }).catch((err) => {
        res.writeHead(400, headers.JSON)
        res.end(JSON.stringify(err))
    })
})
router.setRouteAction('PUT', '/notes', (res, req) => {
    RouterRequest.extractRequestBody(req).then((reqBody) => {
        let fields = reqBody.fields;
        if (false === RouterRequest.checkRequestBodyFields(res, fields, ['text', 'noteid'])) {
            return
        }
        let id = fields['noteid']
        let text = fields['text']
        db.executeSelectQuery(queries.Q_SELECT_NOTE_BY_ID(id), (rows) => {
            if (rows.length > 0) {
                db.executeDMLQuery(queries.Q_INSERT_NOTE_BY_NOTEID(text, id))
                res.writeHead(200, headers.JSON)
                res.end(JSON.stringify({id: id, text: text}))
                return
            }
            db.executeDMLQuery(queries.Q_UPDATE_NOTES(id, text))
            res.writeHead(204, headers.JSON)
            res.end(JSON.stringify({id: id, text: text}))
        })

    }).catch((err) => {
        res.writeHead(400, headers.JSON)
        res.end(JSON.stringify(err))
    })

})

module.exports = {
    init: init
}