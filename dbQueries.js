const Q_SELECT_USERS_ALL = 'SELECT * FROM appusers'
const Q_SELECT_USERS_ID = (userId) => `SELECT * FROM appusers WHERE id=${userId}`
const Q_SELECT_USERS_WITH_EMAIL = (email) => `SELECT * FROM appusers WHERE email=${email}`

const Q_INSERT_USER = (email) => `INSERT INTO appusers (email) VALUES (${email})`
const Q_INSERT_NOTE = (text) => `INSERT INTO notes (text) VALUES (${text})`


const Q_UPDATE_USER = (id, email) => `UPDATE appusers SET email=${email} WHERE id=${id}`
const Q_UPDATE_NOTES = (id, text) => `UPDATE notes SET text=${text} WHERE id=${id}`

const Q_DELETE_USER = (id) => `DELETE FROM appusers WHERE id=${id}`
const Q_DELETE_NOTE = (id) => `DELETE FROM notes WHERE id=${id}`



module.exports = {
    Q_SELECT_USERS_ALL : Q_SELECT_USERS_ALL,
    Q_SELECT_USERS_ID : Q_SELECT_USERS_ID,
    Q_SELECT_USERS_WITH_EMAIL : Q_SELECT_USERS_WITH_EMAIL,
    Q_INSERT_USER : Q_INSERT_USER,
    Q_INSERT_NOTE : Q_INSERT_NOTE,
    Q_UPDATE_USER : Q_UPDATE_USER,
    Q_UPDATE_NOTES : Q_UPDATE_NOTES,
    Q_DELETE_NOTE : Q_DELETE_NOTE,
    Q_DELETE_USER : Q_DELETE_USER,
}

