const express = require('express');
var router = express.Router();
const mysql = require('mysql');
var conn = require('../connection.js');

const app = express();

router.get('/home', function (req, res, next) {
  console.log("Home");
  res.render('home');
});




module.exports = router;