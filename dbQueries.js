class DBQueries {

    static Q_SELECT_NOTE_BY_ID = (noteId) => `SELECT * FROM notes WHERE noteid=${noteId}`
    static Q_SELECT_NOTE = (noteText, userId) => `SELECT * FROM notes WHERE text=\'${noteText}\' and userid=${userId}`
    static Q_SELECT_USERS_ALL = 'SELECT * FROM appusers'
    static Q_SELECT_USERS_ID = (userId) => `SELECT * FROM appusers WHERE id=${userId}`
    static Q_SELECT_USERS_BY_EMAIL = (email) => `SELECT * FROM appusers WHERE email=\'${email}\'`
    static Q_SELECT_NOTE_BY_USERID = (userid) => `SELECT * FROM notes WHERE userid=${userid}`
    static Q_SELECT_NOTES_ALL = () => `SELECT * FROM notes`

    static Q_INSERT_USER = (email) => `INSERT INTO appusers (email) VALUES (\'${email}\')`
    static Q_INSERT_NOTE = (text, userid) => `INSERT INTO notes (text, userid) VALUES (\'${text}\', ${userid})`
    static Q_INSERT_NOTE_BY_NOTEID = (text, id) => `INSERT INTO notes (text, userid) VALUES (\'${text}\', ${id})`

    static Q_UPDATE_USER = (id, email) => `UPDATE appusers SET email=${email} WHERE id=${id}`
    static Q_UPDATE_NOTES = (id, text) => `UPDATE notes SET text=${text} WHERE userid=${id}`

    static Q_DELETE_USER = (id) => `DELETE FROM appusers WHERE id=${id}`
    static Q_DELETE_NOTE = (id) => `DELETE FROM notes WHERE id=${id}`
    static Q_DELETE_NOTES_BY_USER_ID = (userid) => `DELETE FROM notes WHERE userid=${userid}`
}

module.exports = DBQueries
