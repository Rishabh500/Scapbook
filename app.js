const express = require('express');
const mongoose = require('mongoose');

//Middleware
const app = express();

const port = process.env.PORT || 5000;

app.get('/',(req,res)=>{
  res.send('It Works..');
});

app.listen(port,() => {
  console.log(`App started on port ${port}`)
});