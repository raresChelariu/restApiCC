const url = require('url')
// const querystring = require('querystring')
const formidable = require('formidable')

// noinspection JSDeprecatedSymbols
class RouterRequest {
    constructor(req) {
        this.parsedUrl = (req.url !== undefined ? url.parse(req.url, true) : undefined)
        this.method = req.method
        this.path = (this.parsedUrl !== undefined ? this.parsedUrl.pathname : req.url)
    }
    static extractRequestBody(req) {
        return new Promise(((resolve, reject) => {
            let form = new formidable.IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err)
                    resolve()
                    return;
                }
                resolve({fields: fields, files: files})
            })
        }))
    }
    static checkRequestBodyFields(res, fields, required)
    {
        for (let i = 0; i < required.length; i++)
        {
            if (fields[required[i]] === undefined)
            {
                res.writeHead(400, {'Content-Type': 'text/plain; charset=UTF-8'})
                res.end(JSON.stringify({'error': `Bad request. Request body incomplete! Fields :${JSON.stringify(Object.keys(fields))} ; Required ${JSON.stringify(required)}`}))
                return false
            }
        }
        return true
    }
    static checkParameterIsNumeric(res, paramName, paramValue)
    {
        let isNonNumeric = isNaN(parseInt(paramValue, 10))
        if (isNonNumeric)
        {
            res.writeHead(400, {'Content-Type': 'text/json; charset=UTF-8'})
            res.end(JSON.stringify({error : `${paramName} is not a number! Given value : ${paramValue}`}))
        }
        return true
    }
}



module.exports = RouterRequest