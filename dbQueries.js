const Q_SELECT_NOTE_BY_ID = (noteId) => `SELECT * FROM notes WHERE noteid=${noteId}`

const Q_DELETE_NOTES_BY_USER_ID = (userid) => `DELETE FROM notes WHERE userid=${userid}`

const Q_SELECT_NOTE = (noteText, userId) => `SELECT * FROM notes WHERE text=\'${noteText}\' and userid=${userId}`
const Q_SELECT_USERS_ALL = 'SELECT * FROM appusers'
const Q_SELECT_USERS_ID = (userId) => `SELECT * FROM appusers WHERE id=${userId}`
const Q_SELECT_USERS_WITH_EMAIL = (email) => `SELECT * FROM appusers WHERE email=\'${email}\'`

const Q_INSERT_USER = (email) => `INSERT INTO appusers (email) VALUES (\'${email}\')`
const Q_INSERT_NOTE = (text, userid) => `INSERT INTO notes (text, userid) VALUES (\'${text}\', ${userid})`


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
    Q_SELECT_NOTE : Q_SELECT_NOTE,
    Q_DELETE_NOTES_BY_USER_ID : Q_DELETE_NOTES_BY_USER_ID,
    Q_SELECT_NOTE_BY_ID : Q_SELECT_NOTE_BY_ID
}

