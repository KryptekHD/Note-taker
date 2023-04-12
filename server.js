const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const uuid = require('./helpers/uuid');

const PORT =process.env.PORT || 3001;

const app=express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/index.html'))
});


app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/notes.html'))
});


app.get('api/notes',(req,res)=>{
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname,'./db/db.json')));
    console.log(notes);
    res.json(notes);

    console.log(`${req.method} request received to get notes`)
});


const readFromFile = util.promisify(fs.readFile);


const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );


const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};


app.get('/api/tips', (req, res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile('./db/tips.json').then((data) => res.json(JSON.parse(data)));
});


app.post('/api/tips', (req, res) => {
  console.info(`${req.method} request received to add a tip`);

  const { title,text } = req.body;

  if (req.body) {
    const newTip = {
      title,
      text,
      note_id: uuid(),
    };

    readAndAppend(newTip, './db/db.json');
    res.json(`Tip added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);

  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


app.post('/api/notes', (req, res) => {
  
  console.info(`${req.method} request received to submit note`);

  const { title,text } = req.body;

  
  if (title && text) {
  
    const newNote = {
     title,
     text,
    note_id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT,()=>{
    console.log(`App listening at http://localhost:${PORT} `)
})