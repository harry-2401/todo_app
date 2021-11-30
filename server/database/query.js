const SELECT_USER = `SELECT DISTINCT * FROM "users" WHERE username = $1`
const INSERT_USER = 'INSERT INTO "users"(username, password) VALUES($1, $2) RETURNING *'
module.exports = { SELECT_USER, INSERT_USER };
