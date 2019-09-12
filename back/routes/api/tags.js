var router = require('express').Router();
var mongoose = require('mongoose');
var Car = mongoose.model('Car');

// return a list of tags
router.get('/', function(req, res, next) {
  Car.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
