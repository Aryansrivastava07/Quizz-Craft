// const express = require('express');
const dotenv = require('dotenv');
const ejs = require('ejs');

const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();

// const app = express();
dotenv.config();
// app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

//calling database from db
require("./db/conn");

//calling router
const indexRouter = require('./router/index');
app.use(indexRouter);



app.listen(process.env.PORT || 3000, () => {
    console.log(`Example app listening on port ${process.env.PORT} !`);
});




// app.post('/upload', async(req, res) => {
//     const response =await chatGPT(req.body.data);
//     const ques = JSON.parse(response);
//     console.log(ques);
//     res.json({ message:ques});
// });