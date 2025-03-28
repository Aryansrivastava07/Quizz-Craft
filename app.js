// const express = require('express');
const dotenv = require('dotenv');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// const app = express();
dotenv.config();

// const corsOptions = {
//     origin: '*',
//     credentials: true,
// };
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');

//calling database from db
require("./db/conn");

//calling router
const indexRouter = require('./router/index');
const userRouter = require('./router/user');
app.use(indexRouter);
app.use(userRouter);


app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port ${process.env.PORT} !`);
});




// app.post('/upload', async(req, res) => {
//     const response =await chatGPT(req.body.data);
//     const ques = JSON.parse(response);
//     console.log(ques);
//     res.json({ message:ques});
// });