const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j8clw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const pass = 'L4v4Bb7BhF1O56ZN'
const port = 5000;

console.log(process.env.DB_PASS,process.env.DB_NAME)

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('doctors'))
app.use(fileUpload())



const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
    const volunteerCollection = client.db(`${process.env.DB_NAME}`).collection("volunteerCollection");
    const volunteerDetailCollection = client.db(`${process.env.DB_NAME}`).collection("volunteerDetailCollection");
    app.post('/volunteer', (req, res) => {
        const volunteer = req.body;
      
        console.log(volunteer)
    })
    app.post('/newService', (req, res) => {
        const title = req.body.title;
        const description = req.body.description;
        const date = req.body.date;
        const file = req.files.files;
    
        const filePath = `${__dirname}/doctors/${file.name}`;
        file.mv(filePath, err => {
            if (err) {
                console.log(err);
            }
            const newImg = req.files.files.data;
            const encImg = newImg.toString('base64');
    
            var image = {
                content: file.mimetype,
                size: file.size,
                img: Buffer.from(encImg, 'base64')
    
            }
            volunteerCollection.insertOne({ title, description,date, image })
                .then(result => {
                    res.send(result)
                })
    
        })
    });
    app.get('/getVolunteer', (req, res) => {
        volunteerCollection.find({})
            .toArray((err, documents) => {
            res.send(documents)
        })
    })
    app.get('/getVolunteerDetail/:id', (req, res) => {
        volunteerCollection.find({_id: ObjectId(req.params.id )})
            .toArray((err, documents) => {
                res.send(documents[0])
        })
    })
    app.post('/register', (req, res) => {
        volunteerDetailCollection.insertOne(req.body)
            .then(result => {
        })
    })
    app.get('/eventTask', (req, res) => {
        volunteerDetailCollection.find({ email: req.query.email })
            .toArray((err, document) => {
            res.send(document)
        })
    })
    app.get('/allVolunteer', (req, res) => {
        volunteerDetailCollection.find({})
            .toArray((err, documents) => {
            res.send(documents)
        })
    })
    app.delete('/delete/:id', (req, res) => {
        volunteerDetailCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
            console.log(result)
        })
    })
    app.delete('/cancel/:id', (req, res) => {
        volunteerDetailCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result);
                console.log(result)
        })
    })

});


app.get('/', (req, res) => {
  res.send('this is very smooth app')
})

app.listen(process.env.PORT ||port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})