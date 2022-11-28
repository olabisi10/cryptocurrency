const Pool = require("pg").Pool;
const dotenv = require('dotenv');

dotenv.config();


const pool = new Pool({
    user:process.env.DATABASE_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DATABASE_LOCAL,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    url:process.env.DATABASE_URL,
    
   //  url:process.env.DATABASE_URL,
   // rehost:process.env.DB_HOST_REMOTE,
   //  redatabase:process.env.DATABASE_REMOTE,
   // reuser:process.env.DATABASE_REMOTE_USER,
   // repassword:process.env.DATABASE_REMOTE_PASSWORD,
   // //  ssl: {
   // //           rejectUnauthorized: false,
   // //      }

});

module.exports = pool;



 