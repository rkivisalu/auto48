var router = require('express').Router();
var mongoose = require('mongoose');
var Car = mongoose.model('Car');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var auth = require('../auth');

// Preload car objects on routes with ':car'
router.param('car', function(req, res, next, slug) {
  Car.findOne({ slug: slug})
    .populate('author')
    .then(function (car) {
      if (!car) { return res.sendStatus(404); }

      req.car = car;

      return next();
    }).catch(next);
});

router.param('comment', function(req, res, next, id) {
  Comment.findById(id).then(function(comment){
    if(!comment) { return res.sendStatus(404); }

    req.comment = comment;

    return next();
  }).catch(next);
});

router.get('/', auth.optional, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  if( typeof req.query.tag !== 'undefined' ){
    query.tagList = {"$in" : [req.query.tag]};
  }

  Promise.all([
    req.query.author ? User.findOne({username: req.query.author}) : null,
    req.query.favorited ? User.findOne({username: req.query.favorited}) : null
  ]).then(function(results){
    var author = results[0];
    var favoriter = results[1];

    if(author){
      query.author = author._id;
    }

    if(favoriter){
      query._id = {$in: favoriter.favorites};
    } else if(req.query.favorited){
      query._id = {$in: []};
    }

    return Promise.all([
      Car.find(query)
        .limit(Number(limit))
        .skip(Number(offset))
        .sort({createdAt: 'desc'})
        .populate('author')
        .exec(),
      Car.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function(results){
      var cars = results[0];
      var carsCount = results[1];
      var user = results[2];

      return res.json({
        cars: cars.map(function(car){
          return car.toJSONFor(user);
        }),
        carsCount: carsCount
      });
    });
  }).catch(next);
});

router.get('/feed', auth.required, function(req, res, next) {
  var limit = 20;
  var offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    Promise.all([
      Car.find({ author: {$in: user.following}})
        .limit(Number(limit))
        .skip(Number(offset))
        .populate('author')
        .exec(),
      Car.count({ author: {$in: user.following}})
    ]).then(function(results){
      var cars = results[0];
      var carsCount = results[1];

      return res.json({
        cars: cars.map(function(car){
          return car.toJSONFor(user);
        }),
        carsCount: carsCount
      });
    }).catch(next);
  });
});

router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var car = new Car(req.body.car);

    car.author = user;

    return car.save().then(function(){
      console.log(car.author);
      return res.json({car: car.toJSONFor(user)});
    });
  }).catch(next);
});

// return a car
router.get('/:car', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.car.populate('author').execPopulate()
  ]).then(function(results){
    var user = results[0];

    return res.json({car: req.car.toJSONFor(user)});
  }).catch(next);
});

// update car
router.put('/:car', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.car.author._id.toString() === req.payload.id.toString()){
      if(typeof req.body.car.title !== 'undefined'){
        req.car.title = req.body.car.title;
      }

      if(typeof req.body.car.description !== 'undefined'){
        req.car.description = req.body.car.description;
      }
      if(typeof req.body.car.kw !== 'undefined'){
        req.car.kw = req.body.car.kw;
      }
      if(typeof req.body.car.price !== 'undefined'){
        req.car.price = req.body.car.price;
      }

      if(typeof req.body.car.body !== 'undefined'){
        req.car.body = req.body.car.body;
      }

      if(typeof req.body.car.tagList !== 'undefined'){
        req.car.tagList = req.body.car.tagList
      }

      req.car.save().then(function(car){
        return res.json({car: car.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete car
router.delete('/:car', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    if(req.car.author._id.toString() === req.payload.id.toString()){
      return req.car.remove().then(function(){
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

// Favorite an car
router.post('/:car/favorite', auth.required, function(req, res, next) {
  var carId = req.car._id;

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    return user.favorite(carId).then(function(){
      return req.car.updateFavoriteCount().then(function(car){
        return res.json({car: car.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// Unfavorite an car
router.delete('/:car/favorite', auth.required, function(req, res, next) {
  var carId = req.car._id;

  User.findById(req.payload.id).then(function (user){
    if (!user) { return res.sendStatus(401); }

    return user.unfavorite(carId).then(function(){
      return req.car.updateFavoriteCount().then(function(car){
        return res.json({car: car.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// return an car's comments
router.get('/:car/comments', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.car.populate({
      path: 'comments',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(car) {
      return res.json({comments: req.car.comments.map(function(comment){
        return comment.toJSONFor(user);
      })});
    });
  }).catch(next);
});

// create a new comment
router.post('/:car/comments', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    var comment = new Comment(req.body.comment);
    comment.car = req.car;
    comment.author = user;

    return comment.save().then(function(){
      req.car.comments.push(comment);

      return req.car.save().then(function(car) {
        res.json({comment: comment.toJSONFor(user)});
      });
    });
  }).catch(next);
});

router.delete('/:car/comments/:comment', auth.required, function(req, res, next) {
  if(req.comment.author.toString() === req.payload.id.toString()){
    req.car.comments.remove(req.comment._id);
    req.car.save()
      .then(Comment.find({_id: req.comment._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
