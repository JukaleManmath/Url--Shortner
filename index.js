const express = require("express");
const urlRoute = require('./routes/urlRoute');
const { connectToMongoDb } = require('./connect');
const staticRoute = require('./routes/staticRouter')
const URL = require('./models/urlModel')
const path = require("path");

const app = express();
const PORT = 8001;

connectToMongoDb("mongodb://localhost:27017/short-url")
    .then(() => { console.log("MongoDb Connected")})

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use("/url", urlRoute);
app.use("/", staticRoute);


app.get('/url/:shortId', async (req , res) => {
    const shortId = req.params.shortId;
    const  entry = await URL.findOneAndUpdate(
    {
        shortId,
    },{
        $push: {
        visitHistory: {
            timestamp: Date.now(),
        },
        }
    })
     res.redirect(entry.redirectURL);
});


app.listen(PORT, ()=>{console.log(`Server Started at PORT: ${PORT}`)});