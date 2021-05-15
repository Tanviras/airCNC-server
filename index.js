const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
// const fs= require('fs-extra');
var ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjygh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('services'));
app.use(fileUpload())

const port = 5000;

app.get('/', function (req, res) {
    res.send('hello world')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect((err) => {
    const experiencesCollection = client.db("airCnc").collection("experiences");
    const homesCollection = client.db("airCnc").collection("homes");
    console.log('db connection successfully');



    app.post("/addExperiences", (req, res) => {

        const file = req.files.file;
        const hostName = req.body.hostName;
        const email = req.body.email;
        const location= req.body.location;
        const price= req.body.price;
        const heading= req.body.heading;
        const description=req.body.description;

        console.log(hostName,email,location,price,heading,description);
      
        const newImg = file.data;
        const encImg= newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')//warning gone after using 'from'
        };


        experiencesCollection.insertOne({hostName,email,location,price,heading,description,image})
        .then(result => {
            res.send(result.insertedCount > 0);
            })
        });





        app.post("/addHomes", (req, res) => {

            const hostName = req.body.hostName;
            const email = req.body.email;
            const homeName = req.body.homeName;
            const category = req.body.category;
            const location = req.body.location;
            const guest=req.body.guest;
            const bedrooms=req.body.bedrooms;
            const beds=req.body.beds;
            const bathrooms=req.body.bathrooms;
            const swimmingPool=req.body.swimmingPool;
            const price = req.body.price;
    
            console.log( hostName,email,homeName,category,location,guest,bedrooms,beds,bathrooms,swimmingPool,price);


            //image-1
            const file = req.files.file;
            
          
            const newImg = file.data;
            const encImg= newImg.toString('base64');
    
            var image = {
                contentType: file.mimetype,
                size: file.size,
                img: Buffer.from(encImg, 'base64')//warning gone after using 'from'
            };


            // image-2
            const fileTwo = req.files.fileTwo;

            const newImgTwo = fileTwo.data;
            const encImgTwo = newImgTwo.toString('base64');
    
            var imageTwo = {
                contentType: fileTwo.mimetype,
                size: fileTwo.size,
                img: Buffer.from(encImgTwo, 'base64')//warning gone after using 'from'
            };


    
    
            homesCollection.insertOne({hostName,email,homeName,category,location,guest,bedrooms,beds,bathrooms ,price,image,imageTwo})
            .then(result => {
                res.send(result.insertedCount > 0);
                })
            });


  
    app.get("/homes", (req, res) => {
        homesCollection.find({}).toArray((err, documents) => {
          res.send(documents);
        });
      });   

    app.get("/experiences", (req, res) => {
        experiencesCollection.find({}).toArray((err, documents) => {
        res.send(documents);
    });
    });   


      app.get("/homesById", (req, res) => {
        homesCollection
          .find({ _id: ObjectId(`${req.query._id}`) })
          .toArray((err, documents) => {
            res.send(documents);
          });
      });

      


});//client.connect

app.listen(process.env.PORT|| 5000)