const config = {
  user: process.env.DB_USERNAME_DEV,
  password: process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME_DEV,
  host: process.env.DB_HOST_DEV,
  port: 5432,
};

module.exports = config