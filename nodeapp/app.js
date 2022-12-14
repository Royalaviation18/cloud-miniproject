var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var connection = require('./connection');
var app = express();

var login = require('./routes/login');
var home = require('./routes/home');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(login);
app.use(home);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

//signup
app.post('/submit', function (req, res, next) {
  console.log('submit form');
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var aadhaar = req.body.aadhaar;
  var password = req.body.password;

  var sql = `INSERT INTO userDetails (userName, userMobile,userEmail,userPassword,userDoc) VALUES ("${name}", "${mobile}", "${email}","${password}","${aadhaar}");`
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log('inserted');
    res.redirect('/login');
  })
})


//login
app.post('/login', (req, res) => {
  console.log("Entered login module");
  var email = req.body.email;
  var password = req.body.password;
  var query = connection.query('Select * from userDetails where userEmail = ? and userPassword = ?', [email, password], function (err, results, fields) {
    if (err) throw err;
    console.log(email);
    console.log(password);
    if (results.length > 0) {
      // req.session.usrid = user.userId;
      // req.session.loggedin = true;
      // console.log(req.session.usrid);
      // req.session.save();
      console.log("hey");
      res.redirect('/home');
    } else {
      console.log('Incorrect Username and/or Password!');
      res.redirect('/');
    }
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(80, () => {
  console.log('Server started on port 80');
});
module.exports = app;
