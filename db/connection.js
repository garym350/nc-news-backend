// const { Pool } = require("pg");

// const ENV = process.env.NODE_ENV || 'development'

// const config = {};

// if (ENV === "production") {
//   config.connectionString = process.env.DATABASE_URL;
//   config.max = 2;
// }

// require('dotenv').config({path: `${__dirname}/../.env.${ENV}`})

// const db = new Pool();

// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//   throw new Error("PGDATABASE or DATABASE_URL not set");
// }

// if (!process.env.PGDATABASE) {
//     throw new Error("No PGDATABASE configured")
// } else { 
//     console.log(`Connected to ${process.env.PGDATABASE}`)
// }



// module.exports = new Pool(config);
// module.exports = db;

const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 2,
      }
    : {};

const db = new Pool(config);

console.log(`Connected to ${ENV === "production" ? "Supabase" : process.env.PGDATABASE}`);

module.exports = db;
