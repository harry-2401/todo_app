const SELECT_USER = `SELECT DISTINCT * FROM "users" WHERE username = $1`;
const INSERT_USER =
  'INSERT INTO "users"(username, password, email) VALUES($1, $2, $3) RETURNING *';
const SELECT_USER_BY_EMAIL = `SELECT DISTINCT * FROM "users" WHERE email = $1`;
const UPDATE_PASSWORD = `UPDATE "users" SET password=$1 WHERE id=$2 RETURNING *`;
const SELECT_USER_BY_ID = `SELECT DISTINCT * FROM "users" WHERE id = $1`;
const CREATE_POST = `INSERT INTO "posts"(title, description, url, status, "user") VALUES ($1, $2, $3, $4, $5) RETURNING *`;
const SELECT_ALL_POST = `SELECT * FROM "posts" WHERE "user"=$1`;
const SELECT_POST_BY_ID = `SELECT DISTINCT * FROM "posts" WHERE id=$1`;
const UPDATE_POST_BY_ID = `UPDATE "posts" SET title=$1, description=$2, url=$3, status=$4 WHERE id=$5 RETURNING *`;
const DELETE_POST = `DELETE FROM "posts" WHERE id=$1 AND "user"=$2 RETURNING *`;

module.exports = {
  SELECT_USER,
  INSERT_USER,
  SELECT_USER_BY_EMAIL,
  UPDATE_PASSWORD,
  SELECT_USER_BY_ID,
  CREATE_POST,
  SELECT_ALL_POST,
  SELECT_POST_BY_ID,
  UPDATE_POST_BY_ID,
  DELETE_POST,
};
