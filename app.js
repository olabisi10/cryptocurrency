const express = require('express');
const app = express();
const dotenv = require('dotenv');
const pool = require("./model/userdb")

//Import Routes
const authRoute = require('./routes/UserRoutes');

//useUnifiedTopology
dotenv.config();


  
//Middleware
 app.use(express.json())
 
app.get('/', (req,res) => {
    res.json("Hello welcome to Analkel...... ")
}
)

//Route Middlewares
app.use('/api/user',authRoute);
const server = app.listen(process.env.PORT || 9000, () => {
    const port = server.address().port;
    console.log(`Express is working on port ${port}`);
  });

// app.listen(process.env.PORT || 9000, () => console.log('Server Up and running...'));    