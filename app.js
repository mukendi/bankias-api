const express = require('express');
const app = express();
const pool = require('./config/db');
const bodyParser = require('body-parser');
const userRoutes  = require('./router/userRoutes');
const workerRoutes = require('./router/workerRoutes');
const cors   = require('cors');
const path = require('path');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  }); 

app.use(cors());
app.use(express.urlencoded({ extended: true }));
//app.use("/uploads", express.static("uploads"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json()); 

app.use("/api/workers", workerRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;