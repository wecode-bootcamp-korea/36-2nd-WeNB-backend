const { DataSource } = require("typeorm");
// const Database = require("./database");

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
});

// const database = new Database(appDataSource)
//TypeError: Database is not a constructor ???
  module.exports = {
      appDataSource
  }  