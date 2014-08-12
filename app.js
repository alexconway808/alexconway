//Middleware Dependencies
var mongoose = require ('./mongoose'); //won't show up in dependencies?
var methodOverride = require ('method-override'); //need this?
var session = require ('express-session'); //need this?
var jade = require ('jade'); 
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


//Blog Tasks

//Setup mongolab, it was down for me

//Create the Post schema
var Schema = mongoose.Schema;

//Define the Post schema
var postSchema = new Schema;
    title: String,
    body: String,
    tags: String,
    created: new Date (),
    modified: new Date (),
    status: String, 
    author: String,

//Define the Post model
var Post = mongoose.model('Post', postSchema);

router.use('/posts', function(req, res, next){ //anyone should have access to posts
    if(req.session.user) // may not need this, don't need login to view Posts
})


//Get Posts - list works with Jade templates
app.get('/posts', function (req, res){
    Post.find(function (err, tasks){
        res.render('post/list.jade',{posts: posts});
    });
});


//Get New Posts - new form
app.get('/posts/new', function (req, res){
    res.render('posts/new.jade');
});


//Post - create redirect
app.post('/post', function (req, res){
    var newPost = new Post({
        title: req.param ('title'),
        body: req.param ('body'),
        tags: req.param ('tags'), //Array?
        created: new Date (), //Pull dynamically?
        modified: new Date (), //Pull dynamically?
        status: req.param ('published'),
        author: req.param ('userid') //connect to logged in userid
    })
    //What does this do?
    newPost.save(function (wert, post){
        if(wert){res.send(500, wert);}

        res.redirect('/posts');
    });
});

//Get Post with id - show with Jade template
app.get('/posts:id', function (req, res){
    var id = req.params.id;
    Post.findOne({_id: id}, function (err, post){
        var options = {};
        options.currentPost = post;
        res.render('posts/show.jade', options);
    });
});

//Get Posts with id and edit with a form
app.get('/posts/:id/edit', function (req, res){
    Post.findOne(req.params.id, function (err, post){
        var options = {};
        options.currentPost = post;
        res.render('posts/edit.jade', options);
    });
});


//Put Posts with id - update with a redirect
app.put ('tasks/:id', function (req, res){
    var id = req.params.id;
    Post.findOneAndUpdate(
        {_id: id},
        {
            title: req.param ('title'),
            body: req.param ('body'),
            tags: req.param ('tags'), //Array?
            created: new Date (), //Pull dynamically?
            modified: new Date (), //Pull dynamically?
            status: req.param ('published'),
            author: req.param ('userid') //connect to logged in
        },
        function (err, task) {
            res.redirect('/posts');
        }
    )
});


//Delete Posts with id - destroy with redirect
app.delete ('/posts/:id', function (req, res){
    Post.findByIdAndRemove(req.params.id, function (err, task){
        res.redirect('/tasks')
    });
});

module.exports = router;


//Authentication

//Comments


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
