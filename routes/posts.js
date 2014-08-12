
var express = require('express');
var router = express.Router();
var mongoose = require ('../mongoose');

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

//Comments

//Edit Comments

module.exports = router;
