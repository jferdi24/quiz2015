var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');
var sessionController = require('./controllers/session_controller');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session({
    secret: 'Quiz 2015',
    resave: true,
    saveUninitialized:true
}));
/*
 * */
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/',function (req, res, next) {
//    var now = new Date();
//    var stamp = req.session.time ? new Date(req.session.time) : new Date();
//    if (!req.path.match(/\/login|\/logout/)) {
//        req.session.redir = req.path;
//        if ((now.getMinutes() - 2) > stamp.getMinutes()) {
//            console.log('----');
//            console.log("[]: Secion caducada");
//            console.log('----');
//            delete req.session.user;
//            //var errors = req.session.errors || 'Sesi�n caducada ...';
//            //req.session.errors = {};
//            //res.render('sessions/new.ejs', { errors: errors });
//        } else {
//            console.log('Normal');
//            // refrescamos tiempo ultima peticion
//            res.locals.session = req.session;
//            req.session.time = new Date();
//            next();
//        }
//    }
//    else {
//         console.log('Normal');
//         res.locals.session = req.session;
//         next();
//    }
//    //var stamp = req.session.time ? new Date(req.session.time) : new Date();
//    //if (!req.path.match(/\/login|\/logout/)) {
//    //    // validamos tiempo ultima peticion > 2 minutos
//    //    if ((now.getMinutes() - 2) > stamp.getMinutes()) {
//    //        var errors = req.session.errors || 'Sesi�n caducada ...';
//    //        req.session.errors = {};
//    //        res.render('views/sessions/new.ejs', { errors: errors });

//    //    } else {
//    //        // refrescamos tiempo ultima peticion
//    //        res.locals.session = req.session;
//    //        req.session.time = new Date();
//    //        next();
//    //    }
//    //} 
//    ////else {
//    ////    next();
//    ////}
   
//}, routes);

app.use(function (req, res, next) {
    if (req.session.user) {// si estamos en una sesion
        if (!req.session.marcatiempo) {//primera vez se pone la marca de tiempo
             req.session.marcatiempo = (new Date()).getTime();
            
        } else {
            if ((new Date()).getTime() - req.session.marcatiempo > 120000) {//se pas� el tiempo y eliminamos la sesi�n (2min=120000ms)
                delete req.session.user;
                delete req.session.marcatiempo;
                //res.locals.session = req.session;
                //res.locals.session = req.session;  req.session.redir.toString()              
            } else {//hay actividad se pone nueva marca de tiempo
                 req.session.marcatiempo = (new Date()).getTime();   
                    //res.locals.session = req.session;           
            }            
        }        
    }
    res.locals.session = req.session;
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}, errors: []
    });
});


module.exports = app;
