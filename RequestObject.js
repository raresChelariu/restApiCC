const url = require('url')
const querystring = require('querystring')

class RequestObject {
    constructor(req) {
        let parsedUrl = url.parse(req.url)
        this.parsedUrl = url.parse(req.url)
        this.method = req.method
        this.params = querystring.parse(parsedUrl.query)
        this.path = parsedUrl.pathname
    }
}

module.exports = RequestObject