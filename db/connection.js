
const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({ path: `${__dirname}/../.env.${ENV}` });

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
  config.ssl = { rejectUnauthorized: false }; 
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const db = new Pool(config);

if (!process.env.PGDATABASE && ENV !== "production") {
  throw new Error("No PGDATABASE configured");
} else {
  console.log(`Connected to ${ENV === "production" ? "production database" : process.env.PGDATABASE}`);
}

module.exports = db;


