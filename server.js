const express = require('express');
const path = require('path');
const fs = require('fs');

const uuid = require('./helpers/uuid');

const PORT =process.env.PORT || 3001;

const app=express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// to get the home page 
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/index.html'))
});

//to get the notes page 
app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/notes.html'))
});

