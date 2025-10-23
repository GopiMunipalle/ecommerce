const { Sequelize } = require("sequelize");
require("dotenv").config();

let database = process.env.DATABASE || "";
const dbUser = process.env.DBUSER || "";
const dbPassword = process.env.DBPASSWORD || "";
const host = process.env.DBHOST || "";
const sequelize = new Sequelize(database, dbUser, dbPassword, {
  host: host,
  dialect: "mysql",
  logging: true,
});

module.exports = {sequelize};
